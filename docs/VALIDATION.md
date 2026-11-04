# Validation · v0.1

- PASS: 34,020 five-bar geometry cases across base/link lengths, all four assembly branches and a target grid. Reachability, link lengths, symmetry, finite-input guards and closure residuals checked independently in Node.
- PASS: JavaScript syntax checks for launcher, registry and kinematics.
- PASS: Actual cloud browser rendered homepage and linkage. Trace start/pause, unreachable numeric targets, Reset, branch crossing warning, slider control and Home/Back behavior were exercised. Screenshots inspected.
- PASS: WebGL 2 unavailable fallback rendered in the cloud browser.
- NOT VERIFIED: Actual GPU shader compilation/live visual output in this cloud environment, because WebGL 2 was unavailable. The GPU module remains experimental; CPU numerical reference tests are not shader execution tests.
- NOT VERIFIED: Narrow/mobile visual layout. Responsive CSS is implemented but no actual mobile viewport run completed.
- Local headless Chromium launch in the command sandbox was blocked by socket/process environment restrictions. No user-computer fallback or security-setting changes were attempted.
- NOT TESTED: Windows shell launcher, user browser/driver, RTX 3070 Ti performance, sustained GPU thermal behavior, instant-ngp native execution, real stepper hardware.

A smooth rendering is not evidence of physical accuracy. This release has no hardware connection or motor command path.

## v0.2 drawing increment

- PASS: existing 34,020 geometry cases; 12,088 quantized-pose drawing cases across three demos and four microstep settings. Forward geometry, integer step multiples, disconnected pen-up travel, compact-park transit, principal-angle unwrap, malformed transforms/path commands, unreachable and crossing rejection.
- PASS: 12 actual cloud-browser SVG importer regression tests (relative move/implicit line, transformed Bézier/arc and tiny circle sampling, basic shapes, invalid arc flags, negative radii, external use, script/style/odd points, excessive subpaths, cancellation, hidden groups).
- PASS: actual browser preflight, drawing playback, pause/resume, transformed multi-stroke SVG paste and motor-angle/step/error readouts. End-to-end robot drawing plus compact park completed (Y55 mm, virtual pen UP). Rewind clears ink/progress/readouts; changing artwork span invalidates the previous plan and disables playback.
- Still not physical hardware validation. Geometry checks are sampled at <=0.5 mm; finite-width swept collisions, dynamic torque/speed and joint limits are not simulated. SVG curve sampling is approximate. Quantized tip is computed from rounded ideal motor commands, not measured accuracy.
- No changes to GPU Field Lab, native instant-ngp workflow or hardware access in this increment.

## Galaxy Encounter launcher integration

- PASS: actual cloud browser renders four project cards, opens Galaxy Encounter in its dedicated iframe, and Back returns to the launcher and removes the iframe source.
- PASS: WebGL 2 unavailable message is explicit; no CPU substitute or falsely running gravity animation. Actual GPU shader/render execution and RTX performance remain UNVERIFIED here.
- Linkage import UI: pasted transformed C/Q paths with disconnected subpaths and a circle accepted three strokes; malformed arc flags rejected and corrected paste recovered. The operating-system file chooser itself was not exercised; local file contents use the same importer.

## 2026-11-02 · experiment05 horizontal five-bar correction

Replaced the serial2R side park with two fixed base motors, outward-branch five-bar and explicit supported singular horizontal tray rest. The original shared five-bar and SVG parser implementations are unchanged.

Passed local Node checks:47,076 new five-bar/drawing/docking poses;34,020 original geometry cases;12,088 original drawing quantized poses and continuous-angle regression; field formula720,000 steps; galaxy convergence/energy checks. New suite includes all six microstep settings, three demos, horizontal final links, replay closure, incompatible rest lengths, insufficient tray span/height and guarded drawing singularity rejection. These are numerical sampled tests, not physical collision/load or hardware tests.

Actual managed cloud-browser checks are recorded below after UI verification. Cloud GPU capability does not validate the user's GPU. No installs, hardware control or GitHub Actions were used.

