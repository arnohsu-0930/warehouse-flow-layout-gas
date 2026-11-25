# STATUS — Floor Plan Flow & Layout Studio (GAS)

> 最後更新：2026-11-25（Asia/Taipei）｜版本：**v2**

## 專案與部署資訊

| 項目 | 資訊 |
|---|---|
| **專案名稱** | 平面動線與空間配置工作室（Floor Plan Flow & Layout Studio） |
| **GitHub Repo URL** | https://github.com/arnohsu-0930/warehouse-flow-layout-gas |
| **GAS Script ID** | `1ivRzQrBFR8YEsh9vGohRGrvcPu7iuRwp6DjhcWwSKjhjbusWSkUnymm5` |
| **GAS Fixed Deployment ID** | `AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_` |
| **Live Web App `/exec` URL** | https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec |
| **執行與存取權限** | `executeAs: USER_DEPLOYING`, `access: ANYONE_ANONYMOUS` |
| **CI/CD 自動部署** | `.github/workflows/deploy.yml`（推送至 `main` 自動 `clasp push --force` 並更新固定 Deployment ID；已設定 `CLASPRC_JSON` GitHub Secret） |

## 目前狀態：v2 已完成交付（Verified & Live）

### v2 新增與更新項目
- [x] **雲端暫存 14 天固定自動刪除 + 白話按鈕**：
  - 頂部操作按鈕全面中文化為 `💾 儲存專案`、`📂 開啟專案`、`☁️ 雲端暫存`。
  - `Code.gs` 與前端雲端暫存視窗固定保留 **14 天**到期自動清除（無使用者下拉選單），每次讀取/儲存/刪除自動清理過期分片與索引，另提供可排程之 `cleanupExpiredCloudPresets()`；介面顯示剩餘天數與到期日期。
  - 修正彈窗層級：`#generic-modal` 提升至 `z-index: 115`，確保刪除確認視窗正確疊於雲端暫存視窗上方。
- [x] **自訂動線圖例設定器**：
  - 放置前可編輯標題、勾選/取消勾選項目、修改代碼/名稱/顏色、新增或刪除自訂項目。
  - 放置於畫布後支援自由縮放與拖曳，**雙擊**或於屬性檢視器點選即可重新開啟設定器原地更新。
- [x] **自訂形狀與置中標註方塊（2D 平面 / 3D 等角）**：
  - 支援 **矩形、圓角矩形、圓形/橢圓、L 型區塊** 4 種形狀。
  - 支援填滿色、框線色、透明度設定、**2D 平面 vs 3D 等角** 視角切換（放置前切換與選取後即時互轉），以及**置中可雙擊編輯文字標籤**。
- [x] **7 種內建平面範本（已完全移除診所用字）**：
  1. `blank` — 空白畫布 (`1200×800`)
  2. `facility_full` — 全廠區平面範本 (完整版 `1400×900`，綠/橘/粉/藍/白/黃分色，含 `W-01`..`W-05`、`P-01`..`P-22`、`M-01`..`M-06`、`CH-01`)
  3. `lab_yellow` — 實驗室平面範本 (黃區，含 `M-01`..`M-06` 與排煙櫃/BSC/HPLC/滅菌釜等設備圖示)
  4. `mfg_red` — 製造區平面範本 (紅框區，含 `P-01`..`P-21` 粉/藍/白分區)
  5. `wh_blue` — 倉儲區平面範本 (藍框區，含 `W-01`..`W-05`、`P-18`..`P-22` 綠冷藏庫、橘棧板架與粉包裝銜接邊)
  6. `coldroom_2d` — 冷藏庫平面範本 (2D)
  7. `coldroom_3d` — 冷藏庫等角立體空間範本 (3D)
- [x] **全功能整合與驗證**：
  - 保留並相容既有 6 向文字正向動線箭頭、無框白色遮罩、置頂區域標籤、T/M/B 自動編號點位、SA/RA 空調圖示與氣流方向、自訂尺寸標註線、2D/3D 棧板/立柱、2–8 層客製化貨架圖產生器、多分頁管理、`Ctrl+C/V`/`Ctrl+Drag`/`Delete`/`Undo/Redo`、2x 高解析 PNG 匯出。
  - 本機與 Live GAS `/exec` URL 雙環境 Playwright 多角色 v2 實測全數通過、零錯誤（詳見 `VERIFICATION_REPORT.md`）。

## 檔案結構

- `index.html` — 單頁整合互動工作室前端 v2（Fabric.js 5.3.1 + 自包含響應式 CSS + 7 種內建 SVG 範本）
- `Code.gs` — GAS Web App 入口（`doGet` ALLOWALL）與 Gzip 分片 14 天自動清理 `PropertiesService` 雲端暫存 API
- `appsscript.json` — GAS 專案設定（`Asia/Taipei`, `V8`, `USER_DEPLOYING`, `ANYONE_ANONYMOUS`）
- `.clasp.json` / `.claspignore` — `clasp` 專案對應與推送白名單
- `.github/workflows/deploy.yml` — GitHub Actions 自動部署工作流
- `TASK_SPEC.md` / `TASK_SPEC_V2.md` — 任務規格書
- `VERIFICATION_REPORT.md` — 本機與 Live GAS v2 多角色 Playwright 零錯誤驗證報告
- `src_legacy/` — 原始參考檔（保留未改動）
