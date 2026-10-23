const enc = new TextEncoder();
export const random = () => crypto.randomUUID();
export async function hash(value) {
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(value)))].map((x) => x.toString(16).padStart(2, "0")).join("");
}
export async function token(secret, kind, p) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return [...new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`${kind}:${p.id}:${p.version}`)))].map((x) => x.toString(16).padStart(2, "0")).join("");
}
export function equal(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
export const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
