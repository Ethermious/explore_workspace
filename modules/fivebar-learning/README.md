# Linkage Fieldnotes · 06

A mobile-first, eight-chapter interactive guide to the existing portable crossed inward five-bar. Open `index.html` directly or serve the repository using its existing instructions. No build, package installation, fonts, CDNs, telemetry or hardware connections are required.

## Learn by moving

1. Two distance constraints and generic mobility.
2. Board coordinates, absolute motor angles and dimensions.
3. Inverse kinematics derived from a triangle and the cosine rule.
4. Forward kinematics from two circles, including alternate assembly mode.
5. Ideal reach versus the whole-link padded envelope.
6. Differentiate rigid constraints to derive the Jacobian; explore motor-rate arrows.
7. Separate serial/parallel singularities and the supported flat carry pose.
8. Virtual work, point-force torque and optional distributed-mass gravity.

Each chapter unfolds through manually advanced ideas (36 total). Explicit Previous/Next idea actions align the paired workbench on narrow screens; slider changes never scroll. Each idea places a native MathML equation and short explanation directly beside its focused SVG diagram. On phone widths, a compact diagram/equation pair stays directly above the current explanation, while controls, detailed live values and context are expandable. Labelled pen-target inputs have matching xₜ/yₜ diagram projections and an INPUT → IK → motor-angle strip; motor-angle mode displays motor A/B angles and INPUT → FK → pen position. Each chapter ends with a revealable reasoning check. Sliders provide a keyboard/touch alternative to dragging. No autonomous motion runs. Reset restores the nominal pose. Hash links and browser Back/Forward select chapters. The page honors reduced-motion preferences for navigation.

## Model boundaries

The default geometry matches `docs/portable-fivebar-default.json`. This lesson's independent pure `math.js` allows mathematical branch comparisons that the drawing studio intentionally does not allow. It is not a planner or controller.

The chapter-5 teaching workspace samples ideal poses at 36 mm spacing. Green cells satisfy ideal-pose containment, negative closure determinant, minimum sine 0.08 and condition at most 20. Unlike the drawing studio, this teaching map does not quantize motor steps, filter connected components or validate paths. It is not a drawing-area or collision guarantee.

Exact flat rest is both serial and parallel singular. Only the actual centered flat pose is labelled supported rest. Real mechanical support, depth layers, stops, retention, drive adequacy and safety remain unvalidated. Geometry does not certify motor torque, loaded accuracy or docking.

The chapter-3 elbow comparison separately uses a mirror-symmetric 26 × 34 grid (884 half-board points). All four elbow choices share the same ideal reach mask (554 samples). Containment plus regularity differs: 546 inward, 150 outward, 311 both-positive, 311 both-negative. This comparison allows either FK closure determinant sign, unlike the canonical inward planner. Counts are pointwise samples, not exact areas, connected paths or safety approvals. Maps are cached and four same-scale small multiples support comparison.

## Files and deployment

- `index.html`, `style.css`, `lessons.js`, `guides.js`, `reach.js`, `app.js`, `math.js`: all seven runtime files. Copy these into the same directory to host the standalone lesson.
- `MODEL.md`: mathematical reference, worked example and sources.
- `test-math.cjs`: Node tests, including agreement with the existing canonical model.

No parent-relative runtime imports are used. Footer source links point to the public GitHub repository.

## Verification

Run from repository root:

```sh
node modules/fivebar-learning/test-math.cjs
node modules/fivebar-learning/test-reach.cjs
node modules/fivebar-learning/test-ui.cjs
```

Covers 2,272 reachable poses over all four elbow branches, arm length constraints, IK/FK agreement, analytic-versus-finite-difference Jacobians, virtual work, nominal signs, canonical-model agreement, invalid inputs, unreachable circles, singular rest and an out-of-envelope example. The existing repository numerical suites remain applicable and unchanged. Browser layout/interaction QA is separate from these numerical tests.

`test-reach.cjs` checks equal geometric masks, mirrored modes, both-sign comparison policy and cached map counts. `test-ui.cjs` is a dependency-free DOM contract smoke test of all 36 steps, chapter changes, reset/reveal, branch/layer controls, FK alternatives and invalid states. It is not a layout or actual-browser test.

Opening the geometry controls deliberately switches the narrow-screen workbench to diagram-plus-inputs. The current explanation is temporarily hidden and restored with “Return to the guided idea.” Inputs never scroll the page. Selected elbow signs, live solved angles, FK intersection signs and point-force torques stay synchronized with their displayed equations.
