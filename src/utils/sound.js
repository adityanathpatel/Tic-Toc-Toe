/**
 * Synthesized Web Audio API sound manager.
 * Generates custom sound waves without relying on any external audio files.
 */

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.2, delay = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + delay;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Audio playback fails gracefully if blocked by browser autoplay policy
    }
  }

  playMove(player) {
    if (player === 'X') {
      // High electric harmonic chime for X
      this.playTone(520, 'sine', 0.1, 0.22, 0);
      this.playTone(780, 'triangle', 0.15, 0.18, 0.04);
    } else {
      // Warm resonant tone for O
      this.playTone(392, 'sine', 0.12, 0.22, 0);
      this.playTone(493.88, 'triangle', 0.16, 0.16, 0.05);
    }
  }

  playWin() {
    if (!this.enabled) return;
    // Ascending major chord arpeggio: C5 -> E5 -> G5 -> C6
    const chord = [523.25, 659.25, 783.99, 1046.50];
    chord.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.28, 0.25, idx * 0.09);
    });
  }

  playTie() {
    if (!this.enabled) return;
    // Gentle descending triad
    this.playTone(440, 'sine', 0.18, 0.18, 0);
    this.playTone(370, 'sine', 0.18, 0.18, 0.1);
    this.playTone(330, 'sine', 0.28, 0.18, 0.2);
  }

  playClick() {
    this.playTone(800, 'sine', 0.05, 0.08);
  }

  playError() {
    this.playTone(180, 'sawtooth', 0.12, 0.15);
  }
}

export const sound = new SoundSynthesizer();
