# STATUS — Floor Plan Flow & Layout Studio (GAS)

> 最後更新：2026-11-26（Asia/Taipei）｜版本：**v7**

## 專案與部署資訊

| 項目 | 資訊 |
|---|---|
| **專案名稱** | 平面動線與空間配置工作室（Floor Plan Flow & Layout Studio） |
| **GitHub Repo URL** | https://github.com/arnohsu-0930/warehouse-flow-layout-gas |
| **GAS Script ID** | `1ivRzQrBFR8YEsh9vGohRGrvcPu7iuRwp6DjhcWwSKjhjbusWSkUnymm5` |
| **GAS Fixed Deployment ID** | `AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_` |
| **Live GAS 部署版本** | `@9`（GitHub Actions Run [#45835532698](https://github.com/arnohsu-0930/warehouse-flow-layout-gas/actions/runs/45835532698)，commit `ea4c718`） |
| **Live Web App `/exec` URL** | https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec |
| **執行與存取權限** | `executeAs: USER_DEPLOYING`, `access: ANYONE_ANONYMOUS` |
| **CI/CD 自動部署** | `.github/workflows/deploy.yml`（推送至 `main` 自動 `clasp push --force` 並更新固定 Deployment ID；已設定 `CLASPRC_JSON` GitHub Secret） |

## 目前狀態：v7 已完成交付（Verified & Live）

### v7 新增與更新項目
- [x] **全物件 100% 通用角度與尺寸微調右側屬性面板（v7）**：
  - 將屬性微調面板升級為獨立**右側屬性面板（`#inspector-dock`）**，行動裝置支援獨立「⚙️ 屬性」右側滑出抽屜且維持零水平溢位。
  - 畫布上 **100% 所有 22 類可放置物件**（動線箭頭、自由箭頭、可修改文字方塊、區域文字標籤、白色方/圓遮罩、自訂動線圖例、點位/空調圖例、動態層數點位標記、HVAC SA/RA/SA-D/RA-U/SA 方向/RA 方向、尺寸標註線、多層貨架圖、自訂形狀方塊、2D/3D 棧板與立柱、3D 綠色空間箱、3D 獨立門物件，以及全新製劑廠專用設備器具圖塊）選取後，右側皆完整顯示：**X 座標、Y 座標、寬度 W、高度/深度 H、0°–360° 旋轉角度（數值框＋滑桿＋`-90°`/`-15°`/`+15°`/`+90°` 快捷鍵）、水平/垂直翻轉（`flipX`/`flipY`）**。
  - 所有 **3D 物件**（3D 自訂形狀方塊、3D 製劑廠設備、3D 棧板/立柱、3D 綠色空間箱、3D 獨立門物件、3D 多層貨架圖）皆額外提供 **立體厚度/高度（Extrusion Height/Thickness）** 與 **等角俯角/斜角偏斜（Isometric Angle/Skew + 5 組預設）**。
  - 全面升級**無變形重繪與正向清晰文字引擎（`normalizeAnyScaledObject` + `keepEmbeddedLabelsCrispAndUpright`）**：拖曳畫布中點控點或於右側修改 W/H、旋轉、翻轉時，所有內含文字物件皆自動烘焙為真實幾何參數並維持 `1×1` 清晰比例、零字型擠壓、零鏡像倒字，並完整寫入 JSON 匯出/匯入（`pharmaMeta`、`arrowMeta`、`vectorMeta`、`hvacMeta`、`dimMeta`、`textBoxMeta`、`rackConfig`、`shapeMeta`、`equipMeta`、`room3dMeta`、`door3dMeta`、`legendConfig`、`tierMeta`）。
- [x] **製劑廠專用設備器具圖塊庫（32 項專業向量圖塊 · 2D 平面 / 3D 等角切換，v7）**：
  - 於左側工具列新增可折疊、分頁式「**7. 製劑廠專用設備器具圖塊庫**」（側邊欄全部 7 大區塊皆可獨立折疊，維持精簡介面、零公司名稱硬編碼），支援 **2D 平面 / 3D 等角切換**、**自訂填滿/框線色**、**點擊/拖曳畫布放置或從按鈕直接拖曳至畫布**、**雙擊編輯置中標籤**與**多邊形頂點自由拉伸**。
  - **A. QC 實驗室設備器具（12 項）**：HPLC/UPLC 液相層析儀、GC 氣相層析儀、BSC 生物安全櫃、LAF 無菌操作台、恒溫恒濕安定性試驗箱、-80°C 超低溫冷凍櫃、2-8°C 藥品冷藏櫃、高溫滅菌釜 (Autoclave)、實驗中央操作台/水槽、分析天平/微量天平台、離心機/超音波震盪器、純水機系統。
  - **B. 製造/工廠部設備器具（10 項）**：無菌充填機 (Filling Line)、冷凍乾燥機 (Lyophilizer)、隔離操作器 (Isolator/RABS)、配製攪拌桶 (Compounding Tank)、過濾系統 (Filtration Skid)、異物檢測機/燈檢台 (Visual Inspection)、貼標包裝機 (Labeling & Packaging)、清洗滅菌機 (Washing/Sterilizer)、更衣室氣鎖門/跨凳 (Airlock/Crossover Bench)、製程純水/純蒸汽機組 (WFI/Clean Steam)。
  - **C. 倉庫常用設備器具（10 項）**：重型雙深/單深料架、標準棧板 (EUR/US Pallet)、電動堆高機 (Reach Truck/Forklift)、油壓拖板車 (Pallet Jack)、堆高機充電站 (Charger Station)、溫濕度監測感測器 (Temp/RH Sensor)、進出貨月台/油壓升降板 (Loading Dock/Ramp)、電子地磅/秤重台 (Floor Scale)、隔離圍籬/待驗區圍欄 (Quarantine Cage)、封膜機/打包機 (Stretch Wrapper)。
- [x] **雙環境 Playwright 多角色零錯誤驗證**：
  - 本機與 Live GAS `/exec` URL（`@9`）雙環境 Playwright 多角色 v7 實測全數通過、零 Console / Page / HTTP 錯誤（詳見 `VERIFICATION_REPORT.md`）。

## 歷史版本摘要
- **v6**（`@8`, commit `44afbe5`）：2D/3D 方塊無變形獨立縮放、正向清晰文字、多邊形頂點/邊線自由拉伸與 3D 等角斜角/透視調整。
- **v4+v5**（`@7`, commit `54acc11`）：可修改置頂文字方塊、淨化 2D 冷藏庫範本、2–8 層動態點位按鈕與點位圖例/點位/貨架顏色同步。
- **v3**（`@6`, commit `b52f9ae`）：新增純淨 3D 綠色空間箱與獨立 3D 保溫門、淨化 3D 冷藏庫範本、移除 4 種舊平面範本。
- **v2**（commit `9097f4d`）：自訂動線圖例、2D/3D 自訂形狀方塊、固定 14 天雲端自動清除暫存。
- **v1**（commit `6f4d497`）：整合 Floor Plan Flow & Layout Studio GAS Web App 與 GitHub Actions CI/CD 自動部署。

## 檔案結構

- `index.html` — 單頁整合互動工作室前端 v7（Fabric.js 5.3.1 + 右側全物件 100% 通用 X/Y/W/H/角度/翻轉/3D 立體微調面板 + 32 種製劑廠專用設備器具 2D/3D 向量圖塊庫 + 無變形縮放與正向清晰文字 + 既有 v1–v6 全功能）
- `Code.gs` — GAS Web App 入口（`doGet` ALLOWALL）與 Gzip 分片 14 天自動清理 `PropertiesService` 雲端暫存 API
- `appsscript.json` — GAS 專案設定（`Asia/Taipei`, `V8`, `USER_DEPLOYING`, `ANYONE_ANONYMOUS`）
- `.clasp.json` / `.claspignore` — `clasp` 專案對應與推送白名單
- `.github/workflows/deploy.yml` — GitHub Actions 自動部署工作流
- `TASK_SPEC.md` / `TASK_SPEC_V2.md` / `TASK_SPEC_V3.md` / `TASK_SPEC_V4.md` / `TASK_SPEC_V4_V5.md` / `TASK_SPEC_V6.md` / `TASK_SPEC_V7.md` — 各版本任務規格書
- `VERIFICATION_REPORT.md` — 本機與 Live GAS v7 多角色 Playwright 零錯誤驗證報告
- `src_legacy/` — 原始參考檔（保留未改動）
