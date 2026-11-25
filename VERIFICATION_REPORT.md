# Verification Report — Floor Plan Flow & Layout Studio (GAS)

> 測試執行時間：2026-11-25 08:53–08:56 (Asia/Taipei)  
> 測試工具：Playwright Headless Chromium (`chromium-1234`, `playwright-core`)  
> 驗證對象：
> 1. **Local Build**：`http://127.0.0.1:49719/index.html`
> 2. **Live GAS `/exec` URL**：`https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec`（自動穿透 GAS `#sandboxFrame` → `#userHtmlFrame` 進行真實操作）

---

## 總體結果摘要

| 驗證項目 | Local Build | Live GAS `/exec` | 結果 |
|---|---:|---:|---|
| Role 1 — 通用空間 / 辦公規劃者 | PASS | PASS | ✅ |
| Role 2 — 工程師 / 技術人員 | PASS | PASS | ✅ |
| Role 3 — 一般公開使用者（輸出與重置） | PASS | PASS | ✅ |
| Desktop 視口 (`1440×900`) 無水平溢位 | PASS (`1440/1440`) | PASS (`1440/1440`) | ✅ |
| Mobile 視口 (`390×844`) 抽屜與畫布適配 | PASS (`390/390`) | PASS (`390/390`) | ✅ |
| Console Errors | **0** | **0** | ✅ |
| Page Errors (Uncaught Exceptions) | **0** | **0** | ✅ |
| HTTP 4xx / 5xx Errors | **0** | **0** | ✅ |

---

## 詳細測試證據

### Role 1 — General Facility / Office Planner（空間規劃者）

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` 實測結果 |
|---|---|---|
| 上傳自訂平面圖（SVG `1000×700`） | 成功套用底圖，狀態列更新為 `畫布：1000 × 700` | 成功套用底圖，狀態列更新為 `畫布：1000 × 700` |
| 新增區域分頁 | 分頁數 `1 → 2` | 分頁數 `1 → 2` |
| 繪製多方向 P / M / W 動線箭頭（`right`, `up`, `double-h`） | 成功放置 3 組文字正向箭頭（`objects=3`） | 成功放置 3 組文字正向箭頭（`objects=3`） |
| 放置白色無框方形/圓形遮罩 + 可編輯標籤 + 多色圖例 | 成功建立並置頂標籤與圖例（`objects=7`） | 成功建立並置頂標籤與圖例（`objects=7`） |
| 匯出 `.json` 設定檔 | 下載有效 JSON（`25,655 bytes`，含 2 個分頁） | 下載有效 JSON（`25,662 bytes`，含 2 個分頁） |
| 重整頁面 → 清除重置 → 匯入 `.json` 驗證完整還原 | 完整還原 `2` 個分頁與 `7` 個物件 | 完整還原 `2` 個分頁與 `7` 個物件 |

### Role 2 — Engineer / Technician（工程師 / 技術人員）

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` 實測結果 |
|---|---|---|
| 放置 T / M / B 編號點位（1, 2, 3） | 成功放置，下一個自動編號遞增至 `4` | 成功放置，下一個自動編號遞增至 `4` |
| 放置 SA、RA、SA-D、RA-U 與 SA/RA 方向箭頭 | 6 種空調/氣流物件全部正常繪製 | 6 種空調/氣流物件全部正常繪製 |
| 建立自訂文字尺寸標註線（`"4.25 m"`） | 拖曳並於內建對話框輸入 `"4.25 m"` 成功建立 | 拖曳並於內建對話框輸入 `"4.25 m"` 成功建立 |
| 設定 4 層多層貨架圖（高度 `260/180/100/20 cm`）並插入 | 成功插入可拖曳貨架圖（`objects=11`） | 成功插入可拖曳貨架圖（`objects=11`） |
| `Ctrl+C` / `Ctrl+V` 複製貼上 | 物件數 `11 → 12` | 物件數 `11 → 12` |
| `Ctrl+Drag` 拖曳原位複製 | 物件數 `12 → 13` | 物件數 `12 → 13` |
| `Delete` 刪除選取物件 | 物件數 `13 → 12` | 物件數 `13 → 12` |
| `Ctrl+Z` 復原（Undo） | 物件數 `12 → 13`（成功還原被刪物件） | 物件數 `12 → 13`（成功還原被刪物件） |

### Role 3 — Public User / Reset & Export（公開使用者輸出與重置）

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` 實測結果 |
|---|---|---|
| 匯出 2x 高解析 PNG 並驗證檔頭與大小（> 10KB） | 有效 PNG（Header `89504e470d0a1a0a`，**`255,057 bytes`** ≈ 249 KB） | 有效 PNG（Header `89504e470d0a1a0a`，**`255,490 bytes`** ≈ 249 KB） |
| 執行「重置全部」並重新整理頁面 | 零殘留測試資料（`tabs=1`, `objects=0`） | 零殘留測試資料（`tabs=1`, `objects=0`） |

### Viewport & Zero-Error Verification

- **Desktop (`1440×900`)**：`innerWidth: 1440`, `scrollWidth: 1440`，畫布完整置中顯示，無橫向捲軸溢位。
- **Mobile (`390×844`)**：`innerWidth: 390`, `scrollWidth: 390`，行動版工具抽屜按鈕（`☰ 工具`）可見、展開與點擊遮罩收合皆正常，操作指南抽屜開關正常。
- **Zero-Error Gate**：本機與 Live GAS 兩輪測試皆為 **0 Console Errors**、**0 Page Errors**、**0 HTTP 4xx/5xx**。
