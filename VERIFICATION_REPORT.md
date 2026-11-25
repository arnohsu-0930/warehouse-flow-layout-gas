# Verification Report (v4+v5) — Floor Plan Flow & Layout Studio (GAS)

> 測試執行時間：2026-11-25 13:37–13:39 (Asia/Taipei)  
> 測試工具：Playwright Headless Chromium (`chromium_headless_shell-1234`, `playwright-core`)  
> 驗證對象：
> 1. **Local Build**：`http://127.0.0.1:57411/index.html`
> 2. **Live GAS `/exec` URL**：`https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec`（固定部署版本 `@7`，GitHub Actions Run `#45554933502`，commit `54acc11`，穿透 `#sandboxFrame` → `#userHtmlFrame` 實測）

---

## 總體結果摘要

| 驗證項目 | Local Build | Live GAS `/exec` (`@7`) | 結果 |
|---|---:|---:|---|
| 範本 2 (`coldroom_2d`) 淨化（移除 EVAP-1/EVAP-2 與中央文字，保留純淨地板/牆面/貨架/門框） | PASS (`removed=0`, `kept=4/4`) | PASS (`removed=0`, `kept=4/4`) | ✅ |
| 內建範本數量維持 3 種且零舊範本殘留 | PASS (`3/3`, `forbiddenHits=0`) | PASS (`3/3`, `forbiddenHits=0`) | ✅ |
| Role 1 — 可修改文字方塊（拖曳與點擊放置、雙擊編輯多行文字、`Escape` 退出、屬性面板、永遠置於遮罩/形狀上層、複製/刪除/復原） | PASS (`4→5→4→5`) | PASS (`4→5→4→5`) | ✅ |
| Role 2 — 動態點位按鈕（2–8 層輪測 `T`/`L…`/`M`/`B` + M 層切換）與點位圖例/點位/貨架配色同步 + JSON 存取還原 | PASS (`75,334 bytes`) | PASS (`75,332 bytes`) | ✅ |
| Role 3 — v3 回歸（3D 空間箱與 3D 獨立門）+ 固定 14 天雲端暫存（無選單、真實存取與刪除清理）+ 2x PNG 匯出 + 乾淨重置 | PASS (`410,686 bytes`) | PASS (`413,543 bytes`) | ✅ |
| Desktop 視口 (`1440×900`) 無水平溢位 | PASS (`1440/1440`) | PASS (`1440/1440`) | ✅ |
| Mobile 視口 (`390×844`) 抽屜開關與畫布適配 | PASS (`390/390`) | PASS (`390/390`) | ✅ |
| Console Errors | **0** | **0** | ✅ |
| Page Errors (Uncaught Exceptions) | **0** | **0** | ✅ |
| HTTP 4xx / 5xx Errors | **0** | **0** | ✅ |

---

## 詳細測試證據

### 1. 範本 2（冷藏庫平面範本 2D / `coldroom_2d`）淨化驗證

| 檢查項目 | Local Build 實測結果 | Live GAS `/exec` (`@7`) 實測結果 |
|---|---|---|
| 內建範本清單 | 3 種：`blank`, `coldroom_2d`, `coldroom_3d`（舊範本字樣命中 `0`） | 3 種：`blank`, `coldroom_2d`, `coldroom_3d`（舊範本字樣命中 `0`） |
| 移除項目掃描（`冷風機`, `EVAP-1`, `EVAP-2`, `中央作業通道`, `W-04 冷藏庫 2D`, `#bae6fd`） | 命中 **`0`** | 命中 **`0`** |
| 保留項目檢查（綠地板 `#dcfce7`、牆體 `#0f172a`、貨架 `#166534`、`保溫雙開門`） | **`4 / 4`** 完整保留 | **`4 / 4`** 完整保留 |

