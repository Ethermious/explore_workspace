# Wave Loom · pocket experiment 07

Open `index.html` in this directory, or choose **Wave Loom** in Explore Workspace. No build, library, account, WebGL or GPU compute is required. Works as a standalone page so phones do not scroll inside a nested experiment iframe.

- Pull vertically anywhere on the thread and release. Two fingers can hold different points.
- **Pluck a wave** resets to a gentle pluck. **Pause**, **Clear** and **¼× slow** are always available.
- **Echo** starts a rightward pulse. Compare fixed and freely sliding ends.
- **Disappear** sends equal and opposite pulses toward each other. Their shape almost vanishes at overlap while their energy remains in motion. Tap the same moment to replay it.
- **Stand still** shows a natural mode. Tap again to cycle modes 1–5.
- Keyboard: Tab to the canvas. Left/right chooses a bead, up/down shapes it, Space releases it. Buttons provide non-drag alternatives. Pause announces the kinetic/potential energy shares to assistive technology.

Reduced-motion preference starts paused; Pluck, a moment button or Resume explicitly starts motion. A later reduced-motion change pauses it. Tabs that are hidden stop stepping, clear held touches, and do not catch up elapsed wall time when restored. Page hide/show handles browser history restoration. Dragging is restricted to the canvas; the rest of the page remains scrollable. No sound, vibration, sensors, storage, requests or hardware access is used. Source links only navigate when chosen.

## Model and numerical limits

We approximate the normalized-coordinate, linear small-slope string equation

    y_tt = c² y_xx − γ y_t,  0 ≤ x ≤ 1.

The string length is normalized to one; the UI reports wave speed in string lengths per simulated second. There are 129 samples in the UI. Interior acceleration is `c²/dx² * (y[i−1] − 2y[i] + y[i+1]) − γv[i]`. Fixed ends impose zero displacement and velocity. A freely sliding end has a half-cell mass and acceleration `2c²/dx² * (neighbor − endpoint)`; this corresponds to a zero-slope boundary, not a tensionless loose rope. Free ends can carry a constant displacement mode.

Velocity-Verlet spring steps with symmetric exponential half-step damping use fixed `dt=1/480 s`. UI wave speed is 0.08–0.4 normalized lengths/s, so the largest UI Courant number is 0.107. The pure model accepts at most 257 samples, giving a maximum supported Courant number of 0.214. Each animation frame contributes at most 0.05 s, with quarter-speed applied before fixed stepping. An overloaded device slows down rather than attempting an unbounded catch-up.

A traveling pulse initializes both displacement and velocity: rightward `v=−c f′(x)`, leftward `v=+c f′(x)`. A resting pluck initializes displacement only and splits into two pulses. Standing modes are sampled sines for fixed ends and cosines for free ends. Numerical dispersion means a packet is not perfectly shape-preserving.

Energy is `½ Σ m_i v_i² + ½(c²/dx) Σ(y[i+1]−y[i])²`, with cell masses `dx` and half-cell endpoint masses. The bar shows relative kinetic and potential energy shares, not an absolute energy meter. Potential energy is stored by deflection under tension; the model does not resolve material extensibility. The pure-model field named `elastic` stores this potential-energy value. Damping removes energy; dragging, changing tension/wave speed, or changing constraints may add or remove it. Switching boundaries restarts the selected moment under those boundary conditions. Finite-difference energy is approximately conserved without damping or interaction, not exactly.

The screen exaggerates transverse displacement. There is no large-deformation elasticity, gravity, material strain, breakage, nonlinear tension, real-time audio, calibrated physical units, or hardware-control claim. Trails are previous shapes of the same string. Golden beads stay at fixed horizontal material coordinates.

## Performance and verification

Canvas backing dimensions are capped at 2× device pixel ratio and approximately 1.8 million pixels. The model has a fixed sample count and at most two pointer constraints. Trails are capped at 16 snapshots. No animation frame is requested when the string is cleared or its remaining energy falls below a small threshold.

    node modules/wave-loom/test-model.cjs
    node modules/wave-loom/test-controls.cjs

The model suite covers 86,400 stability/energy steps across boundary types, grid sizes and speed extremes, reflection signs, superposition, cancellation with retained kinetic energy, damping, two holds/release and parameter guards. The control suite is mocked, not a real browser test: reduced motion, pause/resume, pointer cancellation/capture loss, multi-pointer cap, keyboard, hidden tabs, browser page lifecycle, time-step cap, clear, boundary switching, canvas fallback and direct launcher route.

Real browser/device validation is recorded in `../../docs/VALIDATION.md`. A passing desktop/cloud browser does not prove physical iPhone/Android touch behavior or battery use.

## Physics references

- [OpenStax University Physics 16.5: Interference of Waves](https://openstax.org/books/university-physics-volume-1/pages/16-5-interference-of-waves)
- [OpenStax University Physics 16.6: Standing Waves and Resonance](https://openstax.org/books/university-physics-volume-1/pages/16-6-standing-waves-and-resonance)

These sources ground the qualitative wave behavior. They do not validate this implementation; the numerical checks above do that within their stated limits.

## Engineering language, without losing the play

The on-screen insights pair precise terms with what the motion shows: transverse displacement and propagation; boundary reflection and phase inversion; superposition and destructive interference; normal modes, nodes and antinodes; kinetic and potential energy. The short moment names and touch interaction stay unchanged.
