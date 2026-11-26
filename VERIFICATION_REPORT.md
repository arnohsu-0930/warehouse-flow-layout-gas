# Verification Report (v7) — Floor Plan Flow & Layout Studio (GAS)

> 測試執行時間：2026-11-26 22:04–22:08 (Asia/Taipei)  
> 測試工具：Playwright Headless Chromium (`playwright-core`)  
> 驗證對象：
> 1. **Local Build**：`http://127.0.0.1:<ephemeral-port>/index.html`
> 2. **Live GAS `/exec` URL**：`https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec`（固定部署版本 `@9`，GitHub Actions Run `#45835532698`，commit `ea4c718`，穿透 `#sandboxFrame` → `#userHtmlFrame` 實測）

---

## 總體結果摘要

| 驗證項目 | Local Build | Live GAS `/exec` (`@9`) | 結果 |
|---|---:|---:|---|
| Role 1 — 全畫布 22 類物件右側屬性面板通用 X / Y / W / H / 0°–360° 角度（`-90/-15/+15/+90`）/ 翻轉 / 3D 立體厚度與斜角偏斜 + 中點控點無變形拉伸（零字型擠壓） | PASS (`22/22`, `scale=1×1`, `txt=1×1`) | PASS (`22/22`, `scale=1×1`, `txt=1×1`) | ✅ |
| Role 2 — 製劑廠專用設備器具圖塊庫 3 分類共 32 項（QC 12 + 製造 10 + 倉庫 10）+ 2D/3D 切換 + 自訂填滿/框線色 + 拖曳放置 + 置中標籤編輯 + 正向旋轉/斜角偏斜 | PASS (`12/10/10 = 32`, `txt=1×1`) | PASS (`12/10/10 = 32`, `txt=1×1`) | ✅ |
| Role 3 — JSON 專案匯出/清除/匯入完整還原（含 `pharmaMeta`、`angle`、`isoSkew`、`viewMode` 與 `1×1` 正向文字）+ 2x 高解析 PNG 匯出 + 乾淨重置 | PASS (`153,656 B`, `8/8`, PNG `407,516 B`) | PASS (`153,656 B`, `8/8`, PNG `407,516 B`) | ✅ |
| Desktop (`1440×900`) 右側屬性面板並列與零水平溢位 & Mobile (`390×844`) 零水平溢位與左/右雙抽屜開合 | PASS (`1440/1440`, `390/390`) | PASS (`1440/1440`, `390/390`) | ✅ |
| Console Errors | **0** | **0** | ✅ |
| Page Errors (Uncaught Exceptions) | **0** | **0** | ✅ |
| HTTP 4xx / 5xx Errors | **0** | **0** | ✅ |

---

## 詳細測試證據

### 1. Role 1 — 全物件 100% 覆蓋通用座標/尺寸/角度/翻轉/3D 立體微調（22 類物件）

對畫布上所有 22 類可放置物件逐一驗證右側屬性面板（`#inspector-dock`）之 **X 座標、Y 座標、寬度 W、高度/深度 H、0°–360° 角度滑桿＋數值框＋`-90/-15/+15/+90` 快捷鍵、水平/垂直翻轉（`flipX`/`flipY`）**，所有 3D 物件並同步驗證 **立體厚度/高度** 與 **等角俯角/斜角偏斜**：

| 類別覆蓋清單（共 22 類，Local 與 Live GAS `@9` 皆全數通過） | 3D 厚度與斜角控制 | 文字比例檢查 |
|---|---|---|
| `flowArrow`（動線箭頭）、`freeArrow`（自由箭頭）、`saDir`（SA 方向）、`raDir`（RA 方向）、`dimension`（尺寸標註線） | N/A (2D) | 全部 `group 1.00×1.00`，字型零擠壓且正向 |
| `textBox`（文字方塊）、`label`（區域標籤）、`customFlowLegend`（自訂動線圖例）、`legend`（點位/空調圖例） | N/A (2D) | 全部 `1.00×1.00`，無字型拉扯變形 |
| `maskRect`（白色方遮罩）、`maskCircle`（白色圓遮罩）、`marker`（點位標記）、`hvac-sa` / `hvac-ra` / `hvac-sad` / `hvac-rau` | N/A (2D) | 全部 `1.00×1.00`，標籤清晰正向 |
| `rackDiagram(3D)`（多層貨架圖）、`shapeBlock(3D)`（自訂形狀方塊）、`equipment/pallet(3D)`、`equipment/pillar(3D)`、`roomBox3d`（3D 空間箱）、`door3d`（3D 門） | ✅ 完整支援並實測有效 | 全部 `1.00×1.00`，零擠壓 |
| **中點控點拖曳實測**（`flowArrow` 拖曳右側 `mr` 控點 `+65px`） | — | 長度擴張至 `215px`，`scaleX=1, scaleY=1`，內嵌標籤 `txtScale=1×1` |

