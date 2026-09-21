import { publishArticle } from "@/server/cms/publish";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireSameOrigin } from "@/server/auth/admin";
import { CmsError, publishSchema } from "@/server/cms/model";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    // 先查登录身份，再查请求来源。直接调用 API 也必须经过这里，不能绕过页面登录。
    await requireAdmin();
    requireSameOrigin(request);
    const text = await request.text();
    if (text.length > 16000) throw new CmsError("提交的信息太长。");
    let json: unknown; try { json = JSON.parse(text); } catch { throw new CmsError("提交格式不正确。"); }
    const parsed = publishSchema.safeParse(json);
    if (!parsed.success) throw new CmsError("请检查网址、分类、摘要和标签。网址只使用小写字母、数字和连字符。");
    const input = parsed.data;
    const article = await publishArticle(input);
    for (const path of ["/", "/blog", `/blog/${article.category}`, `/blog/category/${article.category}`, `/blog/${article.slug}`, "/admin"]) revalidatePath(path);
    return NextResponse.json({ url: `/blog/${article.slug}`, revision: article.revision, syncedAt: article.syncedAt }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof CmsError ? error.message : "未能确认同步结果，请刷新后台查看状态后重试。" }, { status: error instanceof CmsError ? error.status : 500, headers: { "Cache-Control": "no-store" } });
  }
}
