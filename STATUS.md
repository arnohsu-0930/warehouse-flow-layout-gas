# STATUS — Floor Plan Flow & Layout Studio (GAS)

> 最後更新：2026-11-25（Asia/Taipei）｜版本：**v3**

## 專案與部署資訊

| 項目 | 資訊 |
|---|---|
| **專案名稱** | 平面動線與空間配置工作室（Floor Plan Flow & Layout Studio） |
| **GitHub Repo URL** | https://github.com/arnohsu-0930/warehouse-flow-layout-gas |
| **GAS Script ID** | `1ivRzQrBFR8YEsh9vGohRGrvcPu7iuRwp6DjhcWwSKjhjbusWSkUnymm5` |
| **GAS Fixed Deployment ID** | `AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_` |
| **Live GAS 部署版本** | `@6`（GitHub Actions Run [#45539195093](https://github.com/arnohsu-0930/warehouse-flow-layout-gas/actions/runs/45539195093)，commit `b52f9ae`） |
| **Live Web App `/exec` URL** | https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec |
| **執行與存取權限** | `executeAs: USER_DEPLOYING`, `access: ANYONE_ANONYMOUS` |
| **CI/CD 自動部署** | `.github/workflows/deploy.yml`（推送至 `main` 自動 `clasp push --force` 並更新固定 Deployment ID；已設定 `CLASPRC_JSON` GitHub Secret） |

## 目前狀態：v3 已完成交付（Verified & Live）

### v3 新增與更新項目
- [x] **純淨 3D 綠色立體空間箱（`roomBox3d`）**：
  - 僅包含綠色等角地板（可開關格線）與兩側隔熱牆面，**完全不含**內建藍色冷風機/層架或紅色/內建門。
  - 支援點擊或拖曳調整大小放置；選取後於屬性面板支援 **4 向 3D 立體朝向**（NE 0° / SE 90° / SW 180° / NW 270°）、**自由角度與快捷旋轉**（`↺90°` / `-15°` / `+15°` / `↻90°` / 畫布旋轉控點）、**水平翻轉 (`flipX`) / 垂直翻轉 (`flipY`)**、**左右/上下幾何鏡像變換 (`mirrorX`/`mirrorY`)**、**寬 W / 深 L / 高 H 尺寸縮放與畫布自由拉縮**、地板與牆面自訂配色及一鍵還原變換。
- [x] **獨立 3D 門物件（`door3d`）**：
  - 依據原紅框保溫雙開門設計，支援 **雙開保溫門（含雙視窗與門把）** 與 **單開保溫門** 切換，具立體門框厚度與地面門檻朝向提示。
  - 支援 **5 種朝向**（前左牆面 / 前右牆面 / 後左牆面 / 後右牆面 / 正面立視）、**自由與快捷旋轉**、**水平/垂直翻轉 (`flipX`/`flipY`)**、**左右/上下鏡像變換 (`mirrorX`/`mirrorY`)** 與 **寬/高縮放調整**，可自由貼合於 3D 空間箱或 3D 範本各面牆體。
- [x] **冷藏庫等角立體空間範本 (3D) 淨化**：
  - 移除範本內藍色冷風機物件與固定門，僅保留純淨 3D 綠色地板格線、雙側隔熱牆與頂部虛線參考邊，方便使用者自由搭配獨立 3D 門與各類配置物件。
- [x] **完全移除 4 種舊平面範本**：
  - 已從下拉選單、`getTemplateAsset()`、`normalizeTemplateId()` 與說明抽屜中完全刪除：
    1. ~~工廠/全廠區平面範本 (全部)~~ (`facility_full`)
    2. ~~實驗室平面範本 (黃底/黃區)~~ (`lab_yellow`)
    3. ~~製造區平面範本 (紅框內/紅框區)~~ (`mfg_red`)
    4. ~~倉儲區平面範本 (藍框內/藍框區)~~ (`wh_blue`)
  - 目前保留 **3 種純淨內建範本**：`1. 空白畫布 (1200×800)`、`2. 冷藏庫平面範本 (2D)`、`3. 冷藏庫等角立體空間範本 (3D)`；預設初始分頁為 `blank`。
- [x] **全功能回歸與雙環境驗證**：
  - 完整保留既有 v2 功能（固定 14 天自動清除雲端暫存、自訂動線圖例設定器、2D/3D 自訂形狀方塊、6 向文字正向動線箭頭、無框白色遮罩、置頂區域標籤、T/M/B 自動編號點位、SA/RA 空調、尺寸標註線、2D/3D 棧板/立柱、2–8 層客製化貨架圖產生器、JSON 專案存取、2x 高解析 PNG 匯出）。
  - 本機與 Live GAS `/exec` URL（`@6`）雙環境 Playwright 多角色 v3 實測全數通過、零 Console / Page / HTTP 錯誤（詳見 `VERIFICATION_REPORT.md`）。

## 檔案結構

- `index.html` — 單頁整合互動工作室前端 v3（Fabric.js 5.3.1 + 3D 綠色空間箱 & 獨立 3D 門物件 + 3 種純淨內建範本）
- `Code.gs` — GAS Web App 入口（`doGet` ALLOWALL）與 Gzip 分片 14 天自動清理 `PropertiesService` 雲端暫存 API
- `appsscript.json` — GAS 專案設定（`Asia/Taipei`, `V8`, `USER_DEPLOYING`, `ANYONE_ANONYMOUS`）
- `.clasp.json` / `.claspignore` — `clasp` 專案對應與推送白名單
- `.github/workflows/deploy.yml` — GitHub Actions 自動部署工作流
- `TASK_SPEC.md` / `TASK_SPEC_V2.md` / `TASK_SPEC_V3.md` — 任務規格書
- `VERIFICATION_REPORT.md` — 本機與 Live GAS v3 多角色 Playwright 零錯誤驗證報告
- `src_legacy/` — 原始參考檔（保留未改動）
