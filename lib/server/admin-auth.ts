import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { adminAccessCookie } from "@/lib/admin-session";
import { authJson, serviceJson, SupabaseRequestError } from "@/lib/server/supabase-rest";
import type { AdminUser } from "@/types/admin";

type SupabaseAuthUser = { id: string; email?: string };
type SupabaseAuthSession = {
  access_token: string;
  expires_in: number;
  user: SupabaseAuthUser;
};

export async function authenticateAdmin(email: string, password: string): Promise<SupabaseAuthSession> {
  const session = await authJson<SupabaseAuthSession>("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  const admin = await verifyAdminUser(session.user);
  if (!admin) throw new SupabaseRequestError(403, "管理者権限がありません。");
  return session;
}

export async function getAdminFromRequest(request: NextRequest): Promise<AdminUser | null> {
  return verifyAdminAccessToken(request.cookies.get(adminAccessCookie)?.value);
}

export async function getAdminFromCookies(): Promise<AdminUser | null> {
  return verifyAdminAccessToken(cookies().get(adminAccessCookie)?.value);
}

export async function requireAdminPage(): Promise<AdminUser> {
  const admin = await getAdminFromCookies().catch(() => null);
  if (!admin) redirect("/mypage");
  return admin;
}

async function verifyAdminAccessToken(token?: string): Promise<AdminUser | null> {
  if (!token) return null;
  try {
    const user = await authJson<SupabaseAuthUser>("/user", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return verifyAdminUser(user);
  } catch {
    return null;
  }
}

async function verifyAdminUser(user: SupabaseAuthUser): Promise<AdminUser | null> {
  const query = new URLSearchParams({ select: "role", id: `eq.${user.id}`, limit: "1" });
  const rows = await serviceJson<Array<{ role: string }>>(`/rest/v1/profiles?${query}`);
  if (rows[0]?.role !== "admin") return null;
  return { id: user.id, email: user.email ?? "管理者" };
}
