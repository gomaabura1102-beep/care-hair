import type { Metadata } from "next";
import Link from "next/link";
import { Download, Filter, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AdminLogoutButton } from "@/features/admin/admin-logout-button";
import { getRecentAuditLogs, getReview, listDiagnoses, type AdminFilters } from "@/lib/server/admin-data";
import { requireAdminPage } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "運営者マイページ", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type PageProps = { searchParams: AdminFilters & { query?: string } };

export default async function AdminPage({ searchParams }: PageProps) {
  const admin = await requireAdminPage();
  let diagnoses = await listDiagnoses(searchParams);
  if (searchParams.query) {
    const query = searchParams.query.toLowerCase();
    diagnoses = diagnoses.filter((item) => item.id.toLowerCase().includes(query) || item.anonymous_user_id.toLowerCase().includes(query));
  }
  const auditLogs = await getRecentAuditLogs();

  return (
    <main className="min-h-screen bg-soft pb-20 pt-[calc(var(--header-height)+2rem)]">
      <div className="mx-auto max-w-site px-4">
        <div className="flex flex-col gap-5 rounded-brand border border-line bg-white p-6 shadow-brand sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-green"><ShieldCheck className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.18em]">Admin only</span></div>
            <h1 className="mt-2 text-3xl font-semibold">運営者マイページ</h1>
            <p className="mt-2 text-sm text-muted">{admin.email} としてログイン中</p>
          </div>
          <AdminLogoutButton />
        </div>

        <form className="mt-6 rounded-brand border border-line bg-white p-6 shadow-brand">
          <div className="flex items-center gap-2"><Filter className="h-5 w-5 text-green" /><h2 className="font-semibold">検索・絞り込み</h2></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterInput name="query" label="診断ID・匿名ID" defaultValue={searchParams.query} />
            <FilterInput name="dateFrom" label="診断日（開始）" type="date" defaultValue={searchParams.dateFrom} />
            <FilterInput name="dateTo" label="診断日（終了）" type="date" defaultValue={searchParams.dateTo} />
            <FilterInput name="logicVersion" label="ロジックVersion" defaultValue={searchParams.logicVersion} placeholder="question-v1.0.0" />
            <FilterSelect name="label" label="髪質ラベル" defaultValue={searchParams.label} options={[["細毛・軟毛","細毛・軟毛"],["普通毛","普通毛"],["硬毛・剛毛","硬毛・剛毛"]]} />
            <FilterSelect name="consent" label="AI利用同意" defaultValue={searchParams.consent} options={[["yes","同意あり"],["no","同意なし"]]} />
            <FilterSelect name="image" label="画像" defaultValue={searchParams.image} options={[["yes","画像あり"],["no","画像なし"]]} />
            <FilterSelect name="direction" label="撮影方向" defaultValue={searchParams.direction} options={[["front","正面"],["side","横"],["back","後ろ"],["top","頭頂部"],["other","その他"]]} />
            <FilterSelect name="dataStatus" label="データ状態" defaultValue={searchParams.dataStatus} options={[["draft","回答途中"],["completed","診断完了"],["deletion_requested","削除処理中"]]} />
            <FilterSelect name="reviewStatus" label="確認状態" defaultValue={searchParams.reviewStatus} options={[["unreviewed","未確認"],["usable","使用可能"],["low_quality","画像品質が低い"],["label_review_needed","ラベル確認が必要"],["excluded","使用対象外"]]} />
            <FilterSelect name="datasetSplit" label="データ分類" defaultValue={searchParams.datasetSplit} options={[["unassigned","未分類"],["train","学習用"],["validation","検証用"],["test","テスト用"],["excluded","対象外"]]} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3"><button className={buttonVariants({ size: "sm" })}>絞り込む</button><Link href="/admin" className={buttonVariants({ variant: "outline", size: "sm" })}>リセット</Link></div>
        </form>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold">{diagnoses.length}件</p>
          <div className="flex flex-wrap gap-2">
            <a href="/api/admin/export?format=csv" className={buttonVariants({ variant: "outline", size: "sm" })}><Download className="h-4 w-4" />学習対象CSV</a>
            <a href="/api/admin/export?format=json" className={buttonVariants({ variant: "outline", size: "sm" })}><Download className="h-4 w-4" />学習対象JSON</a>
          </div>
        </div>
        <p className="mt-2 text-xs leading-6 text-muted">エクスポートには「同意あり・使用可能・学習/検証/テストに分類済み」のデータだけが含まれます。</p>

        <div className="mt-4 overflow-x-auto rounded-brand border border-line bg-white shadow-brand">
          <table className="min-w-[1050px] w-full text-left text-sm">
            <thead className="bg-secondary text-xs text-green"><tr><Th>診断日時</Th><Th>診断ID / 匿名ID</Th><Th>写真</Th><Th>診断結果</Th><Th>同意</Th><Th>確認状態</Th><Th>分類</Th><Th>Version</Th><Th></Th></tr></thead>
            <tbody>
              {diagnoses.map((diagnosis) => {
                const review = getReview(diagnosis);
                const firstImage = diagnosis.diagnosis_images[0];
                return (
                  <tr key={diagnosis.id} className="border-t border-line align-top">
                    <Td>{formatDate(diagnosis.created_at)}</Td>
                    <Td><code className="block text-xs">{diagnosis.id}</code><code className="mt-2 block text-[11px] text-muted">{diagnosis.anonymous_user_id}</code></Td>
                    <Td>
                      {firstImage ? (
                        <Link href={`/admin/diagnoses/${diagnosis.id}`} prefetch={false} className="block w-24">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`/api/admin/images/${firstImage.id}`} alt="診断時の髪" className="aspect-square w-24 rounded-lg border border-line bg-soft object-cover" />
                          <span className="mt-1 block text-[11px] text-muted">{diagnosis.diagnosis_images.length}枚 / {firstImage.direction}</span>
                        </Link>
                      ) : <span className="text-muted">画像なし</span>}
                    </Td>
                    <Td>
                      <strong>{diagnosis.original_labels?.hairBody ?? "回答途中"}</strong>
                      <span className="mt-1 block text-xs text-muted">{diagnosis.original_labels?.hairShape}</span>
                      <span className="block text-xs text-muted">{diagnosis.original_labels?.condition}</span>
                    </Td>
                    <Td>{diagnosis.consent_ai_training ? "あり" : "なし"}</Td>
                    <Td>{review?.review_status ?? "unreviewed"}</Td>
                    <Td>{review?.dataset_split ?? "unassigned"}</Td>
                    <Td>{diagnosis.diagnosis_logic_version}</Td>
                    <Td><Link href={`/admin/diagnoses/${diagnosis.id}`} prefetch={false} className="font-semibold text-green underline-offset-4 hover:underline">写真・結果を見る</Link></Td>
                  </tr>
                );
              })}
              {diagnoses.length === 0 && <tr><td colSpan={9} className="p-10 text-center text-muted">条件に合うデータはありません。</td></tr>}
            </tbody>
          </table>
        </div>

        <section className="mt-8 rounded-brand border border-line bg-white p-6 shadow-brand">
          <h2 className="text-xl font-semibold">最近の管理者操作</h2>
          <div className="mt-4 grid gap-2">
            {auditLogs.map((log) => <div key={log.id} className="grid gap-1 rounded-lg bg-soft px-4 py-3 text-sm sm:grid-cols-[180px_1fr_1.5fr]"><span className="text-muted">{formatDate(log.created_at)}</span><strong>{log.action}</strong><code className="break-all text-xs">{log.target_diagnosis_id ?? "dataset"}</code></div>)}
            {auditLogs.length === 0 && <p className="text-sm text-muted">操作履歴はまだありません。</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

function FilterInput({ name, label, defaultValue, type = "text", placeholder }: { name: string; label: string; defaultValue?: string; type?: string; placeholder?: string }) { return <label className="grid gap-2 text-xs font-semibold">{label}<input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className="min-h-11 rounded-brand border border-line px-3 text-sm font-normal outline-none focus:border-green" /></label>; }
function FilterSelect({ name, label, defaultValue, options }: { name: string; label: string; defaultValue?: string; options: string[][] }) { return <label className="grid gap-2 text-xs font-semibold">{label}<select name={name} defaultValue={defaultValue ?? ""} className="min-h-11 rounded-brand border border-line bg-white px-3 text-sm font-normal outline-none focus:border-green"><option value="">すべて</option>{options.map(([value,text]) => <option key={value} value={value}>{text}</option>)}</select></label>; }
function Th({ children }: { children?: React.ReactNode }) { return <th className="whitespace-nowrap px-4 py-3 font-semibold">{children}</th>; }
function Td({ children }: { children: React.ReactNode }) { return <td className="px-4 py-4">{children}</td>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("ja-JP", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value)); }
