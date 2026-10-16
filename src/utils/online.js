import { Peer } from 'peerjs';

/**
 * Generate a cryptographically sound or high-entropy 6-digit room code
 */
export function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Online Manager for Tic-Tac-Toe
 * Supports both WebRTC (PeerJS) for cross-device Internet play
 * and BroadcastChannel for instant local multi-tab play.
 */
export class OnlineSession {
  constructor({ role, roomCode, onConnected, onDisconnected, onMessage, onError }) {
    this.role = role; // 'host' | 'guest'
    this.roomCode = roomCode;
    this.onConnected = onConnected;
    this.onDisconnected = onDisconnected;
    this.onMessage = onMessage;
    this.onError = onError;

    this.peer = null;
    this.connection = null;
    this.broadcastChannel = null;
    this.isConnected = false;
    this.processedMessageIds = new Set();
    this.cleanupFns = [];
    this.destroyed = false;

    this.init();
  }

  init() {
    const peerPrefix = 'ttt-p2p-room-';
    const bcPrefix = 'ttt-bc-room-';

    // 1. Setup BroadcastChannel (instant local cross-tab fallback)
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel(bcPrefix + this.roomCode);
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingData(event.data, 'broadcast');
        };

        if (this.role === 'guest') {
          // Announce guest presence on broadcast channel
          setTimeout(() => {
            if (!this.destroyed) {
              this.sendBroadcast({ type: 'HANDSHAKE_GUEST_HELLO' });
            }
          }, 150);
        }
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported or restricted:', e);
    }

    // 2. Setup PeerJS (WebRTC DataChannel for cross-machine play)
    try {
      if (this.role === 'host') {
        const hostPeerId = peerPrefix + this.roomCode;
        this.peer = new Peer(hostPeerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        this.peer.on('open', (id) => {
          // Host peer is listening
        });

        this.peer.on('connection', (conn) => {
          this.setupPeerConnection(conn);
        });

        this.peer.on('error', (err) => {
          if (err.type === 'unavailable-id') {
            this.onError?.('Room code is already in use by another host. Please generate a new code.');
          } else {
            console.warn('PeerJS Host warning:', err);
          }
        });
      } else {
        // Guest role
        this.peer = new Peer({
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        this.peer.on('open', () => {
          const targetHostId = peerPrefix + this.roomCode;
          const conn = this.peer.connect(targetHostId, { reliable: true });
          this.setupPeerConnection(conn);
        });

        this.peer.on('error', (err) => {
          console.warn('PeerJS Guest error:', err);
          if (err.type === 'peer-unavailable') {
            // If PeerJS peer unavailable and broadcast not connected, notify
            if (!this.isConnected) {
              this.onError?.('Room not found. Check the 6-digit code or ensure the host is online.');
            }
          }
        });
      }
    } catch (err) {
      console.error('Peer initialization failed:', err);
    }
  }

  setupPeerConnection(conn) {
    this.connection = conn;

    conn.on('open', () => {
      this.markConnected('webrtc');
      // Send handshake
      this.send({ type: 'HANDSHAKE', role: this.role });
    });

    conn.on('data', (data) => {
      this.handleIncomingData(data, 'webrtc');
    });

    conn.on('close', () => {
      this.markDisconnected();
    });

    conn.on('error', (err) => {
      console.warn('Peer connection error:', err);
    });
  }

  handleIncomingData(payload, transport) {
    if (!payload || typeof payload !== 'object') return;

    // Deduplicate in case message arrived via both Broadcast and WebRTC
    if (payload.msgId) {
      if (this.processedMessageIds.has(payload.msgId)) return;
      this.processedMessageIds.add(payload.msgId);
      if (this.processedMessageIds.size > 200) {
        const first = this.processedMessageIds.values().next().value;
        this.processedMessageIds.delete(first);
      }
    }

    // Handle initial broadcast handshake discovery
    if (payload.type === 'HANDSHAKE_GUEST_HELLO' && this.role === 'host') {
      this.markConnected('broadcast');
      this.sendBroadcast({ type: 'HANDSHAKE_HOST_WELCOME' });
      return;
    }

    if (payload.type === 'HANDSHAKE_HOST_WELCOME' && this.role === 'guest') {
      this.markConnected('broadcast');
      return;
    }

    if (payload.type === 'HANDSHAKE') {
      this.markConnected(transport);
      return;
    }

    if (payload.type === 'DISCONNECT') {
      this.markDisconnected();
      return;
    }

    this.onMessage?.(payload);
  }

  markConnected(transport) {
    if (this.isConnected) return;
    this.isConnected = true;
    this.onConnected?.({ transport, role: this.role, roomCode: this.roomCode });
  }

  markDisconnected() {
    if (!this.isConnected) return;
    this.isConnected = false;
    this.onDisconnected?.();
  }

  send(message) {
    const payload = {
      ...message,
      msgId: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      senderRole: this.role
    };

    // Keep track of our own sent msgId so we don't process it if echoed
    this.processedMessageIds.add(payload.msgId);

    // Send over WebRTC DataChannel if open
    if (this.connection && this.connection.open) {
      try {
        this.connection.send(payload);
      } catch (err) {
        console.warn('Error sending over WebRTC:', err);
      }
    }

    // Also send over BroadcastChannel for instant local delivery
    this.sendBroadcast(payload);
  }

  sendBroadcast(payload) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (err) {
        console.warn('Error sending broadcast:', err);
      }
    }
  }

  destroy() {
    this.destroyed = true;
    if (this.isConnected) {
      try {
        this.send({ type: 'DISCONNECT' });
      } catch {}
    }

    if (this.connection) {
      try {
        this.connection.close();
      } catch {}
      this.connection = null;
    }

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.close();
      } catch {}
      this.broadcastChannel = null;
    }

    this.isConnected = false;
  }
}
