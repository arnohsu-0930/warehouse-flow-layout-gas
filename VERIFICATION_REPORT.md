# Verification Report (v8) — Floor Plan Flow & Layout Studio (GAS)

> 測試執行時間：2026-11-27 09:03–09:06 (Asia/Taipei)  
> 測試工具：Playwright Headless Chromium (`159.0.8154.6`)  
> 驗證對象：
> 1. **Local Build**：`http://127.0.0.1:<ephemeral-port>/index.html`
> 2. **Live GAS `/exec` URL**：`https://script.google.com/macros/s/AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_/exec`（固定部署版本 `@10`，GitHub Actions Run `#45920447168`，commit `44d775d`，穿透 `#sandboxFrame` → `#userHtmlFrame` 實測）

---

## 總體結果摘要

| 驗證項目 | Local Build | Live GAS `/exec` (`@10`) | 結果 |
|---|---:|---:|---|
| Role 1 — 進入網站自動跳出啟動歡迎彈窗 + 預設未勾選 `sessionStorage` 核取方塊 + 點擊「📖 立即查看說明」關閉彈窗並展開「❓ 說明」抽屜（驗證儲存/開啟專案 vs PNG/14天雲端暫存 & 重置全部＋網站更新套用）+ 同一工作階段不重複顯示 | PASS | PASS | ✅ |
| Role 2 — 新工作階段重現歡迎彈窗 → 點擊「我知道了，開始使用」進入正常操作（放置動線箭頭、文字方塊、製劑廠設備＋右側屬性面板微調＋JSON 匯出/清除/匯入還原＋2x PNG 匯出＋「🔄 重置全部」確認文案與乾淨重置） | PASS (`3/3`, JSON `30,406 B`, PNG `141,309 B`) | PASS (`3/3`, JSON `30,406 B`, PNG `141,309 B`) | ✅ |
| Role 3 — Desktop (`1440×900`) 與 Mobile (`390×844`) 零水平溢位（歡迎彈窗、說明抽屜、左側工具抽屜、右側屬性抽屜與待機狀態全數實測） | PASS (`1440/1440`, `390/390`) | PASS (`1440/1440`, `390/390`) | ✅ |
| Console Errors | **0** | **0** | ✅ |
| Page Errors (Uncaught Exceptions) | **0** | **0** | ✅ |
| HTTP 4xx / 5xx Errors | **0** | **0** | ✅ |

---

## 詳細測試證據

### 1. Role 1 — 啟動歡迎提示彈窗與右上角「❓ 說明」內容檢核

| 測試項目 | Local Build 實測結果 | Live GAS `/exec` (`@10`) 實測結果 |
|---|---|---|
| 初次進入自動跳出 `#welcome-modal` | 自動顯示，內容含「❓ 說明」、儲存/開啟專案與重置全部提醒 | 自動顯示，內容含「❓ 說明」、儲存/開啟專案與重置全部提醒 |
| 「本次瀏覽器工作階段不再提醒」預設狀態 | 顯示且預設未勾選 (`checked=false`) | 顯示且預設未勾選 (`checked=false`) |
| 點擊「📖 立即查看說明」 | `#welcome-modal` 立即關閉，`#help-drawer` 立即展開 | `#welcome-modal` 立即關閉，`#help-drawer` 立即展開 |
| `#help-section-save-load` 關鍵內容檢核 | 完整包含 `匯出 PNG`、`平面圖片`、`無法再重新編輯`、`儲存專案`、`.json`、`開啟專案`、`100%`、`雲端暫存`、`14 天` | 完整包含 `匯出 PNG`、`平面圖片`、`無法再重新編輯`、`儲存專案`、`.json`、`開啟專案`、`100%`、`雲端暫存`、`14 天` |
| `#help-section-reset` 關鍵內容檢核 | 完整包含 `重置全部`、`快取`、`新功能`、`範本`、`最新`、`儲存專案`（重置前備份提醒） | 完整包含 `重置全部`、`快取`、`新功能`、`範本`、`最新`、`儲存專案`（重置前備份提醒） |
| 未勾選即重新整理頁面 | `#welcome-modal` 再次乾淨顯示且核取方塊仍預設未勾選 | `#welcome-modal` 再次乾淨顯示且核取方塊仍預設未勾選 |
| 勾選核取方塊＋點擊「我知道了，開始使用」後重整 | `sessionStorage['FPLS_WELCOME_DISMISSED_SESSION_V8'] === '1'`，同一工作階段重整後不重複彈出 | `sessionStorage['FPLS_WELCOME_DISMISSED_SESSION_V8'] === '1'`，同一工作階段重整後不重複彈出 |

