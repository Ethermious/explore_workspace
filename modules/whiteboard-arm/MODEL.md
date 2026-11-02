# Portable half-board crossed five-bar · version 1 geometry contract

Experiment 05 is a conceptual closed-chain preview, not a hardware controller. Two fixed STEPPERONLINE 17ME15-1504S motors drive proximal arms; elbows and shared tool joint are passive. No permanent side rails or CoreXY frame. Other experiments are unchanged.

## Exact selected geometry / SolidWorks

All lengths are pivot **center-to-center**, in millimetres:

| Quantity | Value |
|---|---:|
| Whole board W × H | 1828.8 × 1219.2 |
| Robot zone width | 914.4 |
| Fixed base spacing d | 839.3571428571429 |
| Both proximal links p | 854.6785714285714 |
| Both distal links q | 435 |
| Motor pivot height | 10 |
| Assumed centerline padding | 10 |
| Padded carry-bar span | 890 |
| Maximum ledge support footprint depth | 45.72 (1.8 in) |

Coordinates use the whole board bottom-left as origin, +X right, +Y up; +Z out from board is not modeled. The left robot zone is x0..914.4, or the right zone is x914.4..1828.8. Changing side translates the mechanism, not its motor sign convention. Both motor angle zeros point along board +X; positive angles are counterclockwise. These are mathematical angles, not physical homing offsets or wiring directions.

Left-zone fixed A=(37.5214285714,10), B=(876.8785714286,10). Exact supported REST: left elbow L=(892.2,10), right elbow R=(22.2,10), tip T=(457.2,10), motors [0,π]. The crossed proximal arms and returned distal links overlap in projection; **separate depth layers, joint spacers and carry retention are not designed**. The copy panel and downloadable JSON supply full precision, nominal drawing pose and rest pivot coordinates. A SolidWorks sketch can use AL=BR=p, LT=RT=q and AB=d. Do not fabricate from a centerline preview alone.

## Kinematics and guards

Analytic IK per arm: θ=atan2(dy,dx)+s·acos((p²+r²−q²)/(2pr)), signs [-1,+1]. FK chooses the **negative perpendicular** intersection from left elbow L to right elbow R; it checks that IK returns the same branch. The permitted closure determinant is negative. Crossings are expected and are not treated as a planar collision pass: depth-layer clearance remains unvalidated.

For each distal unit vector u, A has rows u, B is diagonal with p(−uₓsinθ+uᵧcosθ), and J=A⁻¹B. Guarded drawing/travel requires minimum serial/parallel sine≥0.08, 2-norm condition κ(J)≤20, the fixed closure branch, and all five pivots inside the robot-zone rectangle inset by10mm. Straight centerlines then lie in that convex inset. This does not prove bearing housing, motor, cable, swept-volume or 3D collision clearance. All actual drawing and pen-up routes are sampled≤1mm and checked both ideally and after step rounding; playback interpolation is also regression sampled.

Research selected an approximately894.14×514.55mm ideal window, x10.13..904.27,y446.11..960.66 in the robot zone, with about59.63% connected ideal reach at a fine grid. The interactive preview estimates connected reach on61×81 cells (default about59.26%); its conservative corner-tested fit rectangle uses60×72 cells plus rounded-step guards, so it differs from the research window. This is not global optimization or full3×4ft coverage. Real artwork routes must pass preflight separately. Board and zone edits never resize real links.

## Supported fold / carry pose

Exact inward horizontal rest requires **p=q+d/2**. The explicit compatibility button changes proximal length; incompatible geometries cannot export or draw. Supported docking uses θL=ε, θR=π−ε and

`y_tip=b+p sinε+sqrt(q²−(p cosε−d/2)²)`.

As ε→0 all four links become horizontal. REST is singular, not a guarded drawing point. A separately labeled pen-up supported docking regime intentionally bypasses drawing sine/conditioning guards, while checking closure and the entire padded tray band. Staging tip defaults70mm above board bottom (research's ideal62.30112mm is close to the condition cutoff;70 gives step-rounding headroom). The padded carry span is hard-limited to914.4mm (3ft), even if the robot zone is enlarged. The assumed docking band is100mm high; this is **vertical** motion room, not ledge depth. A centered ingress is used before artwork and return because direct low diagonal routes can enter excluded regions. Reverse unpark follows the stored conceptual branch. Mechanical support, passive branch selection, preload and carrying lock remain unvalidated. Reset teleports the simulation to rest; it does not command motion.

## Ledge support is not a hard thickness limit

The maximum ledge footprint is45.72mm. Components may overhang; the assembled mass/center of gravity must be supported on the ledge. No masses or support reaction solver are supplied, so there is no stability badge or claim. Normal pen force, tipping, mount forces, dynamic loads, contact friction and carry locks need physical design. A38mm motor body plus23.5mm shaft may extend beyond the ledge: that is not automatically disqualifying and no right-angle gearing is assumed. Actual layout and depth-layer packaging are unresolved.

## Export and future Hardware Agent

`TrayFiveBar` is a pure module (CommonJS in Node; browser global) exposing validate, ik, fk, checked, quantize, plan, dock, park, reachMap and geometry. It does not access devices or network. Drawing helper dependency is used only for SVG bounds/fit.

Geometry JSON has schema `explore-workspace.fivebar-geometry`, version1, units `mm`, executable:false, hardware_validated:false, adapter_required:true. It includes dimensions, coordinate frame, center distances, robot zone, branch and numerical guard constants, motor-angle convention, nominal/rest pivots and explicit support uncertainties. JSON represents an infinite singular condition as null with singular:true. Invalid geometry, failed docking or unguarded nominal pose blocks export.

This is a **distinct future integration contract**, not the existing Hardware Agent linear-XY artwork importer. No compatible five-bar execution adapter is claimed. Planning records are internal conceptual samples `{t,q,steps,down,s,phase}`; `steps` are ideal absolute simulated indices, not calibrated commands. Physical homing, motor direction, gearing, acceleration, step timing, limits, feedback, pen lift and hardware safety must be implemented and validated separately before execution. No G-code, firmware or motor commands are exported.

400 full steps/revolution derives from0.9° motors; microstepping indicates resolution, not accuracy. Near-singular docking amplifies quantization, especially at coarse steps; maximum ideal FK rounding error is reported. Holding torque0.30N·m is not moving torque. No actuator adequacy, human safety or collaborative-robot claim. Keep hands clear while links move; a separate human drawing region is not collision sensing.

## Checks

Run `node tests/whiteboard-arm.test.js`, plus existing original geometry, drawing, field and galaxy suites. Browser QA separately exercises user controls, SVG, reset/replay and export. All are simulation checks, not hardware validation.
