/* UI and Canvas 2D presentation. No external dependencies or device access. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const { StringModel, DT, clamp } = WaveString;
  const model = new StringModel();
  const canvas = $('loom'), ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const holds = new Map();
  let paused = reduce.matches, slow = false, scene = 'explore', mode = 3;
  let width = 350, height = 310, raf = 0, last = 0, accumulator = 0, history = [], lastTrail = 0;
  let selected = 43, keyboardHold = false, visible = !document.hidden, energy = model.energy();
  const scenes = {
  "explore": [
    "TRANSVERSE WAVES",
    "The wave travels. The beads oscillate.",
    "Follow one golden bead: its transverse displacement is its signed up-and-down offset from the resting line. The disturbance propagates along the string while each bead stays at the same horizontal position. Your finger supplies the energy."
  ],
  "echo": [
    "BOUNDARY REFLECTION",
    "A reflected pulse can flip its sign.",
    "A fixed end forces zero displacement, so the returning pulse flips: phase inversion. Switch to “Free to slide” and replay Echo to see reflection without inversion."
  ],
  "cancel": [
    "SUPERPOSITION / INTERFERENCE",
    "They cancel. They don’t vanish.",
    "Wave displacements add: that’s superposition. Opposite pulses briefly produce destructive interference, while kinetic energy remains. Then they pass through. Try ¼× slow near the middle."
  ],
  "standing": [
    "STANDING WAVES / NORMAL MODES",
    "Nodes stay still. Antinodes move most.",
    "A normal mode is a natural vibration pattern. Nodes have zero displacement; antinodes have the largest amplitude. Tap Stand still again to explore another mode."
  ]
};
  function announcement(text) { $('status').textContent = text; }
  function setScene(name) {
    scene = name;
    const copy = scenes[name];
    $('insightKicker').textContent = copy[0]; $('insightTitle').textContent = copy[1]; $('insightText').textContent = copy[2];
    document.querySelectorAll('[data-scene]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scene === name)));
  }
  function releaseHolds() {
    const ids = [...holds.keys()]; holds.clear(); keyboardHold = false;
    for (const id of ids) if (typeof id === 'number' && canvas.hasPointerCapture?.(id)) canvas.releasePointerCapture(id);
  }
  function sync() {
    document.body.dataset.paused = String(paused);
    $('pause').textContent = paused ? 'Resume' : 'Pause';
    $('pause').setAttribute('aria-pressed', String(paused));
    $('stateLabel').textContent = paused ? 'PAUSED · SHAPE & RESUME' : 'LIVE STRING';
    $('slow').setAttribute('aria-pressed', String(slow));
    $('fixed').setAttribute('aria-pressed', String(model.boundary === 'fixed'));
    $('free').setAttribute('aria-pressed', String(model.boundary === 'free'));
    $('endLabel').textContent = model.boundary === 'fixed' ? 'FIXED ENDS' : 'ENDS FREE TO SLIDE';
  }
  function schedule() {
    if (!raf && !paused && visible && (energy.total > 1e-9 || holds.size)) raf = requestAnimationFrame(frame);
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; accumulator = 0; }
  function setPaused(value) {
    paused = value; stop(); sync(); render(); schedule();
  }
  function metrics() { return { left: 23, right: width - 23, center: height * 0.51, scale: height * 0.31 }; }
  function resize() {
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect(); width = Math.max(rect.width, 1); height = Math.max(rect.height, 1);
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(1800000 / (width * height)));
    canvas.width = Math.max(1, Math.round(width * dpr)); canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); render();
  }
  function path(values) {
    const { left, right, center, scale } = metrics();
    ctx.beginPath();
    for (let i = 0; i < values.length; i++) {
      const x = left + (right - left) * i / (values.length - 1), y = center - values[i] * scale;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
  }
  function bead(x, y, r, color) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
  }
  function render() {
    if (!ctx) return;
    const { left, right, center, scale } = metrics();
    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createRadialGradient(width * 0.45, center, 0, width * 0.45, center, width * 0.8);
    bg.addColorStop(0, '#1b3739'); bg.addColorStop(1, '#102328'); ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 1;
    for (const dy of [-1, -0.5, 0, 0.5, 1]) {
      const y = center - dy * scale;
      ctx.strokeStyle = dy === 0 ? '#b7d3cc24' : '#b7d3cc09';
      ctx.setLineDash(dy === 0 ? [2, 5] : []); ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
    }
    ctx.setLineDash([]);
    if ($('trails').checked) {
      history.forEach((old, i) => { path(old); ctx.strokeStyle = `rgba(143,218,206,${0.012 + 0.10 * (i + 1) / history.length})`; ctx.lineWidth = 1; ctx.stroke(); });
    }
    path(model.y);
    ctx.lineTo(right, center); ctx.lineTo(left, center); ctx.closePath();
    ctx.fillStyle = '#a6dfca08'; ctx.fill();
    const glow = ctx.createLinearGradient(left, 0, right, 0); glow.addColorStop(0, '#efd3a2'); glow.addColorStop(0.43, '#f5d7a4'); glow.addColorStop(1, '#8dddd1');
    path(model.y); ctx.strokeStyle = '#b1e3cf0a'; ctx.lineWidth = 13; ctx.stroke();
    path(model.y); ctx.strokeStyle = '#b1e3cf16'; ctx.lineWidth = 6; ctx.stroke();
    path(model.y); ctx.strokeStyle = glow; ctx.lineWidth = 1.7; ctx.stroke();
    for (let i = 0; i < model.count; i += 4) {
      const x = left + (right - left) * i / (model.count - 1), y = center - model.y[i] * scale;
      bead(x, y, i % 16 === 0 ? 2.4 : 1.3, i < model.count * 0.55 ? '#f2c98e' : '#8fd7cb');
    }
    // The tracked bead never changes its horizontal coordinate.
    const index = selected, tx = left + (right - left) * index / (model.count - 1), ty = center - model.y[index] * scale;
    ctx.setLineDash([2, 5]); ctx.strokeStyle = '#efc88938'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx, center - scale * 0.91); ctx.lineTo(tx, center + scale * 0.91); ctx.stroke(); ctx.setLineDash([]);
    bead(tx, ty, 9, '#efc88912'); bead(tx, ty, 4.5, '#f5d09a'); bead(tx, ty, 1.5, '#fff0d7');
    for (const i of [0, model.count - 1]) {
      const x = i === 0 ? left : right, y = center - model.y[i] * scale;
      ctx.strokeStyle = '#a7c2bb66'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, model.boundary === 'fixed' ? center - 9 : center - scale); ctx.lineTo(x, model.boundary === 'fixed' ? center + 9 : center + scale); ctx.stroke();
      bead(x, y, 5, '#11252a'); ctx.strokeStyle = '#c4d6cc'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.stroke();
    }
    for (const hold of holds.values()) {
      const x = left + (right - left) * hold.index / (model.count - 1), y = center - hold.y * scale;
      ctx.strokeStyle = '#f4d4a966'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 19, 0, Math.PI * 2); ctx.stroke(); bead(x, y, 5, '#fff0cf');
    }
    paintEnergy();
  }
  function paintEnergy() {
    const total = energy.total;
    $('motionBar').style.width = total < 1e-9 ? '0%' : `${100 * energy.kinetic / total}%`;
    $('stretchBar').style.width = total < 1e-9 ? '0%' : `${100 * energy.elastic / total}%`;
  }
  function frame(now) {
    raf = 0;
    if (paused || !visible) return;
    const elapsed = last ? Math.min(Math.max(0, (now - last) / 1000), 0.05) : 0;
    last = now; accumulator += elapsed * (slow ? 0.25 : 1);
    while (accumulator >= DT) { model.step([...holds.values()]); accumulator -= DT; }
    energy = model.energy();
    if (now - lastTrail >= 34) {
      if ($('trails').checked) { history.push(Float64Array.from(model.y)); if (history.length > 16) history.shift(); }
      lastTrail = now;
    }
    render();
    // Accessible live region is only updated by actions, not every simulation frame.
    schedule();
  }
  function resetMotion() { releaseHolds(); stop(); history = []; model.clear(); }
  function seedScene(name, resume = true) {
    resetMotion(); setScene(name);
    if (name === 'echo') model.pulse(0.38, 0.52, 1);
    else if (name === 'cancel') { model.pulse(0.22, 0.46, 1, 0.065); model.pulse(0.78, -0.46, -1, 0.065); }
    else if (name === 'standing') model.standing(mode);
    else model.pulse(0.36, 0.65, 0, 0.085);
    energy = model.energy(); if (resume) paused = false;
    sync(); render(); schedule();
    announcement(name === 'cancel' ? 'Two opposite pulses are approaching. Their displacement cancels near the middle, then they pass through.' : name === 'standing' ? `Standing wave mode ${mode}.` : name === 'echo' ? `Pulse traveling toward a ${model.boundary === 'fixed' ? 'fixed' : 'sliding'} end.` : 'A wave is moving. Pause is available.');
  }
  function position(event) {
    const rect = canvas.getBoundingClientRect(), { left, right, center, scale } = metrics();
    return { index: clamp(Math.round((event.clientX - rect.left - left) / (right - left) * (model.count - 1)), 1, model.count - 2), y: clamp((center - event.clientY + rect.top) / scale, -0.85, 0.85) };
  }
  function updateHold(id, hold) {
    holds.set(id, hold); selected = hold.index; model.constrain([...holds.values()]); energy = model.energy();
    $('gestureHint').textContent = paused ? 'SHAPE IT · THEN RESUME' : 'LET GO TO RELEASE'; render(); schedule();
  }
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0 || holds.size >= 2) return;
    event.preventDefault(); canvas.focus({ preventScroll: true }); keyboardHold = false; holds.delete('keyboard');
    canvas.setPointerCapture(event.pointerId); setScene('explore'); history = []; updateHold(event.pointerId, position(event));
  });
  canvas.addEventListener('pointermove', event => {
    if (!holds.has(event.pointerId)) return;
    event.preventDefault(); updateHold(event.pointerId, { index: holds.get(event.pointerId).index, y: position(event).y });
  });
  function releasePointer(event) {
    if (!holds.has(event.pointerId)) return;
    holds.delete(event.pointerId);
    if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    $('gestureHint').textContent = 'TOUCH · PULL · RELEASE'; energy = model.energy(); render(); schedule();
  }
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(name, releasePointer);
  canvas.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Escape'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      selected = clamp(selected + (event.key === 'ArrowLeft' ? -4 : 4), 1, model.count - 2);
      if (keyboardHold) updateHold('keyboard', { index: selected, y: holds.get('keyboard').y });
      announcement(`Selected point ${Math.round(selected / (model.count - 1) * 100)} percent along the string.`);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      keyboardHold = true; setScene('explore'); const y = (holds.get('keyboard')?.y ?? model.y[selected]) + (event.key === 'ArrowUp' ? 0.1 : -0.1);
      updateHold('keyboard', { index: selected, y: clamp(y, -0.85, 0.85) }); announcement('Point held. Press Space to release.');
    } else if (event.key === ' ') {
      if (keyboardHold) { holds.delete('keyboard'); keyboardHold = false; $('gestureHint').textContent = 'TOUCH · PULL · RELEASE'; }
      else { model.pulse(selected * model.dx, 0.4); setScene('explore'); }
      energy = model.energy(); schedule(); announcement(paused ? 'String shaped. Choose Resume to move it.' : 'Wave released.');
    } else { releaseHolds(); $('gestureHint').textContent = 'TOUCH · PULL · RELEASE'; }
    render();
  });
  canvas.addEventListener('blur', () => { if (keyboardHold) { holds.delete('keyboard'); keyboardHold = false; $('gestureHint').textContent = 'TOUCH · PULL · RELEASE'; energy = model.energy(); render(); schedule(); } });
  $('pluck').onclick = () => { seedScene('explore'); };
  $('pause').onclick = () => { setPaused(!paused); announcement(paused ? `Paused. ${energy.total > 1e-9 ? 'Energy share: ' + Math.round(100 * energy.kinetic / energy.total) + '% kinetic (motion), ' + Math.round(100 * energy.elastic / energy.total) + '% potential (stored). ' : 'The string is still. '}You can shape it, then resume.` : 'Motion resumed.'); };
  $('clear').onclick = () => { resetMotion(); setScene('explore'); energy = model.energy(); $('gestureHint').textContent = 'TOUCH · PULL · RELEASE'; render(); announcement('String cleared. Pull it or choose an experiment.'); };
  $('slow').onclick = () => { slow = !slow; sync(); announcement(slow ? 'Quarter-speed motion.' : 'Normal-speed motion.'); };
  document.querySelectorAll('[data-scene]').forEach(button => { button.onclick = () => { if (button.dataset.scene === 'standing') mode = scene === 'standing' ? mode % 5 + 1 : 3; seedScene(button.dataset.scene); }; });
  function boundary(value) {
    if (model.boundary === value) return;
    releaseHolds(); model.setParameters({ boundary: value }); history = [];
    // Restart the selected demonstration so its initial state satisfies the new ends.
    seedScene(scene, false); announcement(`${value === 'fixed' ? 'Fixed ends' : 'Ends free to slide'}. The current moment has restarted${paused ? ' while paused' : ''}.`);
  }
  $('fixed').onclick = () => boundary('fixed'); $('free').onclick = () => boundary('free');
  $('speed').addEventListener('input', () => { model.setParameters({ speed: Number($('speed').value) }); $('speedOut').textContent = `${model.speed.toFixed(2)} lengths/s`; energy = model.energy(); render(); schedule(); });
  $('damping').addEventListener('input', () => { model.setParameters({ damping: Number($('damping').value) }); $('dampingOut').textContent = model.damping === 0 ? 'None' : model.damping < 0.2 ? 'Gentle' : model.damping < 0.6 ? 'Soft' : 'Heavy'; });
  $('trails').addEventListener('change', () => { history = []; render(); });
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; releaseHolds(); stop(); if (visible) { energy = model.energy(); render(); schedule(); } });
  window.addEventListener('pagehide', () => { visible = false; releaseHolds(); stop(); });
  window.addEventListener('pageshow', () => { visible = !document.hidden; stop(); if (visible) schedule(); });
  window.addEventListener('blur', () => { releaseHolds(); $('gestureHint').textContent = 'TOUCH · PULL · RELEASE'; energy = model.energy(); render(); schedule(); });
  window.addEventListener('resize', resize);
  reduce.addEventListener?.('change', event => { if (event.matches) { setPaused(true); announcement('Motion paused for your reduced-motion preference. Resume when you choose.'); } });
  window.waveLoomDiagnostics = () => ({ paused, slow, scene, boundary: model.boundary, time: model.time, energy: { ...energy }, points: model.count, held: holds.size, history: history.length, scheduled: !!raf, width: canvas.width, height: canvas.height, finite: [...model.y, ...model.v].every(Number.isFinite), maxDisplacement: Math.max(...model.y.map(Math.abs)) });
  if (!ctx) {
    $('status').classList.remove('assist'); $('status').textContent = 'Canvas 2D is unavailable. The physics explanation and source links below still work.';
    document.querySelectorAll('button, input').forEach(element => { element.disabled = true; }); return;
  }
  resize(); seedScene('explore', !paused);
  if (paused) announcement('Motion starts paused for your reduced-motion preference. Choose Pluck a wave or Resume when you want to begin.');
}());
