# Personal Knowledge Base — 首页浅色 V2 实施计划

**状态：** Implemented · pending visual review
**日期：** 2026-07-17
**关联主 SPEC：** [`../specs/2026-07-17-personal-knowledge-base-redesign-design.md`](../specs/2026-07-17-personal-knowledge-base-redesign-design.md)
**视觉 SPEC：** [`../specs/2026-07-17-personal-knowledge-base-home-light-visual-spec.md`](../specs/2026-07-17-personal-knowledge-base-home-light-visual-spec.md)
**目标视觉稿：** [`../specs/assets/knowledge-base-redesign/home-light-v2.png`](../specs/assets/knowledge-base-redesign/home-light-v2.png)

## 1. 试做范围

本次只实现一个可回退的首页切片，用真实站点内容验证 V2 方向：

- 将首页改为编辑式知识库入口，展示导语、搜索、最近更新、主题索引和局部知识关系。
- 将导航收敛为仓库中已经存在的知识库、代码练习和关于页面。
- 首页搜索通过 `GET /blog?q=...` 进入现有 Fuse.js 搜索结果。
- 全局浅色背景改为中性底色，正文恢复为适合中文阅读的无衬线字体；等宽字体只用于品牌、标签和元数据。
- 保留现有 MDX、URL、文章详情、代码练习和主题切换能力。

本次不实现：

- `/knowledge` 或 `/paths` 新路由。
- 新的内容模型、CMS 或 Writing Studio。
- 全站详情页重构。
- 暗色版视觉定稿。

## 2. SPEC 映射

| 实现项 | 对应规格 |
|---|---|
| 中性背景、橙色强调、编辑式排版 | `DEC-008`、`HOME-LIGHT-002` |
| 最近更新使用真实文章数据 | `HOME-LIGHT-003`、`KB-PRINCIPLE-002` |
| Selection API 局部关系图 | `HOME-LIGHT-004`、`HOME-LIGHT-006` |
| 分类数量来自当前已发布 MDX | `HOME-LIGHT-005` |
| 移动端关系图降级为树状列表 | 视觉 SPEC 第 9 节 |
| 首页搜索进入可工作的文章搜索 | 主 SPEC 第 5.2、5.3 节 |
| 不展示不存在的导航目标 | 主 SPEC 第 5.1 节 |

## 3. 实施步骤

1. 调整全局画布、字体角色和页面容器。
2. 简化导航，保留已有路由、主题切换和移动端菜单。
3. 用服务器组件重写首页，减少首页客户端 JavaScript。
4. 添加可访问的局部知识关系图和移动端树状降级。
5. 让 `/blog` 从查询参数读取初始搜索词。
6. 运行 `pnpm typecheck`、`pnpm test` 和 `pnpm build`。

## 4. 回退边界

本次不迁移内容或删除路由。回退时只需要还原首页、导航、全局样式和博客搜索参数接入；MDX 内容与文章 URL 不受影响。

## 5. 验证记录

2026-07-17 自动验证结果：

- [x] `pnpm typecheck`
- [x] `pnpm test`：16 项通过
- [x] `pnpm lint`
- [x] `pnpm build`：106 个静态页面生成完成，首页、搜索页和文章路由均成功构建
- [x] 数据核对：53 篇已发布内容；Frontend 37、AI 9、Algorithm 6、Backend 1；最近三篇与视觉 SPEC 一致
- [ ] 首页桌面与移动端视觉检查：本轮本地浏览器实例不可用，需在可用浏览器中补充
- [ ] 真实交互检查：需补充搜索提交、移动菜单和键盘焦点的浏览器验收

当前结论：代码与数据链路已经通过自动验证；视觉和真实交互仍是进入正式定稿前的明确待办，不把构建通过等同于 UI 验收。