Managed cloud-browser QA passed: launcher opens05; default robot preflight3106 samples and completion at horizontal180°/0°,3200/0 microsteps,penUP; replay/reverse unpark, pause, rewind and re-preparation;100mm tray rejection disables Draw; restoring tray plus pasted disconnected line/quadratic SVG passes2164-sample preflight; board W2000 preserves both link lengths, recenters supported rest, updates reach26.8%→25.4% and passes2244-sample robot plan. Back removes iframe src. Final rendered canvas visibly shows robot ink above four horizontal links along bottom tray band. File-chooser import was not exercised; pasted SVG was. No physical support, branch retention or motor operation tested.

## 2026-11-02 · portable half-board inward five-bar

This supersedes the experiment05 outward full-board geometry above. Selected exact lengths d839.3571428571429,p854.6785714285714,q435mm. Board1828.8×1219.2; robot half914.4mm. Inward IK[-1,+1], negative perpendicular FK, det<0, sine≥.08, condition≤20. Intentional projected crossings require unvalidated depth-separated links. All ideal/rounded pivots and therefore straight centerlines remain in the robot zone inset10mm. Exact supported singular carry pose has890mm padded span. Stage70mm gives more rounded-command conditioning margin than the research62.30112mm. No hardware execution or load validation.

Passed:86,694 ideal/rounded path poses plus midpoint checks across left/right, microsteps8/16/32 and robot/flower/wave; exports JSON roundtrip and non-executable flags; invalid tray, lengths, zone and support depth rejection; original34,020 geometry and12,088 drawing checks; galaxy convergence/energy; field720,000 formula steps. Default robot ingress633, drawing4072 and park857 samples. Coarse connected reach59.26%; fine ideal research result59.63% is not claimed as exact UI coverage. Coarse stepping can cause large ideal FK error (1× docking maximum≈11.49mm;16×≈0.712mm), not accuracy certification.

Browser QA is recorded separately after review. No installs, hardware, workflow runs or GitHub Actions.


## 2026-11-04 · Cinematic 2× presentation

Scope: GPU Field Lab and Galaxy Encounter presentation only. Their integration shader strings and `step()` functions are unchanged, as is `modules/galaxy-encounter/physics.js`. All linkage, drawing, whiteboard and learning module files remain untouched.

- PASS: original 34,020 geometry cases, 12,088 drawing poses, 86,694 portable five-bar poses, 720,000 field formula steps, galaxy center-energy/convergence checks, 2,272 lesson poses, reach-map checks and learning-control/DOM contract tests.
- PASS: JavaScript syntax and patch-whitespace checks.
- PASS: independent static review of render uniforms, resource cleanup and unchanged bounded particle/pixel budgets.
- PASS: deterministic mocked DOM/WebGL tests for renderer classification, reduced-motion initial pause, pause preserving simulation time, presentation changes preserving simulation time, focus/Escape, hidden-tab suspension, disposal and unavailable-WebGL fallback. These exercise application state without a real WebGL driver.
- NOT VERIFIED in this environment: real WebGL shader compilation/rendered output, desktop/mobile pixel layout, Windows GPU selection and RTX 3070 Ti performance. Local Chromium launch was blocked by socket restrictions, including the permitted escalation route. The managed browser could not reach the local server; its file URL protocol is disallowed. No security setting, device access or browser-policy bypass was attempted.
- Cinematic 2× is a presentation multiplier. It does not double simulation accuracy or prove a twofold GPU workload. The backdrop is static artistic shading; galaxy background stars are not physical tracers. The original simulation models and scientific limitations still apply.
- No GitHub Actions workflow was created or invoked. No hardware access, overclocking, system changes, external data transfer or new dependency was added.

## 2026-11-04 · Wave Loom phone-first experiment

Added a standalone Canvas 2D string experiment, launcher card 07, direct route and updated experiment count. Existing experiment files are byte-identical to the b4921c17 published baseline.

Passed Node checks: 86,400 new string stability/energy steps across three grid sizes, three speeds and both boundary types; reflected pulse signs; equal/opposite pulse cancellation with retained kinetic energy; linear superposition; damping; two held points/release; clear and input guards. Undamped smooth-mode relative energy error in the suite stays below 0.005%; reflection checks return approximately −0.49984 for pinned and +0.49989 for free endpoints from a 0.5 pulse.

Passed mocked DOM/Canvas control checks: initial and later reduced-motion preference; pause/resume; two-pointer limit and capture/cancel cleanup; keyboard; hidden/page lifecycle with no catch-up; fixed-step wall-time cap; quarter-speed; boundary restarts; bounded trails/pixels; clear/idle; no-Canvas fallback including resize; standalone launcher/home routes. These do not validate actual pixels or hardware touch.

