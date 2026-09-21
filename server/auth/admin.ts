import "server-only";
import { cookies } from "next/headers";
import { CmsError } from "../cms/model";
import { signSession, verifySession } from "./session";

// 正式的博客登录凭证，与登录过程中的 elemen-cms-oauth 临时 Cookie 不同。
export const sessionCookie = "elemen-cms-session";
// HttpOnly：网页脚本不能直接读 Cookie；生产环境 Secure：只通过 HTTPS 发送。
// SameSite=Lax 限制跨站携带 Cookie；写入接口仍额外检查 Origin。
export const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
export function localPreviewEnabled() { return process.env.NODE_ENV === "development" && process.env.CMS_LOCAL_PREVIEW === "1"; }
export function authSecret() {
  const secret = process.env.CMS_SESSION_SECRET ?? "";
  if (secret.length < 32) throw new CmsError("请配置 CMS_SESSION_SECRET 后再登录。", 503);
  return secret;
}
export function siteOrigin(request: Request) {
  const configured = process.env.CMS_ORIGIN;
  if (configured) return new URL(configured).origin;
  // Next's request.url can use localhost internally even when the browser uses 127.0.0.1.
  const url = new URL(`http://${request.headers.get("host") || new URL(request.url).host}`);
  if (localPreviewEnabled() && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return url.origin;
  throw new CmsError("请配置 CMS_ORIGIN。", 503);
}
export function requireSameOrigin(request: Request) {
  if (request.headers.get("origin") !== siteOrigin(request)) throw new CmsError("请求来源不正确，请从后台页面操作。", 403);
}
// 每次读取后台或调用受保护接口，都重新检查浏览器随请求带来的 Cookie。
// 不向 GitHub 重新查询，也不读取会话数据库；凭证正确且未过期才认可。
export async function currentAdmin() {
  const token = (await cookies()).get(sessionCookie)?.value;
  const secret = process.env.CMS_SESSION_SECRET;
  if (!token || !secret) return null;
  // 检查「是否由博客签发、内容有没有被改、是否已经过期」。
  const session = verifySession(token, secret);
  if (!session || session.kind !== "admin") return null;
  if (session.user === "local-preview") return localPreviewEnabled() ? session.user : null;
  return typeof session.user === "string" && !!process.env.CMS_GITHUB_USER && session.user.toLowerCase() === process.env.CMS_GITHUB_USER.toLowerCase() ? session.user : null;
}
// 给 API 使用：没有管理员身份就抛出 401，后面的发布/配置逻辑不会执行。
export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) throw new CmsError("请先登录。", 401);
  return admin;
}
// 通过 Set-Cookie 响应头将签名凭证交给浏览器；以后请求本站会自动携带。
// exp 是服务端校验的过期时间，maxAge 是浏览器保存 Cookie 的时长。
export async function setAdminSession(user: string) {
  (await cookies()).set(sessionCookie, signSession({ kind: "admin", user, exp: Date.now() + 8 * 3600_000 }, authSecret()), { ...cookieOptions, maxAge: 8 * 3600 });
}
