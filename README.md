# Explore Workspace · v0.1

A local-first home for hands-on robotics, GPU experiments and neural photography.

## Run today on Windows

1. **Extract All** from the ZIP. Do not run the files inside the compressed-folder view.
2. Double-click **index.html**. Open it in current Chrome or Edge.
3. Pick an experiment. **Linkage playground** runs immediately; **GPU Field Lab** requires WebGL 2 and hardware acceleration; **Walk inside photographs** is a guide to a separate native application.

No package manager, account, subscription or installation is required for the browser experiments. No app code or fonts are fetched from CDNs. The application has no upload, telemetry, native-execution or motor-control endpoint.

If your browser requires HTTP, run **START.cmd** with Python 3 already installed, then open http://127.0.0.1:8765. The optional server binds only to loopback. Close its terminal or press Ctrl+C to stop it. The script installs nothing and does not alter firewall settings. If port 8765 is in use, stop the other server or use `python -m http.server 8766 --bind 127.0.0.1` from this folder.

## Run from a clone or WSL2

If you already cloned the empty repository, run `git pull origin main` inside that folder to download the published files.

From the repository folder in WSL2 (with Python 3 already installed):

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open **http://localhost:8765** in your Windows browser. Keep the WSL terminal open while using the app; press Ctrl+C to stop the server. This installs nothing and binds only to loopback. Alternatively, open `index.html` directly in a Windows browser as described above.

## Experiments

### 01 — Linkage playground

An ideal planar five-bar mechanism with two fixed base motors and explicit inverse kinematics. Drag the tool, use arrow keys with the canvas focused, or enter X/Y coordinates. Adjust base spacing, motor-link length, tool-link length and assembly branch. Trace draws a bounded figure-eight at the default geometry; other dimensions can make parts of that path unreachable, which is reported rather than silently clamped.

- Units are millimetres; motor angles are measured counterclockwise from +X in the global plane, not calibrated controller coordinates.
- Reachability is the intersection of two annuli. Shading does **not** certify collision-free motion.
- Branch selection is mathematical; changing it is not a physically continuous hardware command.
- Geometry margin is the minimum absolute sine of the serial and distal-link closure angles. It approaches zero near a singularity; it is not a force or safety rating.
- Crossing detection covers strict centerline intersections, not touching segments, finite-width links, hardware interference or self-collision clearance.
- This is **kinematics**, not motor dynamics. No mass, drag, torque-speed curve, backlash, joint clearance or stiffness is modeled. No motion commands are generated.

