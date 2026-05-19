/**
 * Practice manifest 运行时校验
 * loadManifest 解析 JSON 后立即 parse，避免子模块 manifest 格式错误导致静默脏数据
 */
import { z } from "zod";

/** 单题元信息 schema，字段与 types.PracticeProblemMeta 对齐 */
export const PracticeProblemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(["array", "function", "async", "react", "oop"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.string()).optional(),
  entry: z.string().min(1),
  updatedAt: z.string().optional(),
});

/** manifest 根 schema，至少包含一道题 */
export const PracticeManifestSchema = z.object({
  problems: z.array(PracticeProblemSchema).min(1),
});
