/**
 * Lightweight 2D canvas particle confetti system.
 */

export class ConfettiSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.colors = ['#00f2fe', '#4facfe', '#ff416c', '#ff4b2b', '#fbbf24', '#ffffff', '#a855f7'];
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  start() {
    this.stop();
    this.resize();
    if (!this.ctx || !this.canvas) return;

    this.particles = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 40,
        y: this.canvas.height / 2,
        radius: Math.random() * 5 + 3,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 12,
        gravity: 0.22,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        opacity: 1,
        decay: Math.random() * 0.012 + 0.008
      });
    }

    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      let activeCount = 0;
      for (let p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.vRot;
        p.opacity -= p.decay;

        if (p.opacity > 0) {
          activeCount++;
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.globalAlpha = Math.max(0, p.opacity);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 1.5);
          this.ctx.restore();
        }
      }

      if (activeCount > 0) {
        this.animationId = requestAnimationFrame(animate);
      }
    };

    this.animationId = requestAnimationFrame(animate);
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
