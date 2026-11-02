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
