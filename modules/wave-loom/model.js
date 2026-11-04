/* Wave Loom: dimensionless small-displacement string, no hardware interface. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WaveString = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const DT = 1 / 480;
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  class StringModel {
    constructor({ count = 129, speed = 0.22, damping = 0.08, boundary = 'fixed' } = {}) {
      if (!Number.isInteger(count) || count < 17 || count > 257) throw new RangeError('17–257 points required');
      this.count = count;
      this.dx = 1 / (count - 1);
      this.y = new Float64Array(count);
      this.v = new Float64Array(count);
      this.time = 0;
      this.setParameters({ speed, damping, boundary });
    }
    setParameters({ speed = this.speed, damping = this.damping, boundary = this.boundary } = {}) {
      if (!Number.isFinite(speed) || speed < 0.08 || speed > 0.4) throw new RangeError('Speed must be 0.08–0.4');
      if (!Number.isFinite(damping) || damping < 0 || damping > 2) throw new RangeError('Damping must be 0–2');
      if (!['fixed', 'free'].includes(boundary)) throw new RangeError('Unknown boundary');
      this.speed = speed; this.damping = damping; this.boundary = boundary;
      this.constrain();
    }
    clear() { this.y.fill(0); this.v.fill(0); this.time = 0; }
    constrain(holds = []) {
      if (this.boundary === 'fixed') {
        this.y[0] = this.y[this.count - 1] = this.v[0] = this.v[this.count - 1] = 0;
      }
      for (const h of holds) {
        if (!Number.isInteger(h.index) || h.index < 1 || h.index >= this.count - 1 || !Number.isFinite(h.y)) continue;
        this.y[h.index] = clamp(h.y, -0.85, 0.85); this.v[h.index] = 0;
      }
    }
    // Symmetric velocity-Verlet with exact half-step linear velocity damping.
    // Free-end masses carry half a cell: the endpoint acceleration is 2*k*delta.
    step(holds = []) {
      const n = this.count, y = this.y, v = this.v;
      const k = (this.speed / this.dx) ** 2, half = DT / 2, decay = Math.exp(-this.damping * half);
      this.constrain(holds);
      for (let i = 0; i < n; i++) {
        const lap = i === 0 ? 2 * (y[1] - y[0]) : i === n - 1 ? 2 * (y[n - 2] - y[n - 1]) : y[i - 1] - 2 * y[i] + y[i + 1];
        v[i] = decay * v[i] + half * k * lap;
      }
      // Do not drift held or fixed nodes.
      if (this.boundary === 'fixed') v[0] = v[n - 1] = 0;
      for (const h of holds) if (Number.isInteger(h.index) && h.index > 0 && h.index < n - 1 && Number.isFinite(h.y)) v[h.index] = 0;
      for (let i = 0; i < n; i++) y[i] += DT * v[i];
      this.constrain(holds);
      for (let i = 0; i < n; i++) {
        const lap = i === 0 ? 2 * (y[1] - y[0]) : i === n - 1 ? 2 * (y[n - 2] - y[n - 1]) : y[i - 1] - 2 * y[i] + y[i + 1];
        v[i] = (v[i] + half * k * lap) * decay;
      }
      this.constrain(holds); this.time += DT;
    }
    pulse(center = 0.35, amplitude = 0.5, direction = 0, width = 0.065) {
      if (![center, amplitude, direction, width].every(Number.isFinite) || width <= 0) return;
      for (let i = 0; i < this.count; i++) {
        const d = i * this.dx - center;
        const f = amplitude * Math.exp(-0.5 * (d / width) ** 2);
        this.y[i] += f;
        // Right-moving wave y=f(x-ct) has velocity -c*f'(x).
        this.v[i] += direction * this.speed * d / (width * width) * f;
      }
      this.constrain();
    }
    standing(mode = 3, amplitude = 0.52) {
      this.clear();
      mode = clamp(Math.round(mode), 1, 8);
      for (let i = 0; i < this.count; i++) this.y[i] = amplitude * (this.boundary === 'fixed' ? Math.sin(mode * Math.PI * i * this.dx) : Math.cos(mode * Math.PI * i * this.dx));
      this.constrain();
    }
    energy() {
      let kinetic = 0, elastic = 0;
      for (let i = 0; i < this.count; i++) {
        kinetic += 0.5 * this.dx * (i === 0 || i === this.count - 1 ? 0.5 : 1) * this.v[i] ** 2;
        if (i) elastic += 0.5 * this.speed ** 2 / this.dx * (this.y[i] - this.y[i - 1]) ** 2;
      }
      return { kinetic, elastic, total: kinetic + elastic };
    }
  }
  return { StringModel, DT, clamp };
}));
