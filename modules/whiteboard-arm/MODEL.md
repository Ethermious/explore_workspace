# Five-bar horizontal tray-rest study

Experiment 05 replaces the earlier serial shoulder/elbow arm. It is now a closed five-bar: two **fixed** base motors, two passive elbows and one shared passive pen pivot. Experiment 01 is unchanged.

## Coordinates and geometry

Millimetres; board is x=0..W, y=0..H, with bottom at y=0. Bases are ((W−d)/2,b) and ((W+d)/2,b). Each proximal link is p; each distal is q. The outward elbow branch is fixed. IK is the circle-intersection construction used in the original pure five-bar module. FK uses the upper intersection of equal-radius distal circles and checks the outward assembly branch. No unreachable coordinates are clamped into reach.

Defaults: W=1828.8,H=914.4,d=292.608,p=694.944,q=841.248,b=10. Board edits do not resize links, motor spacing or tray. The tray is centered with illustrative span1828.8 and docking band y=0..100. Illustrative in-plane link width10 adds5mm to each side of centerline bounds. This does **not** model joint housings, bearing stacks, 3D tray depth or board offset.

## Two different motion regimes

1. **Guarded drawing and travel:** minimum absolute sine of both serial elbow angles and the distal closure angle ≥0.08; ideal and rounded FK closure, fixed outward assembly, strict nonadjacent centerline crossings and board-width motion envelope checked. Dense Cartesian samples ≤1mm include pen-up connectors. Largest usable rectangle is estimated on40×24 cells, then the actual fitted path is checked. Reach shading is approximate, not a guarantee of a connected or collision-free workspace.
2. **Supported docking / reverse unpark:** a deliberately separate conceptual regime. Drawing ends, virtual pen lifts, guarded travel visits centered ingress then staging tip (W/2,90). Symmetric motor angles θL=π−ε, θR=ε ease to [π,0]. For exact horizontal rest, **q=p+d/2** is required; incompatible edits are rejected. An explicit button can update distal length, never silently. The upper FK tip follows
   `y=b+p sin ε+sqrt(q²−(d/2+p cos ε)²)`.
   At ε=0 all four links are horizontal, tip=(W/2,b). This terminal rest is **singular**. Its Jacobian is not invertible; it is not a valid drawing pose. The drawing margin guard is deliberately waived only in the supported, pen-up docking/unparking regime. Closure, centerline crossing and padded tray-band checks remain. A smoothstep parameter gives zero ideal terminal motor velocity. Playback rate is drawing mm/s but normalized phase units/s during docking, not certified motor timing.

The default exact-rest centerline span is1682.496mm; the assumed10mm link width gives a1692.496×10mm rest envelope (x68.152..1760.648,y5..15). The approach needs the larger100mm docking band, not just the10mm resting band. Exact rest is possible mathematically, not certified mechanically. The overlapping projected folded links require depth-stacked links/joints; tray support and a mechanism retaining/reselecting the upper passive assembly branch on unpark are required and unvalidated. Do not infer that a real robot can leave singular rest under two motor commands alone.

## Playback and accuracy

SVG import reuses the bounded, local-only drawing parser. Outlines only, not arbitrary raster art. Entire draw+park must pass before Draw enables. Pause, rewind and replay retain the sampled conceptual branch; editing geometry invalidates the plan. Dragging a singular rest is blocked. Drawing from rest first reverses the stored docking path. Pen UP/DOWN is a virtual separate actuator, not a supplied mechanism.

400 full steps/rev corresponds to the0.9° motor. Ideal angle rounding is checked with FK; microsteps are resolution, not accuracy. Quantized steps at rest are exactly[200×microsteps,0]. Near singular docking can amplify rounding error; the maximum is reported. No motor connection, step generator, G-code, homing, torque sizing, collision certification or firmware exists. No gravity torque readout is presented: a serial2R load formula would be wrong for this closed chain. Motor holding torque is not available moving torque.

## Checks

`node tests/whiteboard-arm.test.js`: 47,076 poses across all six microstep settings, three drawings, mandatory exact horizontal rest, reverse/replay closure, independent dimension edits, incompatible geometry/insufficient tray rejection and drawing-singularity rejection. Sampled checks are not continuous swept-volume proof. Original five-bar, drawing, field and galaxy tests remain separate.
