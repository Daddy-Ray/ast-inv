# AST Website Maintenance Notes

- Chinese version: `README.zh-CN.md`
- Operations runbook: `OPERATIONS.md`

## Chinese Content Workflow (anti-garbled)

- Edit Chinese pages in `zh-src/*.html` (UTF-8 source files).
- Run encoder to publish into `zh/*.html`:
  - `powershell -ExecutionPolicy Bypass -File .\tools\zh-entities.ps1 -Mode encode`
- If `zh-src` does not exist yet, initialize it from current `zh` files:
  - `powershell -ExecutionPolicy Bypass -File .\tools\zh-entities.ps1 -Mode decode`

## Why this exists

- `zh/*.html` uses HTML entities for non-ASCII characters.
- This avoids local code-page issues that can turn Chinese text into mojibake or `?`.
- Browser rendering remains normal Chinese.

## Encoding Guard (recommended before upload)

- Run check:
  - `powershell -ExecutionPolicy Bypass -File .\tools\encoding-guard.ps1`
- If it reports problems, first sync Chinese source from current clean pages:
  - `powershell -ExecutionPolicy Bypass -File .\tools\encoding-guard.ps1 -FixZhSrcFromZh`
- Then run check again until it passes.

## One-Command Preflight Check

- Run full preflight checks (Lighthouse, 404 links, HTML validate, encoding, SEO sync):
  - `powershell -ExecutionPolicy Bypass -File .\tools\preflight.ps1`
- If you want the script to auto-start local server:
  - `powershell -ExecutionPolicy Bypass -File .\tools\preflight.ps1 -StartServer`
- If needed, skip SEO sync check:
  - `powershell -ExecutionPolicy Bypass -File .\tools\preflight.ps1 -SkipSeoSync`
- Reports are written to:
  - `.\reports\`
  - Includes `preflight-summary.txt` and detailed outputs.

## SEO Sync Check (live vs -src)

- Verify `en/zh/ru` and `en-src/zh-src/ru-src` are aligned:
  - same page files exist on both sides
  - `canonical` and `hreflang` tags match expected production URLs
- Run:
  - `powershell -ExecutionPolicy Bypass -File .\tools\seo-sync-check.ps1`

