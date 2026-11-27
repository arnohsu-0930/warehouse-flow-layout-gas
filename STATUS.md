# STATUS — Floor Plan Flow & Layout Studio (GAS)

> 最後更新：2026-11-27（Asia/Taipei）｜版本：**v8**

## 專案與部署資訊

| 項目 | 資訊 |
|---|---|
| **專案名稱** | 平面動線與空間配置工作室（Floor Plan Flow & Layout Studio） |
| **GitHub Repo URL** | https://github.com/arnohsu-0930/warehouse-flow-layout-gas |
| **GAS Script ID** | `1ivRzQrBFR8YEsh9vGohRGrvcPu7iuRwp6DjhcWwSKjhjbusWSkUnymm5` |
| **GAS Fixed Deployment ID** | `AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_` |
| **Live GAS 部署版本** | `@10`（GitHub Actions Run [#45920447168](https://github.com/arnohsu-0930/warehouse-flow-layout-gas/actions/runs/45920447168)，commit `44d775d`） |
| **Live Web App `/exec` URL** | https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec |
| **執行與存取權限** | `executeAs: USER_DEPLOYING`, `access: ANYONE_ANONYMOUS` |
| **CI/CD 自動部署** | `.github/workflows/deploy.yml`（推送至 `main` 自動 `clasp push --force` 並更新固定 Deployment ID；已設定 `CLASPRC_JSON` GitHub Secret） |

## 目前狀態：v8 已完成交付（Verified & Live）

### v8 新增與更新項目
- [x] **進入網站啟動歡迎提示彈窗（`#welcome-modal`，v8）**：
  - 使用者每次進入網站時自動跳出清晰繁體中文歡迎提示視窗，提醒先點擊右上角「**❓ 說明**」查看操作指南與存檔／重置注意事項。
  - 提供兩顆明確按鈕：**「📖 立即查看說明」**（關閉彈窗並立即展開右側操作說明抽屜，自動捲動至最頂部）與 **「我知道了，開始使用」**（關閉彈窗進入正常操作），亦支援點擊遮罩背景或按 `Esc` 關閉。
  - 內建選填核取方塊 **「本次瀏覽器工作階段不再提醒」**（使用 `sessionStorage` 鍵 `FPLS_WELCOME_DISMISSED_SESSION_V8`，預設**不勾選**，未勾選時重新整理或新分頁進入皆會乾淨顯示；勾選後於同一工作階段內重整不重複打擾）。
- [x] **右上角「❓ 說明」內容強化（`#help-drawer`，v8）**：
  - **💾 「儲存專案」與「📂 開啟專案」用途說明（必讀）**：清楚對比「⬇️ 匯出 PNG」（平面圖片，適合貼入 Word／簡報，無法再重新編輯）；說明「💾 儲存專案」下載可編輯 `.json` 專案檔至本機供永久備份與分享、「📂 開啟專案」可 100% 完整還原分頁、圖層、物件、旋轉角度、尺寸與設定接續編輯；並提醒「☁️ 雲端暫存」僅保留 14 天自動清除，重要專案請使用「💾 儲存專案」。
  - **🔄 「重置全部」功能與網站更新套用說明**：清楚說明「🔄 重置全部」會清除瀏覽器本機快取的分頁、物件與設定恢復出廠預設；同時明確告知每當網站有新功能或新版範本更新時，點擊「🔄 重置全部」即可完整套用最新預設值與更新後範本，並提醒重置前先使用「💾 儲存專案」備份。同步更新頂部工具列按鈕圖示為「🔄 重置全部」及重置確認彈窗提示文案。
- [x] **雙環境 Playwright 多角色零錯誤驗證**：
  - 本機與 Live GAS `/exec` URL（`@10`）雙環境 Playwright 多角色 v8 實測全數通過、Desktop `1440×900` 與 Mobile `390×844` 零水平溢位、零 Console / Page / HTTP 錯誤（詳見 `VERIFICATION_REPORT.md`）。

## 歷史版本摘要
- **v7**（`@9`, commit `ea4c718`）：全畫布 22 類物件 100% 通用右側屬性微調面板（X/Y/W/H/0°–360° 角度/翻轉/3D 立體厚度與斜角偏斜）、無變形縮放與正向清晰文字引擎，以及 32 項製劑廠專用設備器具 2D/3D 向量圖塊庫（QC 12 + 製造 10 + 倉庫 10）。
- **v6**（`@8`, commit `44afbe5`）：2D/3D 方塊無變形獨立縮放、正向清晰文字、多邊形頂點/邊線自由拉伸與 3D 等角斜角/透視調整。
- **v4+v5**（`@7`, commit `54acc11`）：可修改置頂文字方塊、淨化 2D 冷藏庫範本、2–8 層動態點位按鈕與點位圖例/點位/貨架顏色同步。
- **v3**（`@6`, commit `b52f9ae`）：新增純淨 3D 綠色空間箱與獨立 3D 保溫門、淨化 3D 冷藏庫範本、移除 4 種舊平面範本。
- **v2**（commit `9097f4d`）：自訂動線圖例、2D/3D 自訂形狀方塊、固定 14 天雲端自動清除暫存。
- **v1**（commit `6f4d497`）：整合 Floor Plan Flow & Layout Studio GAS Web App 與 GitHub Actions CI/CD 自動部署。

## 檔案結構

- `index.html` — 單頁整合互動工作室前端 v8（Fabric.js 5.3.1 + 啟動歡迎提示彈窗與強化說明抽屜 + 右側全物件 100% 通用 X/Y/W/H/角度/翻轉/3D 立體微調面板 + 32 種製劑廠專用設備器具 2D/3D 向量圖塊庫 + 既有 v1–v7 全功能）
- `Code.gs` — GAS Web App 入口（`doGet` ALLOWALL）與 Gzip 分片 14 天自動清理 `PropertiesService` 雲端暫存 API
- `appsscript.json` — GAS 專案設定（`Asia/Taipei`, `V8`, `USER_DEPLOYING`, `ANYONE_ANONYMOUS`）
- `.clasp.json` / `.claspignore` — `clasp` 專案對應與推送白名單
- `.github/workflows/deploy.yml` — GitHub Actions 自動部署工作流
- `TASK_SPEC.md` / `TASK_SPEC_V2.md` / `TASK_SPEC_V3.md` / `TASK_SPEC_V4.md` / `TASK_SPEC_V4_V5.md` / `TASK_SPEC_V6.md` / `TASK_SPEC_V7.md` — 各版本任務規格書
- `VERIFICATION_REPORT.md` — 本機與 Live GAS v8 多角色 Playwright 零錯誤驗證報告
- `src_legacy/` — 原始參考檔（保留未改動）
