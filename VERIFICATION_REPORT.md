# Verification Report (v3) — Floor Plan Flow & Layout Studio (GAS)

> 測試執行時間：2026-11-25 11:18–11:21 (Asia/Taipei)  
> 測試工具：Playwright Headless Chromium (`chromium_headless_shell-1234`, `playwright-core`)  
> 驗證對象：
> 1. **Local Build**：`http://127.0.0.1:57097/index.html`
> 2. **Live GAS `/exec` URL**：`https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec`（固定部署版本 `@6`，GitHub Actions Run `#45539195093`，commit `b52f9ae`，穿透 `#sandboxFrame` → `#userHtmlFrame` 實測）

---

## 總體結果摘要

| 驗證項目 | Local Build | Live GAS `/exec` (`@6`) | 結果 |
|---|---:|---:|---|
| 內建範本數量（僅保留 3 種，完全移除 4 種舊廠區/實驗室/製造區/倉儲區範本） | PASS (`3/3`, `forbiddenHits=0`) | PASS (`3/3`, `forbiddenHits=0`) | ✅ |
| 冷藏庫等角立體空間範本 (3D) 淨化（零藍色冷風機與固定門，僅純淨 3D 地板與牆面） | PASS (`blueHits=0`) | PASS (`blueHits=0`) | ✅ |
| Role 1 — 3D 綠色空間箱（純地板+牆面、4 朝向、旋轉、水平/垂直翻轉、左右/上下鏡像、W/L/H 縮放與重設） | PASS | PASS | ✅ |
| Role 1 — 獨立 3D 門物件（5 朝向、雙開/單開切換、旋轉、水平/垂直翻轉、左右/上下鏡像、寬高縮放）+ JSON 存取還原 | PASS | PASS | ✅ |
| Role 2 — v2 全功能回歸（自訂動線圖例、2D/3D 自訂形狀、動線箭頭、點位、貨架圖、複製/刪除/復原） | PASS (`7→8→7→8`) | PASS (`7→8→7→8`) | ✅ |
| Role 3 — 14 天固定雲端暫存（無選單、真實存取與刪除清理）+ 2x PNG 匯出 + 乾淨重置 | PASS | PASS | ✅ |
| Desktop 視口 (`1440×900`) 無水平溢位 | PASS (`1440/1440`) | PASS (`1440/1440`) | ✅ |
| Mobile 視口 (`390×844`) 抽屜開關與畫布適配 | PASS (`390/390`) | PASS (`390/390`) | ✅ |
| Console Errors | **0** | **0** | ✅ |
| Page Errors (Uncaught Exceptions) | **0** | **0** | ✅ |
| HTTP 4xx / 5xx Errors | **0** | **0** | ✅ |

---

## 詳細測試證據

### 1. 內建範本清理與 3D 冷藏庫範本淨化驗證

| # | 範本 ID | 下拉選單名稱 | Local / Live 實測尺寸 | 淨化檢查 |
|---|---|---|---|---|
| 1 | `blank` | 1. 空白畫布 (1200×800) | `1200 × 800` / `1200 × 800` | 預設初始空白畫布 |
| 2 | `coldroom_2d` | 2. 冷藏庫平面範本 (2D) | `1200 × 800` / `1200 × 800` | 2D 冷藏庫平面正常載入 |
| 3 | `coldroom_3d` | 3. 冷藏庫等角立體空間範本 (3D) | `1200 × 800` / `1200 × 800` | 含純淨綠地板 `#dcfce7` 與雙隔熱牆 `#e2e8f0`/`#f1f5f9`；藍色物件命中 **`0`** (`#bae6fd`, `#7dd3fc`, `#38bdf8`, `#0284c7`, `#dbeafe` 全數移除) |

- 全頁 DOM 與下拉選單掃描已移除之 4 種範本字樣（`工廠平面圖`、`全廠區平面範本`、`實驗室平面範本`、`製造區平面範本`、`倉儲區平面範本`、`診所`）命中次數：**0**。

