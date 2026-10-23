let cached;
export async function zoho(env, path, body) {
  if (!cached || cached.until < Date.now() + 6e4) {
    const r2 = await fetch("https://accounts.zohocloud.ca/oauth/v2/token", { method: "POST", body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: env.ZOHO_REFRESH_TOKEN, client_id: env.ZOHO_CLIENT_ID, client_secret: env.ZOHO_CLIENT_SECRET }), signal: AbortSignal.timeout(15e3) });
    const j2 = await r2.json();
    if (!r2.ok || !j2.access_token) throw Error("Mail authentication failed");
    cached = { token: j2.access_token, until: Date.now() + (j2.expires_in || 3600) * 1e3 };
  }
  const r = await fetch("https://mail.zohocloud.ca/api" + path, { method: body ? "POST" : "GET", headers: { Authorization: "Zoho-oauthtoken " + cached.token, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : void 0, signal: AbortSignal.timeout(2e4) });
  const j = await r.json();
  if (!r.ok || Number(j.status?.code) >= 400) throw Error("Mail service request failed");
  return j.data;
}
export async function send(env, to, subject, content) {
  if (env.MAIL_MODE !== "live") return "suppressed-test";
  const result = await zoho(env, `/accounts/${env.ZOHO_ACCOUNT_ID}/messages`, { fromAddress: "info@leapgymnastics.ca", toAddress: to, subject, content, mailFormat: "html" });
  if (!result?.messageId) throw Error("Mail delivery acknowledgement missing");
  return String(result.messageId);
}
