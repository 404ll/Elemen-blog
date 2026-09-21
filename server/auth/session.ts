import { createHmac, timingSafeEqual } from "node:crypto";

// 凭证格式：base64url(JSON内容).HMAC签名。
// 内容可以解码，不是加密；只有持有服务端密钥的人才能为修改后的内容生成有效签名。
export function signSession(payload: Record<string, unknown>, secret: string) {
  if (secret.length < 32) throw new Error("CMS_SESSION_SECRET must contain at least 32 characters");
  const value = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${value}.${createHmac("sha256", secret).update(value).digest("base64url")}`;
}
export function verifySession(token: string, secret: string): Record<string, unknown> | null {
  try {
    if (secret.length < 32 || token.length > 4096) return null;
    const parts = token.split("."); if (parts.length !== 2) return null;
    const [value, signature] = parts;
    const actual = Buffer.from(signature, "base64url");
    // 用服务端密钥重新计算签名，与请求中的签名比较。
    const expected = createHmac("sha256", secret).update(value).digest();
    // timingSafeEqual 避免用普通字符串比较泄露逐字节匹配的耗时差异。
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const payload = JSON.parse(Buffer.from(value, "base64url").toString());
    // 签名正确仍然要检查过期；不会因为 Cookie 还在浏览器里就一直放行。
    if (!payload || typeof payload.exp !== "number" || payload.exp <= Date.now()) return null;
    return payload;
  } catch { return null; }
}