### 2. Role 2 — 製劑廠專用設備器具圖塊庫（3 分類共 32 項）

| 測試項目 | Local Build 實測結果 | Live GAS `/exec` (`@9`) 實測結果 |
|---|---|---|
| 分類頁籤與設備數量 | A. QC 實驗室 `12` 項 / B. 製造/工廠部 `10` 項 / C. 倉庫設備 `10` 項（共 `32` 項） | A. QC 實驗室 `12` 項 / B. 製造/工廠部 `10` 項 / C. 倉庫設備 `10` 項（共 `32` 項） |
| 2D / 3D 切換按鈕防折疊驗證 | 點擊 `3D 等角` 後 `#pharma-library-section` 保持展開（`open=true`） | 點擊 `3D 等角` 後 `#pharma-library-section` 保持展開（`open=true`） |
| QC 實驗室 `HPLC/UPLC` 2D 放置 → 屬性面板轉 3D + 全套通用控制 | 成功轉換為 `3d`、驗證 X/Y/W/H/厚度/斜角/28°/雙翻轉，文字 `1×1` 正向 | 成功轉換為 `3d`、驗證 X/Y/W/H/厚度/斜角/28°/雙翻轉，文字 `1×1` 正向 |
| QC 實驗室 `BSC 生物安全櫃` 自訂配色 (`#fef08a` / `#b45309`) + 拖曳尺寸放置 | 成功套用自訂填滿/框線色並依拖曳寬度建置 3D 模型 | 成功套用自訂填滿/框線色並依拖曳寬度建置 3D 模型 |
| 製造部 `配製攪拌桶`（3D 圓柱）編輯標籤 `配製攪拌桶 T-01` + 旋轉 `33°` | 標籤更新成功，文字自動反向補償 `-33°` 維持水平正向、`scale=1×1` | 標籤更新成功，文字自動反向補償 `-33°` 維持水平正向、`scale=1×1` |
| 製造部 `隔離操作器 (3D)` + 倉庫 `隔離待驗圍欄 (3D, isoSkew=-20°)` + `電動堆高機 (2D)` | 全數正常渲染、斜角偏斜生效且文字清晰 | 全數正常渲染、斜角偏斜生效且文字清晰 |

### 3. Role 3 — JSON 存取還原、2x PNG 匯出與 Desktop / Mobile 視口驗證

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` (`@9`) 實測結果 |
|---|---|---|
| 匯出專案 JSON → 清除畫布 → 匯入還原 | `153,656 bytes`，`8/8` 物件（含 `6` 組製劑廠設備、`tankLabel="配製攪拌桶 T-01"`、`tankAngle=33°`、`tankTxtScale=1×1`、`quarIsoSkew=-20°`、`hplcMode=3d`、`hplcAngle=28°`）完整還原 | `153,656 bytes`，`8/8` 物件（含 `6` 組製劑廠設備、`tankLabel="配製攪拌桶 T-01"`、`tankAngle=33°`、`tankTxtScale=1×1`、`quarIsoSkew=-20°`、`hplcMode=3d`、`hplcAngle=28°`）完整還原 |
| 匯出 2x 高解析 PNG | 有效 PNG（`89504e470d0a1a0a`，**`407,516 bytes`**） | 有效 PNG（`89504e470d0a1a0a`，**`407,516 bytes`**） |
| Desktop (`1440×900`) 右側屬性面板並列與無水平溢位 | `scrollW=1440 / clientW=1440`，左工具列 `x=0`，右屬性面板 `x=1148, w=292` | `scrollW=1440 / clientW=1440`，左工具列 `x=0`，右屬性面板 `x=1148, w=292` |
| Mobile (`390×844`) 零水平溢位、左/右雙抽屜開合與乾淨重置 | `scrollW=390 / clientW=390`，左工具抽屜與右屬性抽屜皆正常開合，重置後物件數 `0` | `scrollW=390 / clientW=390`，左工具抽屜與右屬性抽屜皆正常開合，重置後物件數 `0` |

---

## GitHub Actions 自動部署紀錄

- **Workflow**：`.github/workflows/deploy.yml`
- **Run ID**：`45835532698`（[查看執行紀錄](https://github.com/arnohsu-0930/warehouse-flow-layout-gas/actions/runs/45835532698)）
- **Commit SHA**：`ea4c71888c85b929f0a350529fc7796337f8708b`
- **結果**：`completed` / `success`（耗時 27s，`Pushed 3 files`，更新固定部署至 **`@9`**）
