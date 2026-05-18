import { z } from "zod";

export const PracticeProblemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(["array", "function", "async", "react", "oop"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.string()).optional(),
  entry: z.string().min(1),
  updatedAt: z.string().optional(),
});

export const PracticeManifestSchema = z.object({
  problems: z.array(PracticeProblemSchema).min(1),
});
