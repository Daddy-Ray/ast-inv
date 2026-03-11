# AST 网站维护说明（中文）

- 运营维护手册：`OPERATIONS.md`

## 中文内容工作流（防乱码）

- 在 `zh-src/*.html` 中编辑中文页面（UTF-8 源文件）。
- 通过编码脚本发布到 `zh/*.html`：
  - `powershell -ExecutionPolicy Bypass -File .\tools\zh-entities.ps1 -Mode encode`
- 如果 `zh-src` 尚未初始化，可先从当前 `zh` 页面生成：
  - `powershell -ExecutionPolicy Bypass -File .\tools\zh-entities.ps1 -Mode decode`

## 为什么这样做

- `zh/*.html` 使用 HTML 实体存储非 ASCII 字符。
- 这样可以规避本地代码页差异导致的中文乱码或 `?` 问题。
- 浏览器渲染效果仍然是正常中文。

## 编码守卫（建议上传前执行）

- 执行检查：
  - `powershell -ExecutionPolicy Bypass -File .\tools\encoding-guard.ps1`
- 若脚本报告问题，先从当前干净页面同步 `zh-src`：
  - `powershell -ExecutionPolicy Bypass -File .\tools\encoding-guard.ps1 -FixZhSrcFromZh`
- 然后再次执行检查，直到通过。

## 一键预检（Preflight）

- 执行全量预检（Lighthouse、404 链接、HTML 校验、编码检查、SEO 同步检查）：
  - `powershell -ExecutionPolicy Bypass -File .\tools\preflight.ps1`
- 需要脚本自动启动本地服务时：
  - `powershell -ExecutionPolicy Bypass -File .\tools\preflight.ps1 -StartServer`
- 如需跳过 SEO 同步检查：
  - `powershell -ExecutionPolicy Bypass -File .\tools\preflight.ps1 -SkipSeoSync`
- 报告输出目录：
  - `.\reports\`
  - 包含 `preflight-summary.txt` 及各项明细结果。

## SEO 同步检查（正式页 vs -src）

- 校验 `en/zh/ru` 与 `en-src/zh-src/ru-src` 是否一致：
  - 双侧页面文件是否一一对应
  - `canonical` 与 `hreflang` 是否符合预期线上 URL
- 执行命令：
  - `powershell -ExecutionPolicy Bypass -File .\tools\seo-sync-check.ps1`
