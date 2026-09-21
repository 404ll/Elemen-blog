# YouMind 博客同步

在 `/admin` 登录，通过「配置内容来源」粘贴 YouMind Board 链接并保存。后台会先验证读取权限，再将 Board ID 存到内容数据库；数据库中的配置优先于 `YOUMIND_BOARD_ID` 环境变量。切换 Board 不删除已发布文章。

文章库提供文件夹层级导航，父文件夹包含其子文件夹的文章；「未分组」只显示 Board 根目录文档。文件夹不自动映射博客分类。

查看已连接 Board 的文档，点击「预览并同步」。首次同步设置分类、固定网址、摘要和标签；之后在 YouMind 修改，再点击「同步最新版本」。

正文、标题和源文档信息以 YouMind 为准；摘要、分类、标签和固定网址由博客保存。仅同步所选文档，不自动公开整个 Board，不调用 YouMind 的公开分享接口。源文档移出 Board 后，博客保留上次发布版本。

## 本地运行

`npm install`，然后在 Git 忽略的 `.env.local` 中配置：

```dotenv
YOUMIND_API_KEY=<your-key>
YOUMIND_BOARD_ID=<board-id>
CMS_SESSION_SECRET=<at-least-32-random-characters>
CMS_LOCAL_PREVIEW=1
```

运行 `npm run dev -- --hostname 127.0.0.1`，打开 `/admin`，点击「进入本地测试后台」。本地 SQLite 位于 `.data/cms.db`，被 Git 忽略。这个入口仅在 development、显式启用且通过本机地址访问时生效。同步只写本地数据库，不修改生产内容。

## 线上配置

需要可持久保存内容的远程 libSQL 数据库（例如 Turso）及 GitHub OAuth App。线上不会回退到临时文件数据库。

```dotenv
YOUMIND_API_KEY=<your-key>
YOUMIND_BOARD_ID=<board-id>
CMS_SESSION_SECRET=<independent-production-random-secret>
CMS_DATABASE_URL=libsql://<database-host>
CMS_DATABASE_TOKEN=<database-token>
CMS_ORIGIN=https://<blog-domain>
CMS_GITHUB_CLIENT_ID=<oauth-client-id>
CMS_GITHUB_CLIENT_SECRET=<oauth-client-secret>
CMS_GITHUB_USER=<only-allowed-github-login>
```

GitHub OAuth 回调地址：`https://<blog-domain>/api/cms/auth/callback`。仅请求 `read:user`，不请求仓库写入权限；使用 state、PKCE、HttpOnly 会话 cookie，所有读取和同步入口校验登录，写入额外校验请求来源。生产环境不启用 `CMS_LOCAL_PREVIEW`。服务端密钥不得带 `NEXT_PUBLIC_` 前缀。

数据库首次访问自动创建 `cms_articles` 表。公开页面读取发布快照；同步成功后刷新路由缓存，无需提交文章代码或重建网站。原有仓库 MDX 文章仍然保留。博客首页、列表、分类、正文改为动态读取，因此线上增加了服务端与数据库读取开销。

## 内容及并发边界

- YouMind Markdown 使用 `format: md` 渲染，不执行导入的 JSX 或 JavaScript。解析图片 JSON 元数据、清理空段落占位符及标点加粗，保留代码正文。
- 发布时重新读取原文，并比较预览时的标题/正文 hash；变化则要求重新预览。
- 数据库事务检查发布版本，旧标签页无法覆盖新版本。文章网址唯一，首次发布后保持固定。
- 同步接口只接受已配置 Board 中的可见、未删除文档。
- 当前图片使用 `cdn.gooo.ai` HTTPS 图片地址，生成图片使用已验证的 `@large` 变体。未镜像到自有存储；YouMind CDN 图片移除仍可能影响博客。其他图片域名显示占位提示，需要明确适配后加入白名单。
- 分类和地址迁移、下架、定时同步、历史版本回滚不包含在第一版。
- 不承诺原生 YouMind 的所有交互组件、复杂表格或媒体都完整还原；发布前使用预览检查。

## 验证

`npm test` 包含快照持久化、更新与冲突、图片元数据、代码保真、Markdown 执行边界、会话校验。另运行 `npm run lint`、`npm run typecheck`、`npm run build`。

本地浏览器测试使用开发登录，不代表 GitHub OAuth 和远程数据库已在生产验证。上线前应分别验收管理员登录、未登录访问被拒、首次同步、再次更新、旧标签页冲突，以及公开文章可访问。

官方参考：[YouMind](https://youmind.com/for-agents)、[GitHub OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)、[libSQL TypeScript SDK](https://docs.turso.tech/sdk/ts/reference)。

## 代码结构

- `app/api/cms/`：HTTP 入口，负责鉴权、请求校验、状态码与路由刷新。
- `server/auth/`：管理员身份检查、GitHub 登录会话的签名与校验。OAuth HTTP 回调仍在 `app/api/cms/auth/`。
- `server/youmind/`：YouMind 接口客户端、文件夹结构解析；不读取博客的来源配置。
- `server/cms/source.ts`：Board 配置及来源约束。
- `server/cms/publish.ts`：读取原文、校验渲染、保存发布版本的流程。
- `server/cms/database.ts`：仅服务端使用的数据库连接；`store.ts` 提供可独立测试的事务存储实现。
- `server/cms/posts.ts`：合并仓库文章与发布快照；`render.ts` 负责 Markdown 编译。
- `lib/markdown/youmind.ts`：不依赖登录、数据库或网络的内容转换函数。
- `components/cms/`：文章展示组件与样式。

主流程：浏览器 → `app/api/cms/publish/route.ts` → `server/cms/publish.ts` → YouMind 读取、Markdown 校验、数据库事务保存。
