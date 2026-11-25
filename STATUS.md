# STATUS — Floor Plan Flow & Layout Studio (GAS)

> 最後更新：2026-11-25（Asia/Taipei）｜版本：**v4+v5**

## 專案與部署資訊

| 項目 | 資訊 |
|---|---|
| **專案名稱** | 平面動線與空間配置工作室（Floor Plan Flow & Layout Studio） |
| **GitHub Repo URL** | https://github.com/arnohsu-0930/warehouse-flow-layout-gas |
| **GAS Script ID** | `1ivRzQrBFR8YEsh9vGohRGrvcPu7iuRwp6DjhcWwSKjhjbusWSkUnymm5` |
| **GAS Fixed Deployment ID** | `AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_` |
| **Live GAS 部署版本** | `@7`（GitHub Actions Run [#45554933502](https://github.com/arnohsu-0930/warehouse-flow-layout-gas/actions/runs/45554933502)，commit `54acc11`） |
| **Live Web App `/exec` URL** | https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec |
| **執行與存取權限** | `executeAs: USER_DEPLOYING`, `access: ANYONE_ANONYMOUS` |
| **CI/CD 自動部署** | `.github/workflows/deploy.yml`（推送至 `main` 自動 `clasp push --force` 並更新固定 Deployment ID；已設定 `CLASPRC_JSON` GitHub Secret） |

## 目前狀態：v4+v5 已完成交付（Verified & Live）

### v4+v5 新增與更新項目
- [x] **可修改的文字方塊工具（`textBox` / v4）**：
  - 於「2. 遮罩、文字方塊與自訂圖例」新增 **✏️ 文字方塊（雙擊可修改）**，支援 **點擊放置** 與 **拖曳拉框指定尺寸放置**，放置後立即進入編輯模式，並支援 **雙擊重新編輯多行文字** 與按 `Escape` 退出編輯。
  - 屬性面板支援 **字體大小、文字色、底色/透明切換、外框色與粗細（無/1/2/3px）、粗體、靠左/置中/靠右對齊** 與一鍵進入編輯；完整支援 **移動、縮放換行、複製/貼上、刪除、復原（Undo/Redo）與 JSON 存取還原**。
  - 永久置頂層級（`isAlwaysTop: true`），確保於放置白色遮罩或 2D/3D 形狀方塊後仍保持在形狀與遮罩圖層之上。
- [x] **範本 2（冷藏庫平面範本 2D / `coldroom_2d`）淨化（v4）**：
  - 移除紅框標示之兩組冷風機圖示與文字（`冷風機 EVAP-1`、`冷風機 EVAP-2`）以及中央走道文字（`中央作業通道`、`(W-04 冷藏庫 2D)`）。
  - 保留純淨冷藏庫綠色地板（`#dcfce7`）、隔熱牆體（`#0f172a`）、雙側貨架格位（`#166534`）與雙開保溫門框（`保溫雙開門`）。
- [x] **動態層數點位按鈕與點位圖例顏色同步（v5）**：
  - 當「6. 多層貨架」層數於 **2–8 層** 切換或變更 M（中層）指定位置時，「5. 點位」區塊自動動態產生對應各層點位按鈕（`T` / `L…` / `M` / `B`），按鈕配色與各層色塊完全一致。
  - 變更層數、M 層或任一層顏色時，**點位按鈕、畫布已放置之點位圖例卡片（項目與各行字色）、對應點位圓標及貨架層徽章** 皆即時同步更新，且修正選取貨架時更改層數不會被舊貨架設定覆寫的問題。
  - 工作區 JSON 序列化與還原完整保存 `tierConfig`（層數、M 層位置與自訂層配色），執行「重置全部」時亦乾淨恢復預設 4 層與預設配色。
- [x] **全功能回歸與雙環境驗證**：
  - 完整保留既有 v2/v3 功能（純淨 3D 綠色空間箱、獨立 3D 保溫門、3 種純淨內建範本、固定 14 天自動清除雲端暫存、自訂動線圖例設定器、2D/3D 自訂形狀方塊、6 向文字正向動線箭頭、無框白色遮罩、置頂區域標籤、SA/RA 空調、尺寸標註線、2D/3D 棧板/立柱、2–8 層客製化貨架圖、JSON 專案存取、2x 高解析 PNG 匯出）。
  - 本機與 Live GAS `/exec` URL（`@7`）雙環境 Playwright 多角色 v4+v5 實測全數通過、零 Console / Page / HTTP 錯誤（詳見 `VERIFICATION_REPORT.md`）。

## 歷史版本摘要
- **v3**（`@6`, commit `b52f9ae`）：新增純淨 3D 綠色空間箱與獨立 3D 保溫門、淨化 3D 冷藏庫範本、移除 4 種舊平面範本。
- **v2**（commit `9097f4d`）：自訂動線圖例、2D/3D 自訂形狀方塊、固定 14 天雲端自動清除暫存。
- **v1**（commit `6f4d497`）：整合 Floor Plan Flow & Layout Studio GAS Web App 與 GitHub Actions CI/CD 自動部署。

## 檔案結構

- `index.html` — 單頁整合互動工作室前端 v4+v5（Fabric.js 5.3.1 + 可修改文字方塊 + 純淨 2D/3D 冷藏庫範本 + 2–8 層動態點位按鈕與點位圖例顏色同步）
- `Code.gs` — GAS Web App 入口（`doGet` ALLOWALL）與 Gzip 分片 14 天自動清理 `PropertiesService` 雲端暫存 API
- `appsscript.json` — GAS 專案設定（`Asia/Taipei`, `V8`, `USER_DEPLOYING`, `ANYONE_ANONYMOUS`）
- `.clasp.json` / `.claspignore` — `clasp` 專案對應與推送白名單
- `.github/workflows/deploy.yml` — GitHub Actions 自動部署工作流
- `TASK_SPEC.md` / `TASK_SPEC_V2.md` / `TASK_SPEC_V3.md` / `TASK_SPEC_V4.md` / `TASK_SPEC_V4_V5.md` — 各版本任務規格書
- `VERIFICATION_REPORT.md` — 本機與 Live GAS v4+v5 多角色 Playwright 零錯誤驗證報告
- `src_legacy/` — 原始參考檔（保留未改動）
