import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { AdminDeleteButton } from "@/features/admin/admin-delete-button";
import { AdminReviewForm } from "@/features/admin/admin-review-form";
import { getDiagnosisRecord, getReview, getSignedDiagnosisImages, writeAuditLog } from "@/lib/server/admin-data";
import { requireAdminPage } from "@/lib/server/admin-auth";
import { isUuid } from "@/lib/server/http-security";

export const metadata: Metadata = { title: "診断データ詳細", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminDiagnosisPage({ params }: { params: { id: string } }) {
  const admin = await requireAdminPage();
  if (!isUuid(params.id)) notFound();
  const diagnosis = await getDiagnosisRecord(params.id);
  if (!diagnosis) notFound();
  await writeAuditLog(admin, "diagnosis.view", diagnosis.id, { imageCount: diagnosis.diagnosis_images.length });
  const images = await getSignedDiagnosisImages(diagnosis);
  const review = getReview(diagnosis);

  return (
    <main className="min-h-screen bg-soft pb-20 pt-[calc(var(--header-height)+2rem)]">
      <div className="mx-auto max-w-5xl px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-green"><ArrowLeft className="h-4 w-4" />一覧へ戻る</Link>
        <div className="mt-5 rounded-brand border border-line bg-white p-6 shadow-brand">
          <div className="flex items-center gap-2 text-green"><LockKeyhole className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.18em]">Private diagnosis</span></div>
          <h1 className="mt-2 break-all text-2xl font-semibold">{diagnosis.id}</h1>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <Data label="匿名ユーザーID" value={diagnosis.anonymous_user_id} mono />
            <Data label="診断日時" value={formatDate(diagnosis.created_at)} />
            <Data label="ロジックVersion" value={diagnosis.diagnosis_logic_version} />
            <Data label="AI学習利用同意" value={diagnosis.consent_ai_training ? `同意あり（${diagnosis.consent_version}）` : "同意なし"} />
            <Data label="未成年者への確認" value={diagnosis.guardian_confirmation ? "確認済み" : "未確認"} />
            <Data label="データ状態" value={diagnosis.data_status} />
          </dl>
        </div>

        <section className="mt-6 rounded-brand border border-line bg-white p-6 shadow-brand">
          <h2 className="text-xl font-semibold">髪の写真</h2>
          <p className="mt-2 text-xs text-muted">非公開バケットから、この画面の表示時に短時間だけ有効な署名付きURLを発行しています。</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {images.map((image) => <figure key={image.id} className="rounded-brand border border-line bg-soft p-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={image.signedUrl} alt={`髪の写真 ${image.direction}`} className="aspect-square w-full rounded-lg bg-white object-contain" /><figcaption className="mt-3 text-xs text-muted">方向: {image.direction} / {image.width}×{image.height}px / EXIF除去: {image.exif_removed ? "済" : "未確認"}</figcaption></figure>)}
            {images.length === 0 && <p className="text-sm text-muted">画像はありません。</p>}
          </div>
        </section>

        <section className="mt-6 rounded-brand border border-line bg-white p-6 shadow-brand">
          <h2 className="text-xl font-semibold">質問から算出した診断結果</h2>
          <p className="mt-2 text-xs text-muted">写真の解析結果は使用せず、ユーザーの質問回答だけから算出した結果です。</p>
          {diagnosis.result_snapshot ? (
            <div className="mt-5 grid gap-5">
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <ResultData label="髪の太さ・硬さ" value={diagnosis.result_snapshot.hairBody} />
                <ResultData label="くせ・うねり" value={diagnosis.result_snapshot.hairShape} />
                <ResultData label="頭皮傾向" value={diagnosis.result_snapshot.scalpState} />
                <ResultData label="コンディション" value={diagnosis.result_snapshot.condition} />
              </dl>
              <div className="rounded-brand bg-soft p-5">
                <p className="font-semibold">{diagnosis.result_snapshot.feature}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{diagnosis.result_snapshot.reason}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {diagnosis.result_snapshot.advices.map((advice) => (
                  <article key={advice.title} className="rounded-brand border border-line p-4">
                    <h3 className="font-semibold">{advice.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{advice.advice}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : <p className="mt-5 text-sm text-muted">質問への回答途中です。</p>}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-brand border border-line bg-white p-6 shadow-brand">
            <h2 className="text-xl font-semibold">元の質問回答</h2>
            <div className="mt-4 grid gap-3">
              {Object.entries(diagnosis.original_answers ?? {}).map(([questionId, answer]) => <div key={questionId} className="rounded-lg bg-soft p-4"><code className="text-xs font-semibold text-green">{questionId}</code><p className="mt-2 text-sm">{answer.selectedOptionLabels.join("、")}</p></div>)}
              {!diagnosis.original_answers && <p className="text-sm text-muted">質問への回答途中です。</p>}
            </div>
          </section>
          <section className="rounded-brand border border-line bg-white p-6 shadow-brand">
            <h2 className="text-xl font-semibold">質問から算出した元ラベル</h2>
            <p className="mt-2 text-xs text-muted">この値は管理者画面から変更できません。</p>
            <dl className="mt-4 grid gap-3">
              {Object.entries(diagnosis.original_labels ?? {}).map(([key,value]) => <div key={key} className="rounded-lg bg-soft p-4"><dt className="text-xs font-semibold text-green">{key}</dt><dd className="mt-1">{value}</dd></div>)}
              {!diagnosis.original_labels && <p className="text-sm text-muted">未判定です。</p>}
            </dl>
          </section>
        </div>

        <div className="mt-6"><AdminReviewForm diagnosisId={diagnosis.id} review={review} /></div>
        <section className="mt-6 rounded-brand border border-red-200 bg-white p-6"><h2 className="font-semibold text-red-800">危険な操作</h2><p className="mt-2 text-sm text-muted">画像と診断データを完全に削除します。操作履歴には削除を実行した管理者と対象IDだけが残ります。</p><div className="mt-5"><AdminDeleteButton diagnosisId={diagnosis.id} /></div></section>
      </div>
    </main>
  );
}

function Data({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) { return <div><dt className="text-xs font-semibold text-green">{label}</dt><dd className={`mt-1 break-all ${mono ? "font-mono text-xs" : ""}`}>{value}</dd></div>; }
function ResultData({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-secondary p-4"><dt className="text-xs font-semibold text-green">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "medium", timeZone: "Asia/Tokyo" }).format(new Date(value)); }
