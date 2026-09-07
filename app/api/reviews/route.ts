import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import { ensureAnonymousUserId, setAnonymousUserCookie } from "@/lib/server/anonymous-user";
import { hasSameOrigin } from "@/lib/server/http-security";
import { serviceJson, SupabaseConfigurationError } from "@/lib/server/supabase-rest";
import type { UserReview } from "@/data/reviews";

export const dynamic = "force-dynamic";

type ReviewRow = {
  id: string; product_id: string; nickname: string; age_group: string; hair_type: "fine" | "normal" | "coarse";
  concerns: string[]; usage_period: string; rating: number; positive: string; negative: string;
  fragrance: string; finish: string; use_again: string; created_at: string;
};

export async function GET() {
  try {
    const query = new URLSearchParams({
      select: "id,product_id,nickname,age_group,hair_type,concerns,usage_period,rating,positive,negative,fragrance,finish,use_again,created_at",
      moderation_status: "eq.published",
      order: "created_at.desc",
      limit: "100"
    });
    const rows = await serviceJson<ReviewRow[]>(`/rest/v1/product_reviews?${query}`);
    return NextResponse.json(rows.map(toPublicReview), { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) return errorResponse("口コミの保存先を準備しています。", 503);
    return errorResponse("口コミを読み込めませんでした。", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return errorResponse("不正な送信元です。", 403);
  try {
    const anonymousUserId = ensureAnonymousUserId(request);
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentQuery = new URLSearchParams({ select: "id", anonymous_user_id: `eq.${anonymousUserId}`, created_at: `gte.${since}`, limit: "5" });
    const recent = await serviceJson<Array<{ id: string }>>(`/rest/v1/product_reviews?${recentQuery}`);
    if (recent.length >= 5) return errorResponse("投稿回数が多いため、時間をおいてお試しください。", 429);

    const body = await request.json() as Record<string, unknown>;
    const productId = stringValue(body.productId, 120);
    if (!products.some((product) => product.id === productId)) return errorResponse("商品を選び直してください。", 400);
    const nickname = stringValue(body.nickname, 30);
    const ageGroup = enumValue(body.ageGroup, ["中学生", "高校生", "大学生以上"]);
    const hairType = enumValue(body.hairType, ["fine", "normal", "coarse"]);
    const usagePeriod = enumValue(body.usagePeriod, ["1週間未満", "1〜2週間", "3週間〜1か月", "1か月以上"]);
    const fragrance = enumValue(body.fragrance, ["好き", "普通", "苦手"]);
    const finish = enumValue(body.finish, ["軽い", "ちょうどよい", "重い", "よく分からない"]);
    const useAgain = enumValue(body.useAgain, ["はい", "まだ分からない", "いいえ"]);
    const positive = stringValue(body.positive, 1000);
    const negative = stringValue(body.negative, 1000);
    const rating = Number(body.rating);
    const concerns = Array.isArray(body.concerns) ? body.concerns.map((item) => stringValue(item, 40)).slice(0, 8) : [];
    if (!nickname || !positive || !negative || !Number.isInteger(rating) || rating < 1 || rating > 5 || !ageGroup || !hairType || !usagePeriod || !fragrance || !finish || !useAgain) return errorResponse("入力内容を確認してください。", 400);

    await serviceJson("/rest/v1/product_reviews", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ anonymous_user_id: anonymousUserId, product_id: productId, nickname, age_group: ageGroup, hair_type: hairType, concerns, usage_period: usagePeriod, rating, positive, negative, fragrance, finish, use_again: useAgain }) });
    const response = NextResponse.json({ accepted: true }, { status: 201 });
    response.headers.set("Cache-Control", "no-store");
    setAnonymousUserCookie(response, anonymousUserId);
    return response;
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) return errorResponse("口コミの保存先を準備しています。", 503);
    return errorResponse("口コミを送信できませんでした。", 500);
  }
}

function toPublicReview(row: ReviewRow): UserReview {
  const product = products.find((item) => item.id === row.product_id);
  return { id: row.id, name: row.nickname, ageGroup: row.age_group, hairType: row.hair_type, concerns: row.concerns, productId: row.product_id, product: product?.name ?? "掲載終了商品", usagePeriod: row.usage_period, rating: row.rating, good: row.positive, concern: row.negative, fragrance: row.fragrance, finish: row.finish, useAgain: row.use_again, createdAt: row.created_at };
}

function stringValue(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function enumValue<T extends string>(value: unknown, options: readonly T[]) { return typeof value === "string" && options.includes(value as T) ? value as T : ""; }
function errorResponse(message: string, status: number) { return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } }); }
