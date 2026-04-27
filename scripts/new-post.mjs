// scripts/new-post.mjs
//
// 用 .mjs 扩展名是因为这个项目的 package.json 没有 "type": "module"
// .mjs 强制告诉 Node.js "用 ESM 模块语法解析这个文件"
// 这样就能用 import/export，而不是老式的 require()
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

// __dirname 在 ESM 里不存在（这是 CommonJS 的变量）
// 用 import.meta.url 拿到当前文件的 URL，再转成路径
// fileURLToPath 把 file:///Users/... 这种 URL 转成普通路径字符串
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// content 目录在项目根目录下，scripts 的上一级就是根目录
const CONTENT_DIR = path.join(__dirname, "../content");

// 分类列表和对应的子目录名，和 constant/index.ts 保持一致
const CATEGORIES = [
  { name: "Frontend", value: "frontend" },
  { name: "Algorithm", value: "algorithm" },
  { name: "Web3",     value: "web3"      },
  { name: "Note",     value: "note"      },
  { name: "Backend",  value: "backend"   },
];

// inquirer.prompt 接收一个"问题数组"，每个问题是一个对象
// type 决定交互方式：input=文字输入，list=上下键选择
const answers = await inquirer.prompt([
  {
    type: "input",
    name: "title",
    message: "文章标题:",
    // validate 是一个函数，返回 true 表示通过，返回字符串表示错误信息
    validate: (val) => val.trim() !== "" || "标题不能为空",
  },
  {
    type: "list",
    name: "category",
    message: "选择分类:",
    choices: CATEGORIES,
  },
  {
    type: "input",
    name: "excerpt",
    message: "Excerpt (可选，直接回车跳过):",
  },
  {
    type: "input",
    name: "tags",
    message: "Tags (可选，逗号分隔，如 react,hooks):",
  },
  {
    type: "input",
    name: "slug",
    message: "文件名 slug (如 react-performance):",
    validate: (val) => {
      if (val.trim() === "") return "slug 不能为空";
      // 只允许小写字母、数字、连字符，避免文件名有奇怪字符
      if (!/^[a-z0-9-]+$/.test(val.trim())) return "只能包含小写字母、数字和连字符 -";
      return true;
    },
  },
]);

// 处理 tags：把 "react, hooks" 这样的字符串转成数组
// filter(Boolean) 去掉空字符串（比如用户输了多余的逗号）
const tagsArray = answers.tags
  ? answers.tags.split(",").map((t) => t.trim()).filter(Boolean)
  : [];

// 生成今天的日期，格式 YYYY-MM-DD
// toISOString() 返回 "2026-04-27T00:00:00.000Z"，split("T")[0] 取日期部分
const today = new Date().toISOString().split("T")[0];

// 构造 frontmatter 字符串
// YAML 里数组写法：["react", "hooks"]
const tagsYaml = tagsArray.length > 0
  ? `[${tagsArray.map((t) => `"${t}"`).join(", ")}]`
  : "[]";

const frontmatter = `---
title: "${answers.title.trim()}"
date: "${today}"
excerpt: "${answers.excerpt.trim()}"
category: "${answers.category}"
tags: ${tagsYaml}
draft: false
---
`;

// 确保目标目录存在，recursive: true 相当于 mkdir -p（不存在就创建，已存在不报错）
const targetDir = path.join(CONTENT_DIR, answers.category);
fs.mkdirSync(targetDir, { recursive: true });

const filePath = path.join(targetDir, `${answers.slug.trim()}.mdx`);

// 如果文件已存在，提前报错，避免覆盖已有文章
if (fs.existsSync(filePath)) {
  console.error(`\n❌ 文件已存在: ${filePath}`);
  process.exit(1);
}

fs.writeFileSync(filePath, frontmatter, "utf-8");

// path.relative 把绝对路径转成相对于项目根目录的路径，打印更简洁
const relativePath = path.relative(path.join(__dirname, ".."), filePath);
console.log(`\n✅ 已创建: ${relativePath}`);
