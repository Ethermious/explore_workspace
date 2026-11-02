# Validation · v0.1

- PASS: 34,020 five-bar geometry cases across base/link lengths, all four assembly branches and a target grid. Reachability, link lengths, symmetry, finite-input guards and closure residuals checked independently in Node.
- PASS: JavaScript syntax checks for launcher, registry and kinematics.
- PASS: Actual cloud browser rendered homepage and linkage. Trace start/pause, unreachable numeric targets, Reset, branch crossing warning, slider control and Home/Back behavior were exercised. Screenshots inspected.
- PASS: WebGL 2 unavailable fallback rendered in the cloud browser.
- NOT VERIFIED: Actual GPU shader compilation/live visual output in this cloud environment, because WebGL 2 was unavailable. The GPU module remains experimental; CPU numerical reference tests are not shader execution tests.
- NOT VERIFIED: Narrow/mobile visual layout. Responsive CSS is implemented but no actual mobile viewport run completed.
- Local headless Chromium launch in the command sandbox was blocked by socket/process environment restrictions. No user-computer fallback or security-setting changes were attempted.
- NOT TESTED: Windows shell launcher, user browser/driver, RTX 3070 Ti performance, sustained GPU thermal behavior, instant-ngp native execution, real stepper hardware.

A smooth rendering is not evidence of physical accuracy. This release has no hardware connection or motor command path.
