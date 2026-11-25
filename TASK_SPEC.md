# Floor Plan Flow & Layout Studio (GAS) - AGY Autonomous Design & Build

## 1. Safety & Scope Rules
- NEVER delete or modify any existing files outside C:/2026 GAS/warehouse-flow-layout-gas.
- General-purpose, public-ready UI: NOT limited to warehouses (suitable for offices, labs, factories, retail, logistics, clinics, etc.). Keep Traditional Chinese UI clean, intuitive, zero company-specific branding, zero GMP/GxP bloat.
- Merge src_legacy/flow_tool.html and src_legacy/layout_tool.html into a unified single-page GAS Web App (index.html + Code.gs + appsscript.json).

## 2. Core Features (Designed by AGY for Maximum Usability)
- Replaceable Base Map: Upload any PNG/JPG/SVG image, start from blank canvas, or pick built-in general/warehouse templates.
- Multi-Project / Multi-Zone Tabs: Create, rename, switch, duplicate, and delete multiple layout pages/zones in one workspace.
- Unified Interactive Canvas:
  1. Flow Arrows (P/M/W + customizable arrow label & color, 6 directions: left/right/up/down/double-h/double-v with upright horizontal text).
  2. Masking & Labels: Borderless white Rect & Circle masks, editable room/zone labels (always kept on top layer), editable multi-color Legend widget.
  3. Mapping & Equipment Points: T/M/B numbered markers (auto-increment & editable), SA$RA Supply/Return icons, SA-D/RA-U icons, SA/RA directional arrows, Dimension lines with custom measurement text, scalable 2D/3D Pallets/Equipment blocks & Pillars, and customizable 2D/3D Multi-Tier Rack/Shelf Diagram generator (custom name, tiers 2-8, M-tier, per-tier height cm, toggleable/draggable on canvas).
  4. Smooth UX: Click/drag to place, Ctrl+C/Ctrl+V, Ctrl+Drag duplicate, Delete/Backspace, Undo/Redo, layer controls, dismissible quick-help drawer, export/import .json config, localStorage auto-save + optional GAS cloud preset save/load, and high-res PNG export for Word.

## 3. GAS + GitHub Auto-Deploy Setup
- Create appsscript.json (timeZone: Asia/Taipei, runtimeVersion: V8, webapp: {executeAs:"USER_DEPLOYING", access:"ANYONE_ANONYMOUS"}).
- Create Code.gs with doGet() serving index.html (ALLOWALL) + server-side config storage (PropertiesService with gzip/chunking safety).
- Create public or private GitHub repo arnohsu-0930/warehouse-flow-layout-gas, run clasp create --type webapp, clasp deploy to get fixed Deployment ID & /exec URL.
- Upload CLASPRC_JSON secret via Node execFileSync stdin (never PowerShell string interpolation), add .github/workflows/deploy.yml, push to main, and record Repo URL, Script ID, Deployment ID, and live /exec URL in STATUS.md.

## 4. Mandatory Real-User Multi-Role Workflow Simulation & Zero-Error Verification
- Run Playwright headless browser tests against both local build AND live GAS /exec URL:
  1. Role 1 (General Facility/Office Planner): Upload custom floor plan, add new zone tab, draw multi-direction P/M/W arrows, add white masks + labels + legend, export .json, refresh page, import .json and verify full restoration.
  2. Role 2 (Engineer/Technician): Place T/M/B numbered markers (1,2,3), SA/RA & SA-D/RA-U icons, Dimension line with custom text, configure 4-tier Rack/Shelf diagram with custom heights, test Ctrl+C/V, Ctrl+Drag, Delete, and Undo.
  3. Role 3 (Public User / Reset & Export): Export high-res PNG (verify valid PNG > 10KB), reset/clear canvas, refresh page and verify zero leftover test data, verify 0 Console Errors, 0 Page Errors, 0 HTTP 4xx/5xx across desktop and mobile viewports.
- Save detailed test evidence in VERIFICATION_REPORT.md.
