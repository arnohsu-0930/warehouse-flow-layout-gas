# Verification Report (v6) — Floor Plan Flow & Layout Studio (GAS)

> 測試執行時間：2026-11-25 14:32–14:35 (Asia/Taipei)  
> 測試工具：Playwright Headless Chromium (`chromium_headless_shell-1234`, `playwright-core`)  
> 驗證對象：
> 1. **Local Build**：`http://127.0.0.1:63428/index.html`
> 2. **Live GAS `/exec` URL**：`https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec`（固定部署版本 `@8`，GitHub Actions Run `#45561476195`，commit `44afbe5`，穿透 `#sandboxFrame` → `#userHtmlFrame` 實測）

---

## 總體結果摘要

| 驗證項目 | Local Build | Live GAS `/exec` (`@8`) | 結果 |
|---|---:|---:|---|
| Role 1 — 3D 矩形方塊與 2D 圓角矩形中點控點（`mr`/`mb`）獨立縮放無變形重繪 + 置中文字清晰正向（含 `37°` 旋轉與水平翻轉） | PASS (`scale=1×1`, `text=1×1`) | PASS (`scale=1×1`, `text=1×1`) | ✅ |
| Role 2 — 全系列方塊多邊形頂點/邊線自由拉伸（3D 矩形/圓形 8 點/L 型 6 點 + 3D 棧板/立柱 + 3D 空間箱 + 3D 門）與 3D 斜角/俯角/厚度調整 | PASS (`c0Drift=0.00px`, `0` 殘留控點) | PASS (`c0Drift=0.00px`, `0` 殘留控點) | ✅ |
| Role 3 — Undo/Redo + JSON 匯出/清除/匯入完整還原（含 `customVerts`、`isoAngle`、`isoSkew`、`extrudeHeight` 與正向文字） | PASS (`120,624 bytes`, `8/8`) | PASS (`120,598 bytes`, `8/8`) | ✅ |
| v4+v5 回歸（可修改文字方塊置頂 + 6 層動態點位按鈕）+ 2x 高解析 PNG 匯出 + 乾淨重置 | PASS (`430,173 bytes`, `reset=0`) | PASS (`434,267 bytes`, `reset=0`) | ✅ |
| Desktop (`1440×900`) & Mobile (`390×844`) 無水平溢位與行動抽屜開合 | PASS (`1440/1440`, `390/390`) | PASS (`1440/1440`, `390/390`) | ✅ |
| Console Errors | **0** | **0** | ✅ |
| Page Errors (Uncaught Exceptions) | **0** | **0** | ✅ |
| HTTP 4xx / 5xx Errors | **0** | **0** | ✅ |

---

## 詳細測試證據