Reference motor: [STEPPERONLINE 17ME15-1504S](https://www.omc-stepperonline.com/e-series-nema-17-bipolar-0-9deg-30ncm-42-48oz-in-1-5a-42x42x38mm-4-wires-17me15-1504s), 0.9° full steps, 1.5 A/phase, 0.30 N·m holding torque. Holding torque is not moving torque. See [TMC2209 datasheet](https://www.analog.com/media/en/technical-documentation/data-sheets/tmc2209_datasheet_rev1.09.pdf) before a later hardware design; carrier cooling, power supply and current-setting conventions remain separate engineering tasks.

### 02 — GPU Field Lab

See the module's controls and explanation. Start conservatively and increase one dimension at a time. Real GPU compute and browser drawing are distinct from validated engineering physics or a hardware benchmark. Browser frame timing does not reveal GPU utilization or guarantee your PC's stability. Return Home to unload the module and release its browser resources. Close the page if performance becomes poor. No overclocking or system changes are required.

### 03 — Walk inside photographs

The guide links NVIDIA's official Windows RTX 3000/4000 instant-ngp ZIP and the included fox dataset. This is a separate app with a **noncommercial research/evaluation license**. Review it before use. The workspace does not download or launch executables. See [docs/instant-ngp-run-today.md](docs/instant-ngp-run-today.md).

Neural rendering is not a metric CAD scan. Your own photos need overlapping viewpoints and camera-pose preparation. No user photographs are included or uploaded.

## Project organization

- `index.html`, `style.css`: visual launcher and experiment views.
- `js/projects.js`: project card registry.
- `js/kinematics.js`: independently testable five-bar geometry.
- `js/app.js`: navigation, interaction and Canvas 2D visualization.
- `modules/field-lab/`: isolated GPU experiment.
- `docs/`: practical guides and evidence.
- `tests/kinematics.test.js`: 34,020 geometry cases.

Future experiments should get a clear card, an honest status, an entry point and a short run guide. A setup link must not be labeled as an already installed app's Run button.

## Checks and limits

Run `node tests/kinematics.test.js` if Node.js is already installed; Node is not required to use the app. Geometry checks cover reachability, both arm lengths, all four branch choices, symmetry, finite-input guards and closure residuals over 34,020 cases.

Cloud browser checks and limitations are recorded in `docs/VALIDATION.md`. Windows execution, RTX 3070 Ti performance and physical hardware have not been tested here. There is no promise of zero crashes, no supplied safe motor operating envelope and no hardware access.

## License

Original workspace code is provided under the MIT license in `LICENSE`. The NVIDIA app is not bundled and has its own separate license. External guide links remain the property and responsibility of their respective projects.

## Linkage drawing studio · v0.2

1. Open Linkage playground. Load a built-in drawing or import/paste a **plain SVG**.
2. Set artwork span and center, choose illustrative microstepping, then **Fit & check whole path**.
3. **Draw artwork** plays ideal motor commands. The lavender ink follows the forward-kinematic tip of rounded motor step targets; the small amber cross is the unrounded requested tip. Dashed travel is virtual pen-up, never ink.
4. Pause/resume or Rewind. Editing geometry, artwork fit, assembly branch or step setting invalidates the prepared path.
5. Optionally enable **compact park after drawing** or preview park alone. This is a low-profile plan-view pose with sampled transit checks, not a guaranteed physical fold.

The standard five-bar has **two driven base joints** and three passive moving pivots. M1/M2 command angles and continuous simulated microstep indices use +X as mathematical zero (400 full steps/revolution for a 0.9° motor). They are not homed motor positions, measured feedback, G-code, or a TMC2209 connection. No hardware command interface exists.

### Artwork limits and privacy

- Local SVG only: path M/L/H/V/C/S/Q/T/A/Z (absolute or relative), line, polyline, polygon, rect, circle, ellipse; group translate/scale/rotate/skew/matrix transforms.
- Vector geometry is approximated by bounded samples. Filled shapes are traced along their outlines, not filled or hatched. Source stroke order can be retained, or nearest-endpoint ordering may reverse strokes to reduce pen-up travel.
- Text, raster images/photos, `<use>`, embedded CSS/styles/classes, effects, external references, nested SVG viewports, entity declarations and scripts are rejected. Export simple numeric paths/shapes first. Root viewBox coordinates are retained geometrically; viewport clipping is not applied.
- Limits: 1 MiB SVG, 2,000 XML elements, 400 shapes, 400 subpaths per path, 50,000 path tokens, 24,000 sampled points. Oversized or malformed inputs fail explicitly. Nothing uploads or fetches external SVG resources.
- Paths must fit the selected linkage workspace. Preflight includes pen-up connectors and optional park, with ≤0.5 mm point spacing, fixed assembly branch, ideal/quantized closure, strict centerline crossings, geometric margin, and continuous angle counts. These sampled centerline tests do **not** prove swept-volume collision clearance, bearing limits or physical safety.

### Physical limitations

A pen lift is a separate actuator: the preview's UP/DOWN state is conceptual, not supplied by the two planar motors. A practical build must provide a lift or deliberately accept connecting marks. Holding torque is not moving torque; playback feed is not a certified motor speed. Gravity, inertial torque, acceleration profiles, backlash, elasticity, motor heating and joint stops are not modeled. Full-step/microstep rounding shows ideal geometric quantization only, not positioning accuracy.

The planar linkage already lies in one plane. Exact collinearity may be geometrically impossible for a given set of lengths and is singular when possible. The optional compact park searches a lower-height reachable pose and validates its sampled approach; no automatic hardware folding is promised.

### Drawing tests

```sh
node tests/kinematics.test.js
node tests/drawing.test.js
```

Serve the project and open `tests/svg-browser.html` to run browser-native SVG geometry tests. The browser test has no network dependencies and exercises sanitization, relative subpaths, transformed curves, small-unit shapes and cancellation.

### Galaxy Encounter

Open **Run Galaxy Encounter** for two moving softened gravitational fields with massless stellar tracers. WebGL 2 is required; start at the balanced 65,536-tracer preset. This is restricted gravitational dynamics, not a self-gravitating merger or prediction of real galaxies. Read `modules/galaxy-encounter/MODEL.md` for equations, numerical checks and limitations. Returning to the launcher unloads the module. CPU physics tests: `node modules/galaxy-encounter/physics.test.js`.

## Fold-away Whiteboard Studio · portable half-board preview

Open **Fold-away Whiteboard → Fit to reach & check path → Draw**. The6×4ft board reserves one3ft-wide half for a **crossed inward five-bar with two fixed motors**, leaving the other half for human annotations when motion is stopped. Switch left/right. Every link centerline plus its illustrative10mm padding—not only the pen—must stay in the robot zone. Shaded reach is approximate; all actual artwork/travel routes are checked.

Selected center-to-center dimensions: **proximal854.6785714286mm each; distal435mm each; base spacing839.3571428571mm**. Default supported horizontal carry span is890mm including an assumed10mm allowance per end. No permanent side rails. Board/robot-zone edits do not resize these links. Exact horizontal rest requires proximal = distal + half base spacing; incompatible geometry blocks drawing and export. Drawing ends with penUP and an explicit supported singular docking phase; replay reverses that conceptual unpark path.

**Copy to SolidWorks** shows lengths and pivot coordinates continuously. Copy/download versioned geometry JSON for CAD and a future Hardware Agent adapter. This distinct schema is non-executable, not an existing linear-XY importer or hardware-ready motion format. The pure kinematic module is separated from UI; no printer/controller connection is added.

**Ledge support depth is at most45.72mm (1.8in), not a no-overhang thickness box.** Overhang is allowed, but mass/CG must remain supported on the ledge. No masses, balance calculation, layer packing, pen pressure or motor adequacy are validated. Crossed links need separate depth layers; singular rest needs mechanical support, passive branch retention and a carry lock. Keep hands clear during motion. See [model, CAD conventions and export contract](modules/whiteboard-arm/MODEL.md). Run `node tests/whiteboard-arm.test.js` for numerical checks. Other experiments are unchanged.

Browser-independent CAD reference: [default portable five-bar geometry JSON](docs/portable-fivebar-default.json), generated from the pure exporter and checked by the numerical suite. It uses the default left robot half and16× nominal microstepping; it is not executable hardware data.

Research checkpoint: [2026-11-02 drive feasibility — acrylic, aluminum and timing-belt reduction](docs/research/whiteboard-drive-feasibility/2026-11-02.md). Preserves assumptions, static torque comparisons and a resume checklist; it does not change the kinematic preview or validate hardware.


## 06 — Linkage Fieldnotes · learn by moving

Open **Learn the five-bar** for a standalone, phone-friendly eight-chapter learning module. Build intuition with live SVG diagrams and sliders, then derive inverse/forward kinematics, workspace constraints, Jacobians, singularities and virtual work. Each chapter includes a revealable reasoning check. No CDN, build step or hardware connection is required.

Direct entry: [modules/fivebar-learning/index.html](modules/fivebar-learning/index.html). See its [run guide](modules/fivebar-learning/README.md) and [mathematical derivations with a worked example](modules/fivebar-learning/MODEL.md). Tests: `node modules/fivebar-learning/test-math.cjs`. The independent educational model permits explicitly labelled mathematical branch exploration; it does not change the Fold-away Whiteboard Studio's geometry, planner or guards.
