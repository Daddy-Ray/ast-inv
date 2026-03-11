# AST 网站运营维护手册

本手册用于日常运营、发布前检查与故障排查。建议维护人员按清单执行，避免遗漏。

## 1. 维护节奏

### 每次改动后（准备上线前）

- 运行一键预检：
  - `powershell -ExecutionPolicy Bypass -File .\tools\preflight.ps1`
- 若本地未启动服务，可改为：
  - `powershell -ExecutionPolicy Bypass -File .\tools\preflight.ps1 -StartServer`
- 人工点检关键路径（至少一遍）：
  - 首页 -> 业务范围 -> 4 个服务子页 -> 联系我们
- 三语言抽查：
  - `zh/en/ru` 各至少 1 个页面确认无乱码、无断链。

### 每周（建议固定一天）

- 在 Google Search Console 检查：
  - 覆盖率（是否新增“已发现 - 尚未编入索引”）
  - 站点地图状态（`sitemap.xml` 是否成功）
  - 核心网页体验（是否有新增问题）
- 抽查收录（可用 `site:ast-inv.hk`）。
- 至少做一次有效内容更新（案例、服务页说明、新闻动态之一）。

### 每月

- 运行一次完整性能与质量检查（不跳过 lighthouse）。
- 复核 SEO 结构：
  - `canonical/hreflang/sitemap/robots` 是否仍一致。
- 执行备份：
  - 代码库快照 + 关键素材（`assets`） + 报告（`reports`）。

### 大改版时（导航/URL/多语言结构变动）

- 上线前务必执行全量 `preflight`。
- 更新并上传：
  - `sitemap.xml`
  - `robots.txt`
- 在 GSC 对核心页面执行“请求编入索引”。

## 2. 常用命令

### 一键预检

- 全量检查：
  - `powershell -ExecutionPolicy Bypass -File .\tools\preflight.ps1`
- 自动启动本地服务：
  - `powershell -ExecutionPolicy Bypass -File .\tools\preflight.ps1 -StartServer`
- 可按需跳过：
  - `-SkipLighthouse`
  - `-SkipLinks`
  - `-SkipHtmlValidate`
  - `-SkipEncodingGuard`
  - `-SkipSeoSync`

### 编码相关

- 编码守卫检查：
  - `powershell -ExecutionPolicy Bypass -File .\tools\encoding-guard.ps1`
- 若中文源需要从当前页面修复同步：
  - `powershell -ExecutionPolicy Bypass -File .\tools\encoding-guard.ps1 -FixZhSrcFromZh`

### SEO 同步

- 正式页与 `-src` 对齐检查：
  - `powershell -ExecutionPolicy Bypass -File .\tools\seo-sync-check.ps1`

## 3. 发布前清单（可复制执行）

- [ ] `preflight` 全量通过（或明确记录跳过项）
- [ ] 三语言关键页人工可访问
- [ ] 首页与服务页无 404
- [ ] `sitemap.xml` 与 `robots.txt` 已更新并可访问
- [ ] 无乱码（尤其 `ru/zh`）
- [ ] 导航菜单与语言切换正常

## 4. SEO 运维动作（持续执行）

- GSC 提交站点地图：
  - `https://www.ast-inv.hk/sitemap.xml`
- 重点页面请求收录（每次重要更新后）：
  - 首页、业务范围总页、4 个服务子页（优先主语言后扩展多语言）
- 保持内链：
  - 首页与服务页对关键页面有可见文本链接，避免孤儿页。

## 5. 常见问题处理

### 提示“已发现 - 尚未编入索引”

- 先确认 `sitemap.xml` 提交成功。
- 对重点 URL 进行“请求编入索引”。
- 强化内部链接并等待抓取周期（通常几天到数周）。

### 出现乱码

- 先跑 `encoding-guard.ps1` 定位文件。
- 中文按 `zh-src -> zh` 工作流发布。
- 重新上传并清理服务器旧缓存。

### 出现 404

- 检查导航与语言切换链接路径是否正确。
- 运行 `preflight` 的链接检查项确认全站无断链。

## 6. 文件职责速查

- `tools/preflight.ps1`：一键综合检查入口
- `tools/encoding-guard.ps1`：乱码风险扫描
- `tools/seo-sync-check.ps1`：`live` 与 `-src` SEO 对齐检查
- `tools/zh-entities.ps1`：中文实体化编码发布流程
- `reports/`：检查输出报告目录
