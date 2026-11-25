# STATUS — Floor Plan Flow & Layout Studio (GAS)

> 最後更新：2026-11-25（Asia/Taipei）

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

## 目前狀態：已完成交付（Verified & Live）

- [x] 合併 `src_legacy/flow_tool.html` 與 `src_legacy/layout_tool.html` 為單頁通用型 GAS Web App（`index.html` + `Code.gs` + `appsscript.json`），零特定公司品牌、零 GMP/GxP 冗餘。
- [x] 支援可替換底圖（PNG/JPG/SVG 上傳、空白畫布、6 種內建通用/辦公/實驗室/倉儲 2D/3D 範本）。
- [x] 支援多分頁 / 多區域工作區（新增、雙擊重命名、切換、複製、刪除）。
- [x] 整合互動式畫布工具：
  - 6 向正向文字動線箭頭（P/M/W 預設 + 自訂文字與顏色，旋轉時標籤維持水平正向）。
  - 無框白色方形 / 圓形遮罩、永遠置頂可編輯區域標籤、多色圖例卡片。
  - T/M/B 自動遞增可編輯編號點位、SA/RA 與 SA-D/RA-U 空調圖示、SA/RA 方向箭頭、自訂數值尺寸標註線、可縮放 2D/3D 棧板/設備方塊與立柱。
  - 客製化 2D/3D 多層貨架/層架圖產生器（自訂名稱、2–8 層、M 層設定、各層 cm 高度、畫布拖曳縮放與顯示/隱藏切換）。
- [x] 完整操作體驗：點擊/拖曳放置、`Ctrl+C`/`Ctrl+V`、`Ctrl+Drag` 複製、`Delete`/`Backspace`、`Undo`/`Redo`、圖層控制、可關閉操作指南、`.json` 匯出/匯入、`localStorage` 自動儲存、`Code.gs` Gzip 分片雲端專案存取（`PropertiesService`）、2x 高解析 PNG 匯出。
- [x] 本機與 Live GAS `/exec` URL 雙環境 Playwright 三角色實測全數通過（詳見 `VERIFICATION_REPORT.md`）。

## 檔案結構

- `index.html` — 單頁整合互動工作室前端（Fabric.js 5.3.1 + 自包含響應式 CSS）
- `Code.gs` — GAS Web App 入口（`doGet` ALLOWALL）與 Gzip 分片 `PropertiesService` 雲端儲存 API
- `appsscript.json` — GAS 專案設定（`Asia/Taipei`, `V8`, `USER_DEPLOYING`, `ANYONE_ANONYMOUS`）
- `.clasp.json` / `.claspignore` — `clasp` 專案對應與推送白名單（僅推送 `appsscript.json`, `Code.gs`, `index.html`）
- `.github/workflows/deploy.yml` — GitHub Actions 自動部署工作流
- `VERIFICATION_REPORT.md` — 本機與 Live GAS 多角色 Playwright 零錯誤驗證報告
- `src_legacy/` — 原始參考檔（保留未改動）
