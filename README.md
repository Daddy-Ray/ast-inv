# AST Website Maintenance Notes

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

