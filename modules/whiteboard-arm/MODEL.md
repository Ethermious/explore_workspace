# Fold-away Whiteboard Studio

A local 2D geometric design sandbox, not hardware control or build approval. The existing two-fixed-motor five-bar playground is unchanged. This design has one fixed shoulder motor and one motor carried at the elbow. A vertical board is an explicit assumption.

## Try it

Open the new Workspace card, choose **Fit to reach & check path**, then **Draw**. Robot, flower and figure-eight demos or plain SVG use the shared sanitized SVG importer. Fit selects a large sampled usable rectangle, preserves aspect ratio, then checks the entire drawing, pen-up connectors and a mandatory near-fold park. A rejected path cannot play. Drag the pen or use target X/Y. Changing geometry invalidates the path; changing board size never changes physical link lengths. The explicit reach-length suggestion can reduce parking feasibility; it is not a construction recommendation.

The starting board is 1828.8 × 914.4 mm (6 × 3 ft). Shorter illustrative 650 mm links, shoulder 200 mm left and 100 mm above the bottom, accept partial coverage. The declared available envelope is the board plus 450 mm to its left, with no extra height. Measure your real clearance. Both ideal and rounded configurations must stay within it. The default robot finishes parked approximately x −200…−21 mm, y 76…725 mm. The final elbow is approximately 167.4° folded: fully folded 180° is singular and deliberately not commanded. A side margin of at least 10 mm applies to both ideal and rounded parked centerlines.

## Mathematics

Coordinates: board x=0…W, y=0…H; base b=(−offset,mount). Shoulder angle q1 is measured from +x; q2 is elbow-relative.

- elbow = b + L1 (cos q1, sin q1)
- tip = elbow + L2 (cos(q1+q2), sin(q1+q2))
- cos q2 = (|tip−b|²−L1²−L2²)/(2 L1 L2)
- q1 = atan2(y−by,x−bx) − atan2(L2 sin q2,L1+L2 cos q2)

The selected elbow branch is retained. The singularity guard is |sin q2|≥0.08. Exact radial reach is the annulus |L1−L2|…L1+L2. The displayed 861-point percentage additionally uses the selected branch, ideal singularity guard and declared wall envelope; it is approximate, not a maximum achievable area or physical-clearance proof. Fitting uses a separate 40×24 cell grid with ideal and rounded corner checks. Artwork is subsequently preflighted at ≤2 mm Cartesian spacing, maximum 50,000 samples. Park candidates use a 2° shoulder grid and 301 joint-space trajectory samples. These are finite numerical tests, not continuous swept-volume guarantees; unsuccessful search is not proof that no other motion exists.

Absolute step counts assume 400 full steps/revolution, ideal independent joints and selectable microstepping. No homing, feedback, backlash or real driver commands. Quantization reports ideal rounded-target displacement, not practical accuracy. Playback interpolates ideal joint samples, not a controller simulation. Park playback timing uses a nominal visual duration, not a calibrated motor speed.

For uniform links and concentrated elbow motor/tip payload, lengths in metres:

τ1 = g[(m1 L1/2 + (m2+me+mp)L1) cos q1 + (m2 L2/2+mp L2) cos(q1+q2)]

τ2 = g(m2 L2/2+mp L2) cos(q1+q2)

Displayed absolute values are instantaneous unbalanced static gravity loads. All masses are editable illustrative assumptions, not manufacturer data. Holding torque of 0.30 N·m is not running torque. Long arms with these assumptions substantially exceed that rating. Reduction, counterbalance, stiffness, joint bearings, acceleration and measured torque-speed performance need separate engineering.

## Hard limitations

Park is required before drawing is enabled, but numerical centerline success does not certify physical tuck-away. No link thickness, depth layering, collision mesh, wall fixtures, cables, joint travel limits, motor body clearance, pen lift mechanism or structural deflection is modeled. The full transit can occupy the board area even though final park is entirely left of it. The highlighted small box is the final parked extent, not its swept-motion box. No hardware access, downloads, uploads or motor outputs occur.

## Regression checks

Run `node tests/whiteboard-arm.test.js` from repository root. It checks FK/IK reach, both branches, three drawings at 1/16/32 microsteps, complete drawing/park samples, rounded envelope/branch checks, unsuitable parking and singularity rejection, and gravity torque. Existing `tests/kinematics.test.js`, `tests/drawing.test.js` and browser SVG tests remain applicable to their existing modules/shared importer.
