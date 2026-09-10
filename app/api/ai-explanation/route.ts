export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json(
    { error: "おすすめ理由はCare Hairの商品カード内で無料表示しています。" },
    { status: 410, headers: { "Cache-Control": "no-store" } }
  );
}
