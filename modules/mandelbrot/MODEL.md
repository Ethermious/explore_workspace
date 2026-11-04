# Mandelbrot Atlas: model and limits

## Mathematical definitions

For integer p ≥ 2, the map is f_c(z) = z^p + c. The critical orbit starts at z₀ = 0. The classical Mandelbrot set is the set of c for which this orbit remains bounded when p = 2. Integer powers 3–6 are labelled Multibrot in this module. The family selector changes the actual map; the color palette, pixel resolution and iteration budget do not change the exact mathematical set.

In the filled Julia mode, c is fixed across the image and each pixel supplies a different z₀. K_c consists of starting points with bounded orbits; the Julia set J_c is its boundary ∂K_c. The dark finite-render region approximates K_c, not just J_c.

For p = 2 and z = x + iy, c = a + ib:

- x_next = x² − y² + a
- y_next = 2xy + b

Both new values use the old x and y. Integer powers use repeated complex multiplication, avoiding polar-angle branch choices.

## Escape conditions

The critical-orbit parameter view uses strict |z_n|² > 4 for all supported p. Equality is not escape. In particular, c = −2 for p = 2 gives 0, −2, 2, 2, …, while c = 1 gives 0, 1, 2, 5 and escapes at n = 3.

The filled Julia renderer uses R = max(2, |c|). For any integer p ≥ 2, |z| > R ensures |z^p + c| ≥ |z|^p − |c| > |z|, with continued growth to infinity. The initial seed is tested too: a seed already outside R escapes at n = 0. A universal Julia radius of 2 would be incorrect: for c = −6, z₀ = 3 is a bounded fixed point outside radius 2.

The result stores the first escaped index n. Trace points include z₀ and stop at the first escape or the trace budget. The orbit diagram stores at most 512 iterations and discloses that limit; the point verdict still runs the full chosen budget, up to 3,000.

## Rendering

- Pixel centers are mapped to the complex plane with a single equal scale on both axes. Positive imaginary values go upward.
- Each worker chunk renders six complete rows. Messages carry render IDs; stale jobs are ignored. A cancellation token stops old work at chunk boundaries.
- The cooperative main-thread fallback uses two-row chunks. No GPU or binary32 arithmetic is used.
- Light, Balanced and Fine cap image samples at approximately 150,000, 420,000 and 900,000 respectively. Device pixel ratio is additionally capped.
- The image is transformed coherently while panning/zooming, then rerendered at the new coordinates. Background tabs cancel active work; back-forward cache restoration creates a fresh worker.
- Dark RGB(7,12,22) denotes no detected escape by N, including points recognized by the analytic shortcut. It never certifies the entire dark pixel as part of the exact set.

Smooth escape coloring uses ν = n + 1 − log(log|z_n|)/log(p), including n = 0 initial-seed escape. It is a conventional asymptotic escape-time estimate, not an exact distance to the set or a physical quantity. At finite bailout, residual color artifacts are possible. Integer coloring uses the actual escaped n. Palettes affect only colors.

## Analytic optimization

Only the p = 2, z₀ = 0 parameter renderer uses the known main-cardioid and period-2-bulb tests. For c = x + iy, q = (x − 1/4)² + y²:

- Main cardioid: q(q + x − 1/4) < y²/4.
- Period-2 bulb: (x + 1)² + y² < 1/16.

The code subtracts a conservative 64·Number.EPSILON-scaled margin from the right side. This excludes boundary-adjacent cases from the shortcut rather than enlarging inclusion. It is still evaluated in floating point, not a formal interval-arithmetic certificate. The inspector explicitly iterates its selected point and separately identifies a passed analytic test.

## Finite precision and supported range

JavaScript Number uses IEEE 754 binary64: approximately 15–17 significant decimal digits. The renderer does not use arbitrary precision, interval certification, or perturbation deep-zoom methods. Near the boundary, rounded orbits can diverge from higher-precision reference orbits before coordinates run out of representable spacing.

The view guard is:

minSpan = max(10⁻⁹, width × 32 × Number.EPSILON × max(1, |centerReal|, |centerImag|)).

View centers are constrained to ±8 and horizontal span to [minSpan, 12]. Numeric c and z₀ inputs are constrained to ±32 per coordinate; the coarse Julia sliders cover ±2. The supported viewport lies within these probe ranges for the responsive layout. These are interface bounds, not mathematical bounds on the full complex plane. Deep-zoom warnings begin below a 10⁻⁵ horizontal span. The floor is conservative and does not guarantee correct classification up to that depth. More iterations cannot recover lost coordinate precision.

Finite-budget sets form nested outer approximations only in exact arithmetic. A rendered pixel samples a single center, not every point in its square. A non-escaped sample does not prove membership; a color does not prove a distance or topology. Finite precision can also perturb escape classification.

## Learning design

Six chapters proceed from generic equations to meanings and then worked experiments. Adjacent diagrams are schematic educational visuals. They are not additional numerical set renderings. Each lesson experiment resets the mathematical family explicitly: the first five use p = 2, and the last chooses p = 3. The c = −0.75 + 0.1i example escapes at n = 33 in the tested binary64 implementation, illustrating a false survivor at budget 32.

## Tests and sources

Run `node modules/mandelbrot/test-math.cjs` and `node modules/mandelbrot/test-controls.cjs` from the repository root. Mathematical tests cover strict bailout, known bounded/escaped points, conjugation symmetry, iteration monotonicity, p = 2–6, Julia initial seeds, trace indexing, shortcut exclusions, coordinate transforms, zoom anchors, and chunked-render equivalence. Mocked controls cover modes, inputs, budgets, palette/detail settings, presets, tap/pan/pinch state, keyboard controls, cancellation, all learning experiments and visibility/BFCache lifecycle. Mocked pointer events are not real Android multitouch validation.

Primary educational/reference sources:

- Curtis McMullen, Harvard complex dynamics course notes: https://people.math.harvard.edu/~ctm/sem/home/notes/99/course.pdf
- Jim Belk, Julia and Mandelbrot sets: https://e.math.cornell.edu/people/belk/dynamicalsystems/NotesJuliaMandelbrot.pdf
- ECMAScript Number specification: https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type
- Claude Heiland-Allen, analytic cardioid/bulb derivation: https://www.mathr.co.uk/blog/2022-11-19_cardioid_and_bulb_checking.html
- Claude Heiland-Allen, deep-zoom methods: https://mathr.co.uk/web/deep-zoom.html

No new dependencies, external assets, network requests, storage, authentication, telemetry or hardware commands are required. Sources open only if selected by the user. Image saving creates a local PNG download, with no upload.
