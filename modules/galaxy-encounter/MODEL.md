# Galactic Dance: restricted gravitational encounter

## What this model is

This experiment evolves massless stellar tracers in two moving, spherical Plummer potentials. It is an educational restricted collisionless model. Each luminous point samples a stellar population. Increasing the point count samples the same field more densely; it does **not** add gravitational mass or improve the halo force model.

The two halo centers move under a chosen symmetric softened pair force. The stars exert no force on each other or on the centers. There is no gas, star formation, feedback, dynamical friction, live dark matter, or stellar collision treatment. Consequently this can illustrate tidal responses and flybys, but cannot establish that two realistic galaxies merge, reproduce detailed spiral structure, or predict the Milky Way–Andromeda future. A close passage is not a literal stellar collision.

No drag is added to make a visually satisfying merger. Bound centers can return; unbound centers can depart. The displayed center orbit trail is not a trail for every star.

## Equations

All calculation uses dimensionless code units with G = 1. Halo g has mass M_g, center X_g(t), and core scale a_g.

Potential: Phi_g(x,t) = -G M_g / sqrt(|x-X_g|² + a_g²).

Tracer acceleration: a(x,t) = -G sum_g M_g (x-X_g) / (|x-X_g|²+a_g²)^(3/2).

The center pair uses U(R) = -G M_A M_B / sqrt(R²+a_c²), with the **same** center softening a_c in both directions. This conserves center momentum and angular momentum analytically. It is a chosen approximate interaction law, not the exact mutual-force convolution of two overlapping Plummer spheres. Halo core radii are not the same parameter as the center pair softening.

Integration is fixed-step kick–drift–kick leapfrog (velocity Verlet). For each substep, the CPU computes both old and new center positions. The GPU uses the old centers for the first kick and the new centers for the second kick:

1. v_half = v_n + (h/2) a(x_n, X_n)
2. x_next = x_n + h v_half
3. v_next = v_half + (h/2) a(x_next, X_next)

The stars are integrated using WebGL 2 transform feedback with two interleaved position/velocity buffers. The center integration uses JavaScript double precision; GPU star integration uses highp 32-bit floats. They share the force law but not the same arithmetic precision.

## Initial conditions

Each initial stellar disk is exactly thin, with exponential radial surface-density sampling: R = -R_d ln(u_1 u_2), rejected outside its finite radial limits. Angular phase is uniform. Circular speed in its own isolated spherical halo is:

v_c(R)² = G M R² / (R²+a²)^(3/2).

Position and tangential velocity are rotated together into the disk plane, then the center position and velocity are added. This is a cold tracer equilibrium in an **isolated** spherical halo. The other halo already perturbs it at the finite initial separation, so the combined initial system is not an exact equilibrium. These disks are not self-gravitating spiral-galaxy models.

The default preset is illustrative: masses 1 and 1.3; separation 10; halo cores 0.6 and 0.6 times the cube root of the mass ratio; center softening 0.8. Relative approach speed is 0.92 of the escape speed **in the chosen softened center potential at that separation**, and the approach angle is 22 degrees relative to the inward separation direction. It is not an impact parameter measured at infinity or a guaranteed pericenter distance. Disk A tilts 8 degrees; disk B defaults to 35 degrees with an additional 35-degree node rotation. Both rotate prograde by default. Reverse B changes its local orbital sense, not its center trajectory.

Optional illustrative physical scaling is L0 = 10 kpc and M0 = 10^11 solar masses. Then V0 ≈ 207.4 km/s and T0 ≈ 47.15 Myr. No galaxy data were fitted to obtain these choices. Displayed distance and time remain code units.

## Controls and diagnostics

- Default h = 0.005. Halving h is the primary convergence check. Changing `Time flow` alters the number of fixed steps per wall-clock second, not h.
- Work is bounded to six substeps per displayed frame. If overloaded, elapsed time is discarded and simulation runs slower; h never expands to catch up. Hidden tabs pause. The pixel budget and tracer count are bounded; neither increases automatically.
- Encounter changes require Restart; count changes also restart. Restart repeats the seed. Pause stops integration and GPU redraws except when the view or controls change. Single step advances one h and leaves the experiment paused.
- Energy drift is **only the two-center mechanical energy**, displayed as (E(t)-E(0))/|U(0)|. The potential-energy normalization remains defined for a parabolic E(0)=0 orbit. It says nothing about tracer GPU integration accuracy.
- Individual tracer energy varies physically because its field is time-dependent. There is no displayed fictitious total stellar energy or claim of system-wide conservation.
- FPS is measured browser frame cadence, not a GPU timing query, utilization, temperature or VRAM meter.

## Verification and limits

Run `node modules/galaxy-encounter/physics.test.js` from the project root. The CPU reference tests cover equal-and-opposite mass-weighted center accelerations, barycentric initial conditions, circular-speed force balance, seed determinism, finite initial states, center angular-momentum/COM conservation, timestep convergence, coupled tracer time reversibility, and a circular tracer orbit.

The default-center orbit over 50 code-time units gives maximum absolute energy error around 1.46e-6 at h=0.005 in the CPU test. Position-error reduction is approximately fourfold when h halves, consistent with a second-order scheme. These results are **not** measurements of the GPU shader, the user's hardware, or realistic galaxy accuracy. Long-lived float32 tracer orbits and scientific observables need separate convergence/precision validation. No guaranteed FPS or crash-free operation is claimed.

## Primary sources and further reading

- Toomre & Toomre (1972), *Galactic Bridges and Tails*: restricted gravitational encounters as a way to understand tidal features. [NASA GISS bibliographic record](https://www.giss.nasa.gov/pubs/abs/to03000u.html).
- Toomre's discussion of interaction models and their limitations: [NED reproduction](https://ned.ipac.caltech.edu/level5/Toomre/Toomre1.html).
- Jo Bovy, *Dynamics and Astrophysics of Galaxies*, spherical potentials and Plummer model: [equations and derivation](https://galaxiesbook.org/chapters/I-01.-Gravitation_4-Examples-of-spherical-potentials.html).

The implementation is original project code, not copied from an unreviewed galaxy demo or a private hardware project.

- NVIDIA GPU Gems 3, numerical GPU N-body methods: [Fast N-Body Simulation with CUDA](https://developer.nvidia.com/gpugems/gpugems3/part-v-physics-simulation/chapter-31-fast-n-body-simulation-cuda). This experiment uses a restricted O(N) tracer model, not that chapter's full all-pair self-gravitating method.

The actual Milky Way–Andromeda future remains model-sensitive. Published/recent analyses differ as input assumptions and proper motions change: [Sawala et al.](https://arxiv.org/abs/2408.00064) and [Wu et al. 2026 preprint](https://arxiv.org/abs/2603.22863). The preset here does not resolve that debate or include satellite galaxies and live-halo friction.

Independent CPU parameter sweep: 54 combinations of mass ratio, approach speed/angle and timesteps through 80 code units had worst |delta E|/|U0| about 0.00435 at the intentionally coarser h=0.02. This is a reason to inspect drift and compare smaller steps, not a promise that coarse integration is accurate. Cloud-browser WebGL2 availability and user GPU execution are separate validation gates.
