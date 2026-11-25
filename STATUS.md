# STATUS — Floor Plan Flow & Layout Studio (GAS)

> 最後更新：2026-11-25（Asia/Taipei）｜版本：**v6**

## 專案與部署資訊

| 項目 | 資訊 |
|---|---|
| **專案名稱** | 平面動線與空間配置工作室（Floor Plan Flow & Layout Studio） |
| **GitHub Repo URL** | https://github.com/arnohsu-0930/warehouse-flow-layout-gas |
| **GAS Script ID** | `1ivRzQrBFR8YEsh9vGohRGrvcPu7iuRwp6DjhcWwSKjhjbusWSkUnymm5` |
| **GAS Fixed Deployment ID** | `AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_` |
| **Live GAS 部署版本** | `@8`（GitHub Actions Run [#45561476195](https://github.com/arnohsu-0930/warehouse-flow-layout-gas/actions/runs/45561476195)，commit `44afbe5`） |
| **Live Web App `/exec` URL** | https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec |
| **執行與存取權限** | `executeAs: USER_DEPLOYING`, `access: ANYONE_ANONYMOUS` |
| **CI/CD 自動部署** | `.github/workflows/deploy.yml`（推送至 `main` 自動 `clasp push --force` 並更新固定 Deployment ID；已設定 `CLASPRC_JSON` GitHub Secret） |

## 目前狀態：v6 已完成交付（Verified & Live）

### v6 新增與更新項目
- [x] **2D & 3D 方塊無變形獨立縮放與清晰正向文字（v6）**：
  - 拖曳上下左右中點控點（`ml`/`mr`/`mt`/`mb`）或四角縮放時，自動將縮放比例烘焙回真實參數幾何（寬度 `W`、深度/高度 `L`、立體厚度 `H` 或自訂頂點 `customVerts`）並以 `scaleX = 1, scaleY = 1` 重新繪製，徹底消除 3D 等角方塊與 2D 圓角/框線像素拉扯變形。
  - 自訂形狀方塊之置中標籤文字（`isBlockLabel`）於非等比縮放、任意角度旋轉及水平/垂直翻轉（`flipX`/`flipY`）時皆保持 `1×1` 清晰比例、零擠壓、零鏡像倒置且永遠水平正向。
- [x] **全系列 2D/3D 方塊多邊形頂點與邊線自由拉伸（v6）**：
  - 涵蓋所有 5 類方塊：**自訂形狀方塊（矩形、圓角矩形、圓形/橢圓 8 點平滑曲線、L 型區塊 6 點立體稜柱）、2D/3D 棧板/設備、2D/3D 立柱、3D 綠色空間箱（4 角地板與自動垂直擠出牆面/透視格線）與 3D 獨立門物件（4 角雙線性變形門板、視窗、門把與立體門框厚度）**。
  - 選取任一方塊後點選右側屬性面板「**✏️ 頂點自由拉伸**」即可進入自由頂點編輯模式：拖曳**橘色角落控點**自由拉出任意角度、梯形、斜牆或不規則區塊（其餘未拖曳頂點零位移 `0.00px`），拖曳**藍色邊線中點控點**可整段平移延伸邊線；支援一鍵「**↺ 重設頂點**」與「**✓ 完成頂點編輯（`Esc` 或點擊空白處）**」，且暫時性控點絕不寫入 Undo、JSON 或 PNG。
- [x] **屬性面板獨立尺寸、任意旋轉與 3D 斜角/透視角度控制（v6）**：
  - 新增滑桿＋數值框同步控制：**寬度 `W`（變寬/變窄）**、**深度/高度 `L`（變高/變短）**、**立體厚度 `H`（含門框厚度與空間箱牆高）**、**任意旋轉角度 `0°–360°`（搭配 `↺90°`/`-15°`/`+15°`/`↻90°` 快捷旋轉）**。
  - 新增 **3D 斜角與透視角度調整**：**視角俯角（`10°–60°`）**、**斜角偏斜（`-45°–+45°`）** 與 5 組一鍵預設（`標準 30°`、`平緩 18°`、`俯視 45°`、`左斜`、`右斜`），支援對已自由拉伸之自訂多邊形平滑套用斜角基底變換。
  - 完整支援 **Undo/Redo**、**JSON 存取還原（完整保存 `customVerts`、`isoAngle`、`isoSkew`、`extrudeHeight`、`v6CenterOffset`）**、**2x 高解析 PNG 匯出** 與既有 v2–v5 全功能回歸。
- [x] **雙環境 Playwright 多角色零錯誤驗證**：
  - 本機與 Live GAS `/exec` URL（`@8`）雙環境 Playwright 多角色 v6 實測全數通過、零 Console / Page / HTTP 錯誤（詳見 `VERIFICATION_REPORT.md`）。

## 歷史版本摘要
- **v4+v5**（`@7`, commit `54acc11`）：可修改置頂文字方塊、淨化 2D 冷藏庫範本、2–8 層動態點位按鈕與點位圖例/點位/貨架顏色同步。
- **v3**（`@6`, commit `b52f9ae`）：新增純淨 3D 綠色空間箱與獨立 3D 保溫門、淨化 3D 冷藏庫範本、移除 4 種舊平面範本。
- **v2**（commit `9097f4d`）：自訂動線圖例、2D/3D 自訂形狀方塊、固定 14 天雲端自動清除暫存。
- **v1**（commit `6f4d497`）：整合 Floor Plan Flow & Layout Studio GAS Web App 與 GitHub Actions CI/CD 自動部署。

## 檔案結構

- `index.html` — 單頁整合互動工作室前端 v6（Fabric.js 5.3.1 + 無變形 2D/3D 獨立縮放 + 置中正向文字 + 全系列多邊形頂點/邊線自由拉伸 + 獨立 W/L/H、任意旋轉與 3D 斜角/透視調整 + 既有 v1–v5 全功能）
- `Code.gs` — GAS Web App 入口（`doGet` ALLOWALL）與 Gzip 分片 14 天自動清理 `PropertiesService` 雲端暫存 API
- `appsscript.json` — GAS 專案設定（`Asia/Taipei`, `V8`, `USER_DEPLOYING`, `ANYONE_ANONYMOUS`）
- `.clasp.json` / `.claspignore` — `clasp` 專案對應與推送白名單
- `.github/workflows/deploy.yml` — GitHub Actions 自動部署工作流
- `TASK_SPEC.md` / `TASK_SPEC_V2.md` / `TASK_SPEC_V3.md` / `TASK_SPEC_V4.md` / `TASK_SPEC_V4_V5.md` / `TASK_SPEC_V6.md` — 各版本任務規格書
- `VERIFICATION_REPORT.md` — 本機與 Live GAS v6 多角色 Playwright 零錯誤驗證報告
- `src_legacy/` — 原始參考檔（保留未改動）
