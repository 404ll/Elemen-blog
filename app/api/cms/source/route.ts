import { NextResponse } from "next/server";
import { requireAdmin, requireSameOrigin } from "@/server/auth/admin";
import { saveSource } from "@/server/cms/source";
import { CmsError } from "@/server/cms/model";
export async function POST(request: Request) {
  try {
    await requireAdmin(); requireSameOrigin(request);
    const text = await request.text();
    if (text.length > 2048) throw new CmsError("Board 链接太长。");
    let input; try { input = JSON.parse(text); } catch { throw new CmsError("提交格式不正确。"); }
    if (typeof input?.link !== "string") throw new CmsError("请输入 Board 链接。");
    return NextResponse.json(await saveSource(input.link));
  } catch (error) {
    return NextResponse.json({ error: error instanceof CmsError ? error.message : "保存失败，请稍后重试。" }, { status: error instanceof CmsError ? error.status : 500 });
  }
}
