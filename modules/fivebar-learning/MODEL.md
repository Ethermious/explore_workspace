# First principles of the portable five-bar

This is an ideal planar rigid-link teaching model, not a hardware design release.

## Geometry and conventions

All lengths are millimetres unless explicitly converted. World origin is the whole board's bottom-left; +x right, +y up. Both motor angles are absolute, counterclockwise from +x. Calculus uses radians; the UI displays degrees.

- Board: 1828.8 × 1219.2 mm. Left robot zone: x ∈ [0,914.4].
- Proximal length p = 854.6785714285714 mm.
- Distal length q = 435 mm.
- Fixed spacing d = 839.3571428571429 mm.
- A = (37.521428571428544,10), B = (876.8785714285714,10).
- Elbows L and R, tool T. A and B are the only driven pivots.
- Ground A–B plus four moving links make five bars. Geometric crossings are not joints; the physical bars require separate depth layers.

## Generic planar mobility

The Grübler–Kutzbach criterion for a planar mechanism is:

M = 3(n − 1) − 2j₁ − j₂.

Here M is the number of independent degrees of freedom; n is the number of rigid bodies including ground; j₁ counts joints allowing one relative motion (revolute pins or prismatic sliders); and j₂ counts joints allowing two relative motions (ideal planar higher-pair contacts).

A free planar rigid body has three motions: two translations and one rotation. Fixing ground leaves n−1 moving bodies. Each one-motion joint removes two relative motions; each two-motion joint removes one.

For this linkage, n=5, j₁=5 and j₂=0:

M = 3(5−1) − 2·5 − 0 = 12−10 = 2.

This is a generic count assuming independent constraints. The two motor angles control the two freedoms on a chosen assembly branch away from singularities. Special alignments, including flat rest, need the separate instantaneous singularity analysis below. The lesson renders the generic formula and substitution with native MathML before the explanation and numbers.

## Elbow positions

For base O_i and angle θ_i:

E_i = O_i + p(cos θ_i, sin θ_i).

This is just a length-p vector projected onto the coordinate axes, then translated to its fixed origin.

## Inverse kinematics

For target T, define r_i = ||T−O_i|| and α_i = atan2(T_y−O_iy, T_x−O_ix). Let β_i be the unsigned angle between the base-to-tip ray and proximal link.

The fixed distal constraint expands as:

q² = ||T−O_i − p(cos θ_i,sin θ_i)||²
   = r_i² + p² − 2pr_i cos(θ_i−α_i).

Therefore β_i = acos[(p²+r_i²−q²)/(2pr_i)] and θ_i = α_i ± β_i.

Existence requires |p−q| ≤ r_i ≤ p+q and r_i ≠ 0. The portable inward elbow choice is θ_L = α_L−β_L and θ_R = α_R+β_R. These IK signs do not alone specify a physical path or guarantee the selected forward assembly at every target.

## Forward kinematics

Compute L and R from motor angles. Define v=R−L, c=||v||, M=(L+R)/2 and n=(-v_y/c,v_x/c). The two equal-radius circles imply a perpendicular-bisector chord. A right triangle gives h²=q²−(c/2)², so:

T = M ± h n.

The selected inward closure uses the negative sign. If c>2q there is no closure. If c=2q the circles touch. If c=0 the circles coincide, so a unique tip cannot be inferred.

## Velocity constraints and Jacobian

Let u_i=(T−E_i)/q and v_tip=Ṫ. Differentiate each squared fixed-length constraint:

(T−E_i)·(T−E_i)=q²
2(T−E_i)·(Ṫ−Ė_i)=0
u_i·v_tip = u_i·Ė_i.

Because Ė_i=p(-sin θ_i,cos θ_i)ω_i:

u_i·v_tip = b_i ω_i,
b_i = p[-u_ix sin θ_i + u_iy cos θ_i] = p sin(φ_i−θ_i).

φ_i is the absolute elbow-to-tool direction. Stack the two equations:

C v_tip = D_ω ω,
C = [u_Lᵀ; u_Rᵀ], D_ω=diag(b_L,b_R), J=C⁻¹D_ω.

With Δ=u_Lx u_Ry−u_Ly u_Rx:

J = (1/Δ) [[u_Ry b_L, −u_Ly b_R], [−u_Rx b_L, u_Lx b_R]].

C is dimensionless; J and D_ω use mm/rad. κ₂(J)=σ_max/σ_min compares directional velocity gains. κ=1 is isotropic; a large value indicates unequal sensitivity. It does not report absolute gain or hardware safety.

## Singularities

Serial: b_i=0 when proximal and distal links are collinear. The forward map may remain finite but rank-deficient; inverse differential control fails.

