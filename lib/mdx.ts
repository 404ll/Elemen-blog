// lib/mdx.ts
import { compile } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"

export async function renderMDX(source: string) {
  const compiled = await compile(source, { outputFormat: "function-body" })
  const fn = new Function(String(compiled))
  return fn({ ...runtime }).default
}
