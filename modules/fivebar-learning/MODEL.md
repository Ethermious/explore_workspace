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

Generic planar mobility: M = 3(n−1)−2j = 3(5−1)−2·5 = 2. This count does not describe instantaneous control at singular poses.

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
