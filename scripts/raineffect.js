// script credit: https://widget.st/widget/rain

class RainEffect {
  constructor(options = {}) {
    this.options = {
      drops: 120,          // number of raindrops
      color: "#999",       // rain color
      minSpeed: 4,         // px per frame
      maxSpeed: 12,
      dropWidth: 2,
      dropHeight: 16,
      opacity: 0.6,
      ...options
    };

    this.drops = [];
    this.running = false;
    this.rafId = null;
    this.container = null;

    this.handleResize = this.handleResize.bind(this);
  }

  start() {
    if (this.running) return;
    this.running = true;

    this.container = document.createElement("div");
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    `;
    document.body.appendChild(this.container);

    this.updateSize();
    this.createDrops();

    window.addEventListener("resize", this.handleResize);
    this.animate();
  }

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener("resize", this.handleResize);
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    this.drops = [];
  }

  createDrops() {
    const { drops, color, dropWidth, dropHeight, opacity, minSpeed, maxSpeed } = this.options;

    for (let i = 0; i < drops; i++) {
      const drop = document.createElement("div");
      drop.style.cssText = `
        position: absolute;
        width: ${dropWidth}px;
        height: ${dropHeight}px;
        background: linear-gradient(to bottom, transparent, ${color});
        opacity: ${opacity};
        will-change: transform;
        border-radius: 50% / 10%;
      `;

      this.container.appendChild(drop);

      this.drops.push({
        el: drop,
        x: Math.random() * this.width,
        y: Math.random() * this.height - dropHeight,
        speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
        length: dropHeight * (0.7 + Math.random() * 0.6)
      });
    }
  }

  updateSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  handleResize() {
    this.updateSize();
  }

  animate() {
    if (!this.running) return;

    for (const drop of this.drops) {
      drop.y += drop.speed;

      if (drop.y > this.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * this.width;
        drop.speed = this.options.minSpeed + Math.random() * (this.options.maxSpeed - this.options.minSpeed);
      }

      drop.el.style.transform = `translate3d(${drop.x}px, ${drop.y}px, 0)`;
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }
}

// === Usage ===
const rain = new RainEffect({
  drops: 140,
  color: "#8ab4f8",      // nice soft blue-grey
  minSpeed: 5,
  maxSpeed: 14,
  opacity: 0.55
});

rain.start();

// Optional: stop the rain later
// rain.stop();