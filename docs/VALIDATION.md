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