### 2. Role 1 — 可修改文字方塊（v4）全流程驗證

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` (`@7`) 實測結果 |
|---|---|---|
| 拖曳拉框放置與單擊預設尺寸放置文字方塊（共 2 組） | 放置成功且立即進入編輯模式，`Escape` 鍵正常退出編輯 | 放置成功且立即進入編輯模式，`Escape` 鍵正常退出編輯 |
| 雙擊文字方塊重新編輯多行文字 | 更新為多行文字並正確保存 | 更新為多行文字並正確保存 |
| 屬性面板設定（字級 `24px`、粗體、置中對齊、外框 `3px`、底色開/透明切換） | 所有屬性正確寫入並持久化於 `textBoxMeta` | 所有屬性正確寫入並持久化於 `textBoxMeta` |
| 於文字方塊之後放置「白色方遮罩」與「自訂形狀方塊」並檢查圖層順序 | 2 組文字方塊之 z-index 均嚴格高於 `maskRect` 與 `shapeBlock` | 2 組文字方塊之 z-index 均嚴格高於 `maskRect` 與 `shapeBlock` |
| 複製 → 刪除 → 復原（`Undo`） | 畫布物件數 `4 → 5 → 4 → 5` 全數正確 | 畫布物件數 `4 → 5 → 4 → 5` 全數正確 |

### 3. Role 2 — 2–8 層動態點位按鈕與點位圖例顏色同步（v5）

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` (`@7`) 實測結果 |
|---|---|---|
| 2–8 層動態點位按鈕輪測 | `2:[T,B]`、`3:[T,M,B]`、`4:[T,M,L2,B]`、`5:[T,M,L3,L2,B]`、`6:[T,M,L4,L3,L2,B]`、`8:[T,M,L6,L5,L4,L3,L2,B]` | 與 Local 完全一致（2–8 層全數通過） |
| 6 層狀態下放置點位（T/M/B 等）、點位圖例卡片與 6 層貨架圖 | 點位圖例列出全 6 層且初始顏色與點位按鈕、點位圓標完全一致 | 點位圖例列出全 6 層且初始顏色與點位按鈕、點位圓標完全一致 |
| 修改 `T` 層顏色為 `#00aa55`、`M` 層顏色為 `#ff8800` | 點位按鈕、已放置點位圓標、點位圖例卡片對應字色與貨架層徽章 **4 處同步更新** | 點位按鈕、已放置點位圓標、點位圖例卡片對應字色與貨架層徽章 **4 處同步更新** |
| 選取貨架狀態下切換層數 `6 → 3 → 5` 並變更 M 層位置（`M@1`） | 點位圖例即時縮放為 3 層再同步為 5 層（`T,M,L3,L2,B`），且保留自訂 `T=#00aa55` 顏色 | 點位圖例即時縮放為 3 層再同步為 5 層（`T,M,L3,L2,B`），且保留自訂 `T=#00aa55` 顏色 |
| 匯出專案 JSON → 清除畫布 → 改為 2 層 → 匯入 JSON 還原 | 匯出 `75,334 bytes`，完整還原 5 層設定、自訂顏色 `#00aa55` 與所有畫布物件 | 匯出 `75,332 bytes`，完整還原 5 層設定、自訂顏色 `#00aa55` 與所有畫布物件 |

### 4. Role 3 — v3 回歸、固定 14 天雲端暫存、2x PNG 匯出、響應式視口與乾淨重置

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` (`@7`) 實測結果 |
|---|---|---|
| v3 3D 物件回歸（放置 3D 綠色空間箱與 3D 獨立門物件） | 正常放置、零錯誤 | 正常放置、零錯誤 |
| 雲端暫存視窗無使用者天數下拉選單，且顯示固定 14 天提示 | `<select>` 數量 **`0`**，顯示 14 天自動刪除提示 | `<select>` 數量 **`0`**，顯示 14 天自動刪除提示 |
| 建立測試暫存專案並刪除清理 | 儲存、顯示、刪除確認皆通過，殘留 **`0`** | 寫入真實 GAS `PropertiesService`、顯示、刪除確認皆通過，殘留 **`0`** |
| 匯出 2x 高解析 PNG | 有效 PNG（`89504e470d0a1a0a`，**`410,686 bytes`**） | 有效 PNG（`89504e470d0a1a0a`，**`413,543 bytes`**） |
| Desktop (`1440×900`) & Mobile (`390×844`) 視口與抽屜檢查 | `1440/1440`、`390/390`、行動工具抽屜開合正常 | `1440/1440`、`390/390`、行動工具抽屜開合正常 |
| 執行「重置全部」清理狀態 | `物件：0`，恢復預設 `4` 層與 4 顆點位按鈕 | `物件：0`，恢復預設 `4` 層與 4 顆點位按鈕 |

---

## GitHub Actions 自動部署紀錄

- **Workflow**：`.github/workflows/deploy.yml`
- **Run ID**：`45554933502`（[查看執行紀錄](https://github.com/arnohsu-0930/warehouse-flow-layout-gas/actions/runs/45554933502)）
- **Commit SHA**：`54acc11f2eb094df03aa97ae53f171a266f63bf5`
- **結果**：`completed` / `success`（耗時 18s，`Pushed 3 files`，更新固定部署至 `@7`）
