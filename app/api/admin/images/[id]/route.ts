import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/server/admin-auth";
import { isUuid } from "@/lib/server/http-security";
import { downloadPrivateImage, serviceJson } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isUuid(params.id)) return NextResponse.json({ error: "画像IDが正しくありません。" }, { status: 400 });
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "管理者としてログインしてください。" }, { status: 403 });

  try {
    const query = new URLSearchParams({ select: "storage_path,mime_type", id: `eq.${params.id}`, limit: "1" });
    const rows = await serviceJson<Array<{ storage_path: string; mime_type: string }>>(`/rest/v1/diagnosis_images?${query}`);
    if (!rows[0]) return NextResponse.json({ error: "画像が見つかりません。" }, { status: 404 });
    const image = await downloadPrivateImage(rows[0].storage_path);
    const mimeType = rows[0].mime_type === "image/jpeg" ? "image/jpeg" : "image/webp";
    const extension = mimeType === "image/jpeg" ? "jpg" : "webp";
    return new NextResponse(image.body, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${params.id}.${extension}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return NextResponse.json({ error: "画像を読み込めませんでした。" }, { status: 500 });
  }
}
