import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const COOKIE = "portfolio_admin";
function signature(value: string) { const secret = process.env.ADMIN_SESSION_SECRET; if (!secret) throw new Error("Configure ADMIN_SESSION_SECRET."); return createHmac("sha256", secret).update(value).digest("hex"); }
export function validAdminPassword(password: string) { const expected = process.env.ADMIN_PASSWORD; if (!expected || !password) return false; const a = Buffer.from(password); const b = Buffer.from(expected); return a.length === b.length && timingSafeEqual(a, b); }
export async function createAdminSession() { const value = `${Date.now() + 1000 * 60 * 60 * 12}`; (await cookies()).set(COOKIE, `${value}.${signature(value)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 12 }); }
export async function isAdmin() { const token = (await cookies()).get(COOKIE)?.value; if (!token) return false; const [value, sig] = token.split("."); if (!value || !sig || Number(value) < Date.now()) return false; const expected = signature(value); const a = Buffer.from(sig); const b = Buffer.from(expected); return a.length === b.length && timingSafeEqual(a, b); }
export async function clearAdminSession() { (await cookies()).delete(COOKIE); }