Passed existing regressions: 34,020 linkage geometry cases; 12,088 drawing poses plus angle unwrap; 86,694 whiteboard poses plus midpoint/JSON export checks; Galaxy CPU convergence/energy tests; 2,272 Fieldnotes poses; 720,000 Field Lab formula steps; cinematic visual-control mocked lifecycle and unchanged integrator guards. No Actions, device access, native installs or hardware commands.

Local headless Chromium could not launch because the execution environment disallowed its process socket. Managed Sites cloud-browser QA rendered the actual Canvas 2D page at 320px and 390px widths with no horizontal overflow. Verified visible animation, mouse pull/release, ArrowUp/Space keyboard hold/release, pause/resume, clear to flat/zero energy, all three moments, quarter-speed and free-end switch. Primary controls measured 49px high and moment buttons 69px. Browser review found unsupported diagonal-arrow glyphs, replaced with inline SVG. Browser-console messages were extension metadata issues, not application exceptions. Physical iPhone/Android, multi-touch hardware and battery/performance testing have not been performed.


### Wave Loom terminology refinement · 2026-11-04

The playful moment names now introduce transverse displacement and propagation, boundary reflection and phase inversion, superposition/destructive interference, and normal modes with nodes/antinodes. Fixed/free boundary labels and kinetic/potential energy shares replace the looser pinned and motion/stretch terms. Plain explanations accompany the terms, including potential energy stored by deflection under tension. The numerical model and interaction behavior are unchanged.

Independent source/science review passed. Both Wave Loom suites pass with additional terminology and accessible-announcement assertions. All nine existing command-line regression suites pass, including Fieldnotes reach/UI navigation checks as well as the seven suites recorded above. Existing experiment internals remain byte-identical to main b4921c17. Main's complete recursive tree has no GitHub Actions workflow files.

## Mandelbrot Atlas — 2026-11-04

New standalone module `modules/mandelbrot/`; launcher adds card08 and its direct route. Existing Wave Loom terminology and other runtime modules remain unchanged.

- `test-math.cjs`: 3,578 assertions passed. Includes known orbit fixtures (especially strict radius2), Julia initial-seed escape and c=−6 fixed point, integer powers2–6, conjugation symmetry, budget monotonicity, orbit/index agreement, conservative analytic shortcut, coordinate inverses, cursor-centered zoom, guarded span and chunked rendering.
- `test-controls.cjs`: 61 mocked DOM/worker assertions passed. Covers modes, parameter/seed changes, budget/palette/detail, presets, pan/tap/pinch state transitions, cancellation, keyboard controls, all six learning experiments and quiz handlers, tab suspension and BFCache restoration. These are not real touch-device tests.
- Independent mathematical review: 6,124 assertions passed, plus a 75-digit reference comparison. One sensitive boundary orbit in657 samples differed by one escape iteration (binary64 3,086 versus high-precision 3,085). This is expected finite-precision sensitivity and is covered by the displayed precision limitations, not a claim of certified boundary accuracy.
- All JavaScript syntax checks passed. Static checks found60 unique module IDs, all53 literal UI references resolved, local asset paths present and8 launcher cards.
- Existing regression checks passed: Wave Loom model/controls, linkage, drawing, portable whiteboard, shared visual controls, five-bar mathematics/reach/UI, Galaxy CPU physics and Field Lab CPU mathematics.

Real cloud-browser QA passed on desktop and in320px/390px phone-width frames. No horizontal overflow at320px (client/scroll widths305/305 after browser scrollbar). Checked whole-view rendering; zoom, Undo and Seahorse preset; mouse drag and keyboard pan; numeric span10⁻⁹ guard disabling zoom-in; Julia c=0 unit disk; typed Julia parameters; c=−2 remaining bounded at modulus2; c=1 escape at n3 with value5; palette and iteration changes; cubic family labelling; lesson navigation and quiz response; and PNG download. Latest small-phone header and inline SVG icon were visually checked.

The desktop CPU Canvas render buffer was722×494 during one observed check. Render times are observations on the cloud browser, not Android or user-device performance promises. Actual Android hardware, multi-touch pinch, browser download destinations and long-duration deep-zoom behavior were not independently tested. The pure/mocked tests cover pointer-state logic; real-device gesture validation remains a limitation.
