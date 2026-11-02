# Photo-to-3D: run the included fox scene

**Windows · RTX 3070 Ti 8 GB · research/evaluation**

Try a real photo-based NeRF locally, without taking photos or setting up a compiler. This is a viewable neural reconstruction, not a finished CAD model or an editable game level.

## Four steps

1. Download NVIDIA's official [RTX 3000/4000 Windows ZIP](https://github.com/NVlabs/instant-ngp/releases/download/continuous/Instant-NGP-for-RTX-3000-and-4000.zip).
2. In File Explorer, use **Extract All**. Open the extracted folder containing `instant-ngp.exe`; keep its accompanying folders and DLL files together.
3. Launch **`instant-ngp.exe`**.
4. Drag that extracted folder's **`data\nerf\fox`** folder into the application window. Let the reconstruction train, then explore it.

These are the official [Windows installation and fox sample instructions](https://github.com/NVlabs/instant-ngp#installation), with Windows path separators. No Python, COLMAP, personal photos, or source build is part of this sample route.

## Explore and keep it

- **W/A/S/D:** move or pan; **Space/C:** up/down.
- **T:** toggle training; **Shift+R:** reset camera.
- Under **Snapshot**, use **Save** to preserve the trained scene and **Load** to reopen it.

See the official [controls](https://github.com/NVlabs/instant-ngp#keyboard-shortcuts-and-recommended-controls).

## What was verified

The official [Windows packaging workflow](https://github.com/NVlabs/instant-ngp/blob/master/.github/workflows/main.yml) includes `instant-ngp.exe`, CUDA runtime/compiler DLLs, configurations, and the entire `data/` directory in the release ZIP. The official [fox directory](https://github.com/NVlabs/instant-ngp/tree/master/data/nerf/fox) contains photographs and `transforms.json`; camera preparation has already been done. Thus a separate sample download or photo-processing setup is not needed for this route. This is verified from the published packaging manifest, not by inspecting a downloaded executable archive.

The [release asset listing](https://github.com/NVlabs/instant-ngp/releases/expanded_assets/continuous) showed **71.7 MB compressed** when checked on 2026-11-02. The download is a mutable **continuous development release**, so its size/content may change. An exact extracted disk requirement was not established; allow room for the archive, extracted files, and any saved snapshots.

## Limits and troubleshooting boundary

The official download explicitly targets RTX 3000 cards. This guide was not runtime-tested on your RTX 3070 Ti; 8 GB VRAM fit, driver compatibility, frame rate, and training time are not guaranteed. If it fails to launch or load, keep the exact error text for troubleshooting rather than starting a build or installing extra packages blindly.

The [NVIDIA license, §3.3](https://github.com/NVlabs/instant-ngp/blob/master/LICENSE.txt) restricts use to **noncommercial research or evaluation**. Do not assume permission for commercial shop/client work.

No executable was downloaded or run, no software was installed, and your desktop was not accessed while preparing this guide.