Parallel: Δ=sin(φ_R−φ_L)=0 when distal link directions are parallel. C cannot be inverted, and the linearized passive constraints admit an uncontrolled direction with motors fixed. A rank deficiency in a linearized constraint does not automatically imply a finite free-motion path.

Monitor both serial sines and the parallel sine. A limiting condition number by itself cannot establish control at a simultaneous degeneracy.

For this geometry p=q+d/2. At θ=[0,π], L=(892.2,10), R=(22.2,10), T=(457.2,10). Elbow separation is 870=2q: both serial and parallel singularities occur. Endpoint span plus 10 mm at each end is 890 mm. This is a mechanically supported terminal carry pose, not a regular drawing waypoint. This model does not establish its stability, safe access or load retention.

## Virtual work and gravity

For compatible displacements δT=Jδθ, ideal work balance is τᵀδθ=FᵀδT. Consequently τ=JᵀF when F is the force the mechanism exerts at the tool. For external force F_ext applied to the mechanism, balancing actuator torque is −JᵀF_ext. Convert J to metres/radian for N·m results.

For a vertical board, let each uniform proximal bar have mass m_p, each distal bar m_d, each elbow m_e, and tool m_t. Put C_m=(m_p+m_d)/2+m_e and D_m=m_d+m_t. Summing midpoint gravitational potentials and omitting constant base-height terms:

U=g[C_m(y_L+y_R)+D_m y_T]+constant,
τ_i,hold=∂U/∂θ_i=g[C_m p cos θ_i+D_m J_yi].

Use metres, kilograms and radians. This static ideal model excludes friction, inertia, pen contact, gearing losses, compliance and motor torque-speed limits.

## Worked nominal pose

At T=(457.2,701.04) mm:

- θ_L=28.568773169°, θ_R=151.431226831°.
- L=(788.137531379,418.718639978) mm.
- R=(126.262468621,418.718639978) mm.
- J=[[-524.532976500,−524.532976500],[614.858359841,−614.858359841]] mm/rad.
- κ₂(J)=1.172201534.
- ω=(0.1,0.1) rad/s gives v≈(−104.9065953,0) mm/s.
- ω=(0.1,−0.1) rad/s gives v≈(0,122.9716720) mm/s.
- An upward exerted point force F=(0,1) N corresponds to τ≈(+0.61485836,−0.61485836) N·m, excluding all gravity and other loads.

## Sources

The derivations above follow directly from this mechanism's constraints. General references:

- [Lynch and Park, Modern Robotics: Velocity Kinematics and Statics](https://modernrobotics.northwestern.edu/nu-gm-book-resource/velocity-kinematics-and-statics/): velocity Jacobians, singular values and virtual work.
- [Chablat and Wenger, Working Modes and Aspects in Fully-Parallel Manipulators](https://arxiv.org/abs/0707.2006): inverse/direct solutions and serial/parallel singularities.
- [Chablat and Wenger, Moveability and Collision Analysis for Fully-Parallel Manipulators](https://arxiv.org/abs/0707.1957): reachable sets versus collision-free path regions.
- [Canonical geometry](../../docs/portable-fivebar-default.json) and [retained drive-feasibility research](../../docs/research/whiteboard-drive-feasibility/2026-11-02.md).


## Comparing elbow working modes without confusing reach and paths

With unlimited ideal motor angles, all four IK elbow-sign choices share the same annular-intersection pen reach. Branch differences in this lesson's shaded comparison come from the selected pose's whole-link padded containment and differential regularity, not a different annular reach formula.

The comparison accepts a pose when all pivots satisfy the padded robot-half envelope, the minimum of both absolute serial sines and the absolute parallel sine is at least 0.08, and κ₂(J) is at most 20. It permits either closure determinant sign. The separate canonical inward drawing preview additionally requires det C < 0; that restriction must not silently erase other assembly modes in this four-working-mode comparison.

The comparison grid is mirror-symmetric: x=(i+1/2)914.4/26 and y=(j+1/2)1219.2/34. Among 884 half-board sample points, every working mode has 554 geometrically reachable points. Contained-and-regular counts are 546 for (−,+), 150 for (+,−), and 311 each for (+,+) and (−,−). These are sampled pointwise counts, not exact area, guaranteed connected paths, collision clearance or hardware-safe regions. The two matching counts reflect mirror symmetry rather than an accidental asymmetric sampling grid.

The guided module keeps these concepts spatially coupled: equations, symbol-specific highlights, coordinate projections and causal input/output labels change together through manual steps. No animation, control command or automatic branch transition is implied.
