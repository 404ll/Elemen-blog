import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // 未使用的变量报错
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all", // 检查所有参数
          argsIgnorePattern: "^_", // 以 _ 开头的参数忽略
          varsIgnorePattern: "^_", // 以 _ 开头的变量忽略
          caughtErrors: "all", // 检查 catch 中的错误变量
          caughtErrorsIgnorePattern: "^_", // 以 _ 开头的 catch 错误变量忽略
        },
      ],
    },
  },
]);

export default eslintConfig;
