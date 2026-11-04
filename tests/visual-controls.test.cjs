/* Deterministic control-flow regression checks, not a browser or GPU test.
 * WebGL calls are mocked: shader compilation, pixels, layout and FPS are NOT validated.
 * Run from any directory: node tests/visual-controls.test.cjs
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8').replace(/\r\n/g, '\n');
const hash = text => createHash('sha256').update(text).digest('hex');

// Recorded from the pre-visual-upgrade simulation, not recomputed expectations.
// Intentional physics changes must be reviewed separately before updating these guards.
const expected = {
  'field-lab': {
    script: 'lab.js',
    shader: '6bc5e3e0c5efe7a3f2d086a5d288f6796b6d7b2888a19cfe9fc4fe506e52377c',
    step: '245c45c588a60659f0729de23a4944035c53bca9b22e331c5b13cd2bf11f8f72',
  },
  'galaxy-encounter': {
    script: 'galaxy.js',
    shader: '8aa1d207135da1867161e7110098bae15c4db128cb4cd0edc6b363ecc919e76e',
    step: 'b6298b140dddc88b37fb183300c13341e401464542d6698f1b4f48d17eba8545',
  },
};
for (const [mod, reference] of Object.entries(expected)) {
  const source = read(`modules/${mod}/${reference.script}`);
  assert.equal(hash(source.match(/const updateVS=`[\s\S]*?`;/)[0]), reference.shader, `${mod} integrator shader changed`);
  assert.equal(hash(source.match(/function step\([^\n]+/)[0]), reference.step, `${mod} simulation step changed`);
}
assert.equal(hash(read('modules/galaxy-encounter/physics.js')), '789d8a0cb4d08438ef7c7ab0b0968eedcb48c4ba9d10de7ba5f05bb107cb1f09', 'Galaxy CPU physics changed');
console.log('PASS unchanged integration shaders, step functions and Galaxy CPU physics');

function eventTarget() {
  return {
    listeners: {},
    addEventListener(type, callback) { (this.listeners[type] ??= []).push(callback); },
    fire(type, event = {}) { for (const callback of this.listeners[type] || []) callback(event); },
    classList: {
      values: new Set(),
      toggle(name, force) {
        force ??= !this.values.has(name);
        force ? this.values.add(name) : this.values.delete(name);
        return force;
      },
      contains(name) { return this.values.has(name); },
    },
  };
}

function setup(mod, { reduced = false, noGL = false } = {}) {
  const html = read(`modules/${mod}/index.html`), elements = {}, calls = [], frames = new Map();
  let next = 0;
  // This deliberately small fixture reads actual input defaults and fails on missing IDs.
  // It is not an HTML parser or layout implementation.
  for (const match of html.matchAll(/<([a-z]+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {
    const [, tag, attrs, id] = match;
    let value = attrs.match(/\bvalue="([^"]+)"/)?.[1] || '';
    if (tag === 'select') {
      const body = html.slice(match.index + match[0].length).split('</select>')[0];
      const options = [...body.matchAll(/<option\b([^>]*)>/g)];
      value = (options.find(option => /selected/.test(option[1])) || options[0])?.[1].match(/value="([^"]+)"/)?.[1] || '';
    }
    elements[id] = {
      ...eventTarget(), value, checked: /\bchecked\b/.test(attrs), hidden: /\bhidden\b/.test(attrs),
      disabled: false, textContent: '', dataset: {}, style: {}, attributes: {}, width: 390, height: 506,
      setAttribute(name, val) { this.attributes[name] = val; },
      getBoundingClientRect: () => ({ width: 390, height: 506 }),
      setPointerCapture() {}, click() { this.onclick?.(); },
    };
  }
  const gl = new Proxy({
    getExtension: () => null, getParameter: () => 'WebGL mock',
    getShaderParameter: () => true, getProgramParameter: () => true,
    isContextLost: () => false, getError: () => 0,
  }, {
    get(target, key) {
      if (key in target) return target[key];
      if (/^[A-Z_0-9]+$/.test(key)) return key;
      return (...args) => {
        calls.push([key, ...args]);
        if (key.startsWith('create')) return { id: ++next };
      };
    },
  });
  for (const name of ['field', 'universe']) if (elements[name]) elements[name].getContext = () => noGL ? null : gl;
  const legend = { '.gold': { style: {} }, '.blue': { style: {} } };
  const document = {
    ...eventTarget(), hidden: false,
    getElementById(id) { assert(elements[id], `Missing HTML element #${id}`); return elements[id]; },
    querySelector(selector) { assert(legend[selector], `Unknown fixture selector ${selector}`); return legend[selector]; },
    body: { ...eventTarget(), dataset: {} }, documentElement: {},
  };
  const context = {
    ...eventTarget(), console, Float32Array, Math, Number, String, Error, document,
    matchMedia: () => ({ matches: reduced }), devicePixelRatio: 3,
    requestAnimationFrame(callback) { const id = ++next; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
  };
  context.window = context;
  vm.createContext(context);
  const scripts = ['modules/shared/visuals.js'];
  if (mod === 'galaxy-encounter') scripts.push('modules/galaxy-encounter/physics.js');
  scripts.push(`modules/${mod}/${expected[mod].script}`);
  for (const script of scripts) vm.runInContext(read(script), context, { filename: script });
  return {
    context, elements, gl, calls, frames, document, legend,
    diagnostics: () => context.fieldLabDiagnostics?.() || context.galaxyDiagnostics?.(),
    frame(time) { const pending = [...frames.values()]; frames.clear(); for (const callback of pending) callback(time); },
  };
}

for (const mod of Object.keys(expected)) {
  for (const reduced of [false, true]) {
    const h = setup(mod, { reduced }), { elements, diagnostics, frame, context } = h;
    assert.equal(diagnostics().paused, reduced);
    assert.equal(diagnostics().count, 65536, 'Visual upgrade must not increase default particle count');
    assert.equal(diagnostics().visuals.intensity, 2, 'Cinematic 2x must be the initial look');
    const time = () => diagnostics().simTime ?? diagnostics().time;
    const start = time();
    frame(1000); frame(1020);
    assert(reduced ? time() === start : time() > start);
    if (!reduced) elements.pause.click();
    const pausedTime = time();
    frame(1040); frame(1060);
    assert.equal(time(), pausedTime);
    for (const look of ['1', '2']) {
      elements.look.value = look; elements.look.fire('change');
      for (const palette of ['0', '1', '2']) {
        elements.palette.value = palette; elements.palette.fire('change'); frame(1080);
        assert.equal(time(), pausedTime, 'Presentation changes must not advance simulation');
      }
    }
    elements.ambience.checked = false; elements.ambience.fire('change'); frame(1100);
    assert.equal(time(), pausedTime);
    elements.focus.click(); assert(diagnostics().visuals.focus);
    assert.equal(elements.focus.attributes['aria-expanded'], 'false');
    h.document.fire('keydown', { key: 'Escape' }); assert(!diagnostics().visuals.focus);
    h.document.hidden = true; h.document.fire('visibilitychange'); assert.equal(h.frames.size, 0);
    h.document.hidden = false; h.document.fire('visibilitychange'); assert.equal(h.frames.size, 1);
    context.fire('pagehide', { persisted: true }); assert.equal(h.frames.size, 0);
    context.fire('pageshow', { persisted: true }); assert.equal(h.frames.size, 1);
    context.fire('pagehide', { persisted: false }); assert.equal(h.frames.size, 0);
    for (const type of ['Program', 'Shader', 'VertexArray', 'Buffer', 'TransformFeedback']) {
      const created = h.calls.filter(call => call[0] === `create${type}`).length;
      const deleted = h.calls.filter(call => call[0] === `delete${type}`).length;
      assert.equal(deleted, created, `${mod} must release all ${type} resources`);
    }
    console.log(`PASS mocked lifecycle ${mod}, reduced motion=${reduced}`);
  }
  const fallback = setup(mod, { noGL: true });
  assert.equal(fallback.elements.error.hidden, false);
  assert.equal(fallback.elements.pause.disabled, true);
  assert.equal(fallback.frames.size, 0);
  assert.match(fallback.elements.gpuNote.textContent, /No .* simulation is running/);
  console.log(`PASS no-WebGL fallback ${mod}`);
}

const { context } = setup('field-lab', { noGL: true });
const classify = (renderer, exposed) => context.ExploreVisuals.rendererInfo({
  RENDERER: 1,
  getExtension: () => exposed ? { UNMASKED_RENDERER_WEBGL: 2 } : null,
  getParameter: () => renderer,
});
for (const renderer of ['ANGLE (Google, Vulkan SwiftShader)', 'llvmpipe (LLVM)', 'softpipe', 'Software Rasterizer', 'lavapipe']) {
  assert.equal(classify(renderer, true).classification, 'software');
  assert.equal(classify(renderer, false).classification, 'software');
}
assert.equal(classify('ANGLE (NVIDIA GeForce RTX 3070 Ti)', true).classification, 'reported-device');
assert.equal(classify('WebKit WebGL', false).classification, 'unconfirmed');
assert.equal(context.ExploreVisuals.rendererInfo(null).classification, 'unavailable');
console.log('PASS renderer classifications; reported device is not hardware utilization proof');
console.log('NOTE: Mock WebGL does not validate GLSL compilation, rendered pixels, mobile layout or GPU performance.');
