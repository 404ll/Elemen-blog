// [action] 是 Next.js 的动态路由目录：这一个文件处理下面四个地址。
// GET  /api/cms/auth/github   → 开始 GitHub 登录
// GET  /api/cms/auth/callback → 接收 GitHub 登录结果
// POST /api/cms/auth/logout  → 退出登录
// POST /api/cms/auth/local   → 仅开发环境的免 GitHub 测试入口
// Next.js 按请求方法选择 GET / POST，并把地址的最后一段放进 params.action。

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authSecret, cookieOptions, localPreviewEnabled, requireSameOrigin, sessionCookie, setAdminSession, siteOrigin } from "@/server/auth/admin";
import { signSession, verifySession } from "@/server/auth/session";
import { CmsError } from "@/server/cms/model";

export const runtime = "nodejs";
// 临时 Cookie：只用来完成这一次 GitHub 登录，不代表已经获得后台权限。
const oauthCookie = "elemen-cms-oauth";

function githubConfig() {
  const id = process.env.CMS_GITHUB_CLIENT_ID, secret = process.env.CMS_GITHUB_CLIENT_SECRET;
  if (!id || !secret || !process.env.CMS_GITHUB_USER) throw new Error("GitHub login is not configured");
  return { id, secret };
}

export async function GET(request: Request, { params }: { params: Promise<{ action: string }> }) {
  // 例如访问 /api/cms/auth/github 时，action 就是字符串 "github"。
  const { action } = await params;
  try {
    const origin = siteOrigin(request), config = githubConfig();
    const jar = await cookies();
    // 第 1 步：用户点击「使用 GitHub 登录」，先来到博客的这个分支。
    if (action === "github") {
      // state：给这次登录生成随机标记，回调时必须原样匹配。
      // verifier：另一份随机值；先发它的 SHA-256 摘要，换取令牌时再交出原值（PKCE）。
      const state = randomBytes(24).toString("base64url"), verifier = randomBytes(32).toString("base64url");
      // 将登录过程的信息签名后存入浏览器 Cookie，10 分钟过期。
      // 签名用于防篡改；此时还没有创建管理员登录会话。
      jar.set(oauthCookie, signSession({ kind: "oauth", state, verifier, exp: Date.now() + 600_000 }, authSecret()), { ...cookieOptions, maxAge: 600 });
      const url = new URL("https://github.com/login/oauth/authorize");
      url.search = new URLSearchParams({ client_id: config.id, redirect_uri: `${origin}/api/cms/auth/callback`, state, scope: "read:user", code_challenge: createHash("sha256").update(verifier).digest("base64url"), code_challenge_method: "S256" }).toString();
      // 返回重定向响应：让浏览器跳到 GitHub，由 GitHub 处理账号登录和授权。
      return NextResponse.redirect(url);
    }
    // 第 2 步：GitHub 登录完成，将浏览器带回 /api/cms/auth/callback?code=…&state=…。
    if (action !== "callback") return new Response(null, { status: 404 });
    const url = new URL(request.url), token = jar.get(oauthCookie)?.value;
    // 取出临时凭证后，要求浏览器删除它；这不等于服务端记录了它已被使用。
    jar.delete(oauthCookie);
    // 检查临时 Cookie 的签名和有效期，再核对 state。
    // 只有 URL 里的 code 不够，还必须对应这个浏览器发起的登录。
    const state = token ? verifySession(token, authSecret()) : null;
    if (!state || state.kind !== "oauth" || state.state !== url.searchParams.get("state") || typeof state.verifier !== "string" || !url.searchParams.get("code")) throw new Error("Invalid OAuth state");
    // 第 3 步：博客服务端用临时授权码 code 向 GitHub 换访问令牌。
    // 应用密钥 client_secret 留在服务端，不发给浏览器。
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: config.id, client_secret: config.secret, code: url.searchParams.get("code"), redirect_uri: `${origin}/api/cms/auth/callback`, code_verifier: state.verifier }),
      cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("Token exchange failed");
    const data = await response.json();
    if (typeof data.access_token !== "string") throw new Error("No access token");
    // 第 4 步：拿访问令牌向 GitHub 查询「刚才登录的是谁」。
    // 身份来自 GitHub 的响应，不接受浏览器自行提交的用户名。
    const profileResponse = await fetch("https://api.github.com/user", { headers: { Authorization: `Bearer ${data.access_token}`, Accept: "application/vnd.github+json" }, cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!profileResponse.ok) throw new Error("Profile lookup failed");
    const profile = await profileResponse.json();
    // GitHub 登录成功不代表有后台权限：还必须匹配配置的管理员账号。
    // 当前按用户名匹配；后续可改为固定 GitHub 用户 ID。
    if (typeof profile.login !== "string" || profile.login.toLowerCase() !== process.env.CMS_GITHUB_USER?.toLowerCase()) throw new Error("Not the blog administrator");
    // 第 5 步：博客签发自己的 8 小时登录 Cookie，再跳回后台。
    // GitHub 访问令牌仅用于上面的身份查询，不存进博客登录 Cookie。
    await setAdminSession(profile.login);
    return NextResponse.redirect(`${origin}/admin`);
  } catch {
    return NextResponse.redirect(new URL("/admin?error=login", request.url));
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  try {
    // 登录测试和退出都属于操作请求：先核对请求来自配置的博客来源。
    // Origin 检查用于防止跨站请求，不能单独证明用户身份。
    requireSameOrigin(request);
    const { action } = await params;
    if (action === "local" && localPreviewEnabled()) {
      // 本地测试分支：开发模式 + CMS_LOCAL_PREVIEW=1 才启用，并检查本机地址。
      // 这里刻意跳过 GitHub 身份验证，不能把开发服务暴露到公网。
      if (!["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname)) return new Response(null, { status: 403 });
      await setAdminSession("local-preview");
    // 退出只删除当前浏览器的 Cookie；尚未实现服务端撤销已复制凭证。
    } else if (action === "logout") (await cookies()).delete(sessionCookie);
    else return new Response(null, { status: 404 });
    return NextResponse.redirect(`${siteOrigin(request)}/admin`, 303);
  } catch (error) { return NextResponse.json({ error: error instanceof CmsError ? error.message : "登录请求失败，请检查后台配置。" }, { status: 403 }); }
}