### 1. Role 1 — 非等比縮放無變形重繪與正向清晰文字

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` (`@8`) 實測結果 |
|---|---|---|
| 3D 矩形方塊拖曳右側中點控點 (`mr`, `+80px`) | 尺寸 `160×104 → 242×104`（深度 `L` 不變），`scaleX=1, scaleY=1`，置中文字 `1×1` 無擠壓 | 尺寸 `160×104 → 241×104`（深度 `L` 不變），`scaleX=1, scaleY=1`，置中文字 `1×1` 無擠壓 |
| 3D 矩形方塊拖曳底部中點控點 (`mb`, `+65px`) | 尺寸 `242×104 → 242×148`（厚度 `H=50`），`scaleX=1, scaleY=1`，置中文字 `1×1` 無擠壓 | 尺寸 `241×104 → 241×148`（厚度 `H=50`），`scaleX=1, scaleY=1`，置中文字 `1×1` 無擠壓 |
| 任意角度旋轉 (`37°`) + 水平翻轉 (`flipX`) | 方塊旋轉 `37°` 且翻轉，文字精確反向補償保持水平正向、無鏡像倒字 | 方塊旋轉 `37°` 且翻轉，文字精確反向補償保持水平正向、無鏡像倒字 |
| 2D 圓角矩形依序拖曳 `mr` (`+65px`) 與 `mb` (`+45px`) | 尺寸 `160×104 → 224×147`，`scaleX=1, scaleY=1`，文字 `1×1` 且角度 `0°` | 尺寸 `160×104 → 223×148`，`scaleX=1, scaleY=1`，文字 `1×1` 且角度 `0°` |

### 2. Role 2 — 全系列方塊多邊形頂點/邊線自由拉伸與 3D 斜角調整

| 測試對象 | Local Build 實測結果 | Live GAS `/exec` (`@8`) 實測結果 |
|---|---|---|
| 3D 矩形方塊 (`shapeBlock`) | 4 橘角點 + 4 藍邊點；拖曳角點 #1 移動 `60.9px` 時角點 #0 漂移 **`0.00px`**；拖曳邊點 #2；完成後控點殘留 `0`；切換 `俯視 45°`、斜角偏斜 `-20°`、厚度 `68` 全數生效 | 4 橘角點 + 4 藍邊點；拖曳角點 #1 移動 `60.9px` 時角點 #0 漂移 **`0.00px`**；拖曳邊點 #2；完成後控點殘留 `0`；切換 `俯視 45°`、斜角偏斜 `-20°`、厚度 `68` 全數生效 |
| 3D 圓形/橢圓 (`shapeBlock`) | 顯示 8 個平滑曲線控制點並完成自由拉伸曲面擠出 | 顯示 8 個平滑曲線控制點並完成自由拉伸曲面擠出 |
| 3D L 型區塊 (`shapeBlock`) | 顯示 6 個 L 型立體稜柱頂點並完成自由拉伸 | 顯示 6 個 L 型立體稜柱頂點並完成自由拉伸 |
| 3D 棧板 (`equipment/pallet`) | `mr` 獨立加寬至 `W=98` (`scale=1×1`) + 4 頂點自由拉伸成斜角棧板 | `mr` 獨立加寬至 `W=98` (`scale=1×1`) + 4 頂點自由拉伸成斜角棧板 |
| 3D 立柱 (`equipment/pillar`) | 4 頂點自由拉伸並保持 3D 垂直柱體連結 (`scale=1×1`) | 4 頂點自由拉伸並保持 3D 垂直柱體連結 (`scale=1×1`) |
| 3D 綠色空間箱 (`roomBox3d`) | `mr` 獨立加寬 (`scale=1×1`) + 切換 `平緩 18°` + 4 地板角點自由拉伸成斜牆空間箱 | `mr` 獨立加寬 (`scale=1×1`) + 切換 `平緩 18°` + 4 地板角點自由拉伸成斜牆空間箱 |
| 3D 獨立門物件 (`door3d`) | `mb` 獨立調高 (`scale=1×1`) + 門框厚度 `24` + 4 門角自由拉伸對齊斜牆 | `mb` 獨立調高 (`scale=1×1`) + 門框厚度 `24` + 4 門角自由拉伸對齊斜牆 |

### 3. Role 3 — Undo/Redo、JSON 存取還原、v4+v5 回歸、PNG 匯出與視口驗證

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` (`@8`) 實測結果 |
|---|---|---|
| 頂點拉伸後 Undo → Redo | 精確撤銷與重做 `door3d` 之 `customVerts` | 精確撤銷與重做 `door3d` 之 `customVerts` |
| 匯出專案 JSON → 清除畫布 → 匯入還原 | `120,624 bytes`，零暫時頂點控點，8/8 物件（含全部 `customVerts`、`isoAngle=45`、`isoSkew=-20`、`extrudeHeight=68`、正向文字 `1×1`）完整還原 | `120,598 bytes`，零暫時頂點控點，8/8 物件（含全部 `customVerts`、`isoAngle=45`、`isoSkew=-20`、`extrudeHeight=68`、正向文字 `1×1`）完整還原 |
| v4+v5 回歸（文字方塊置頂 + 6 層動態點位按鈕） | `textBox` 維持最上層，6 層同步產生 6 顆點位按鈕 | `textBox` 維持最上層，6 層同步產生 6 顆點位按鈕 |
| 匯出 2x 高解析 PNG | 有效 PNG（`89504e470d0a1a0a`，**`430,173 bytes`**） | 有效 PNG（`89504e470d0a1a0a`，**`434,267 bytes`**） |
| Desktop (`1440×900`) & Mobile (`390×844`) 與乾淨重置 | `1440/1440`、`390/390`、行動抽屜正常、重置後物件數 `0` | `1440/1440`、`390/390`、行動抽屜正常、重置後物件數 `0` |

---

## GitHub Actions 自動部署紀錄

- **Workflow**：`.github/workflows/deploy.yml`
- **Run ID**：`45561476195`（[查看執行紀錄](https://github.com/arnohsu-0930/warehouse-flow-layout-gas/actions/runs/45561476195)）
- **Commit SHA**：`44afbe52d86b049625498aa51faac8eb648cc96b`
- **結果**：`completed` / `success`（耗時 21s，`Pushed 3 files`，更新固定部署至 `@8`）