### 2. Role 1 — 3D 空間建置者（3D 綠色空間箱 + 獨立 3D 門物件 + JSON 序列化還原）

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` 實測結果 |
|---|---|---|
| 拖曳放置 **3D 綠色空間箱**並檢查內含子物件 | 僅含綠色地板、格線與牆面（`roomHasBlueOrRed=false`），屬性面板識別為 `3D 綠色空間箱` | 僅含綠色地板、格線與牆面（`roomHasBlueOrRed=false`），屬性面板識別為 `3D 綠色空間箱` |
| 空間箱 4 向 3D 朝向輪切 (`0°→90°→180°→270°→0°`) | 依序驗證 `["1","2","3","0"]` | 依序驗證 `["1","2","3","0"]` |
| 空間箱旋轉 (`+90°`, `+15°`)、水平/垂直翻轉、左右/上下鏡像、W/L/H 尺寸調整與還原 | 角度 `105° → 0°`、`flipX/Y=true`、`mirrorX/Y=true`、尺寸 `W=340, L=420, H=210` 全通過 | 角度 `105° → 0°`、`flipX/Y=true`、`mirrorX/Y=true`、尺寸 `W=340, L=420, H=210` 全通過 |
| 放置 **獨立 3D 門物件**並輪切 5 種朝向 | 依序驗證 `front-right → back-left → back-right → flat → front-left` | 依序驗證 `front-right → back-left → back-right → flat → front-left` |
| 3D 門雙開/單開切換、旋轉 (`15°`)、水平/垂直翻轉、左右/上下鏡像、門寬高縮放 | 雙開↔單開切換正常、`mirrorX/Y=true`、門寬 `150` / 門高 `180` 全通過 | 雙開↔單開切換正常、`mirrorX/Y=true`、門寬 `150` / 門高 `180` 全通過 |
| 匯出專案 JSON → 清除畫布 → 匯入還原 | 匯出 `39,457 bytes` 有效 JSON（保留 `room3dMeta`/`door3dMeta`），清除 `0` 後完整還原 `2` 物件 | 匯出 `39,456 bytes` 有效 JSON（保留 `room3dMeta`/`door3dMeta`），清除 `0` 後完整還原 `2` 物件 |

### 3. Role 2 — 動線與配置設計師（v2 全功能回歸檢查）

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` 實測結果 |
|---|---|---|
| 自訂動線圖例（取消勾選 `W`、修改 `P→P1`、新增項目、插入） | 正常插入 | 正常插入 |
| 3D L 型自訂形狀方塊放置 + 屬性面板切換 `3D ↔ 2D` | 正常切換重繪 | 正常切換重繪 |
| 動線箭頭 + T 點位 + 多層貨架圖 + 複製 / 刪除 / 復原 (`Undo`) | 物件數 `7 → 8 → 7 → 8` 全數正確 | 物件數 `7 → 8 → 7 → 8` 全數正確 |

### 4. Role 3 — 雲端暫存 14 天自動刪除 + 2x PNG 匯出 + 響應式視口 + 乾淨重置

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` 實測結果 |
|---|---|---|
| 檢查雲端暫存視窗無使用者天數下拉選單，且顯示固定 14 天提示 | `<select>` 數量 **`0`**，顯示 14 天自動刪除提示 | `<select>` 數量 **`0`**，顯示 14 天自動刪除提示 |
| 建立測試暫存專案並刪除清理 | 儲存、顯示、刪除確認皆通過，殘留 **`0`** | 寫入真實 GAS `PropertiesService`、顯示、刪除確認皆通過，殘留 **`0`** |
| 匯出 2x 高解析 PNG | 有效 PNG（`89504e470d0a1a0a`，**`454,472 bytes`**） | 有效 PNG（`89504e470d0a1a0a`，**`462,405 bytes`**） |
| Desktop (`1440×900`) & Mobile (`390×844`) 視口與抽屜檢查 | `1440/1440`、`390/390`、行動工具抽屜開合正常 | `1440/1440`、`390/390`、行動工具抽屜開合正常 |
| 執行「重置全部」清理狀態 | `物件：0` 乾淨狀態 | `物件：0` 乾淨狀態 |

---

## GitHub Actions 自動部署紀錄

- **Workflow**：`.github/workflows/deploy.yml`
- **Run ID**：`45539195093`（[查看執行紀錄](https://github.com/arnohsu-0930/warehouse-flow-layout-gas/actions/runs/45539195093)）
- **Commit SHA**：`b52f9aea22b9a5d35a374fb1bc670b489f8657e7`
- **結果**：`completed` / `success`（耗時 30s，`Pushed 3 files`，更新固定部署至 `@6`）
