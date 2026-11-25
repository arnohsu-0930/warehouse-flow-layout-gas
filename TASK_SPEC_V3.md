v3 spec
1. 3D green room box (floor + walls only, no blue rack/red door baked in), supporting rotation/orientation, horizontal/vertical flip, mirror transform, and resizing.
2. Standalone 3D door object (based on red box area) with multiple orientations/directions, rotation, flip, and mirror transform.
3. Cold Room Isometric Space Template (3D): remove the blue object so only clean 3D room/floor/wall space remains.
4. Remove these 4 templates completely: 工廠平面圖範本 (全部), 實驗室平面圖範本 (黃底), 製造區平面圖範本 (紅框內), 倉儲區平面圖範本 (藍框內).
5. Verify with Playwright multi-role tests (0 console/page/HTTP errors), push to main, wait for GitHub Actions deploy workflow to succeed, and update STATUS.md & VERIFICATION_REPORT.md.