### 2. Role 2 — 關閉歡迎彈窗後完整正常操作、JSON/PNG 存取與重置全部流程

| 測試步驟 | Local Build 實測結果 | Live GAS `/exec` (`@10`) 實測結果 |
|---|---|---|
| 全新瀏覽器工作階段進入 | 自動顯示 `#welcome-modal`，點擊「我知道了，開始使用」順暢關閉 | 自動顯示 `#welcome-modal`，點擊「我知道了，開始使用」順暢關閉 |
| 放置動線箭頭 + 文字方塊 + 製劑廠設備 + 右側面板旋轉 `+15°` | `物件：3`，右側屬性面板正常顯示與操作無誤 | `物件：3`，右側屬性面板正常顯示與操作無誤 |
| 「💾 儲存專案」→ 清除畫布 →「📂 開啟專案」還原 | 匯出 `.json`（**`30,406 bytes`**）→ 清除後 `物件：0` → 匯入後完整還原 `物件：3` | 匯出 `.json`（**`30,406 bytes`**）→ 清除後 `物件：0` → 匯入後完整還原 `物件：3` |
| 「⬇️ 匯出 PNG」高解析圖片 | 有效 PNG（`89504e470d0a1a0a`，**`141,309 bytes`**） | 有效 PNG（`89504e470d0a1a0a`，**`141,309 bytes`**） |
| 「🔄 重置全部」確認視窗與執行結果 | 確認文案明確含「最新預設值與範本」及「儲存專案」備份提醒；確認後清空為 `物件：0` | 確認文案明確含「最新預設值與範本」及「儲存專案」備份提醒；確認後清空為 `物件：0` |

### 3. Role 3 — Desktop (`1440×900`) 與 Mobile (`390×844`) 響應式零水平溢位驗證

| 視口與狀態 | Local Build (`scrollW / clientW`) | Live GAS `/exec` (`@10`) (`scrollW / clientW`) |
|---|---|---|
| Desktop `1440×900` — 歡迎彈窗開啟 | `1440 / 1440`（零溢位） | `1440 / 1440`（零溢位） |
| Desktop `1440×900` — 說明抽屜開啟 | `1440 / 1440`（零溢位） | `1440 / 1440`（零溢位） |
| Desktop `1440×900` — 一般工作區 | `1440 / 1440`（零溢位） | `1440 / 1440`（零溢位） |
| Mobile `390×844` — 歡迎彈窗開啟 | `390 / 390`，卡片 `x=16, w=358` 完整置中 | `390 / 390`，卡片 `x=16, w=358` 完整置中 |
| Mobile `390×844` — 說明抽屜開啟 | `390 / 390`，抽屜 `x=16, w=358` 完整顯示 | `390 / 390`，抽屜 `x=16, w=358` 完整顯示 |
| Mobile `390×844` — 左工具抽屜 / 右屬性抽屜 / 待機 | 全數 `390 / 390`（零溢位） | 全數 `390 / 390`（零溢位） |

---

## GitHub Actions 自動部署紀錄

- **Workflow**：`.github/workflows/deploy.yml`
- **Run ID**：`45920447168`（[查看執行紀錄](https://github.com/arnohsu-0930/warehouse-flow-layout-gas/actions/runs/45920447168)）
- **Commit SHA**：`44d775d7b4ed39ed8463ed80fea83b9b1b102f82`
- **結果**：`completed` / `success`（耗時 20s，`Pushed 3 files`，更新固定部署 `AKfycby2kyBgSIgdQdxpkyXeXkh5F9h0wDrBDYpPfZpOMAkoBLrAmUMrU2WciRZFuIOg1_y_` 至 **`@10`**）
