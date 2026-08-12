<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 素材命名绑定规则

整个项目的图片、音频、视频等素材统一采用“固定命名绑定”：代码只引用约定好的固定文件名与路径；替换素材时，直接用同类型、同扩展名、同文件名的新文件覆盖原文件，不修改代码中的引用关系。新增素材时，也必须先定义清晰且唯一的语义化命名与固定存放位置，再进行代码绑定，禁止使用随机名、临时名或依赖文件排列顺序进行引用。

固定命名素材禁止经过会按 URL 长期复用旧内容的图片优化缓存。使用 `next/image` 时必须关闭优化（组件设置 `unoptimized`，并由项目配置统一兜底）；素材接口必须返回禁止缓存响应头。只要文件路径、文件名和扩展名不变，同名覆盖素材内容后，页面刷新必须展示新内容，不得要求修改代码引用或素材文件名来绕过缓存。
