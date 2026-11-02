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
