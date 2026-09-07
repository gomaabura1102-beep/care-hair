import type { ScoreMap } from "@/types/diagnosis";

const bars = [
  { label: "乾燥", value: (scores: ScoreMap) => scores.dry, ceiling: 15 },
  { label: "広がり", value: (scores: ScoreMap) => scores.frizz + Math.round(scores.curly / 2), ceiling: 14 },
  { label: "ダメージ", value: (scores: ScoreMap) => scores.damage, ceiling: 18 },
  { label: "頭皮負担", value: (scores: ScoreMap) => scores.scalp + Math.round(scores.oily / 2), ceiling: 12 }
] as const;

export function ScoreBars({ scores }: { scores: ScoreMap }) {
  return (
    <div className="mt-8 grid gap-4">
      <p className="text-xs leading-6 text-muted">回答傾向を5段階で表示しています。医療的な判定ではありません。</p>
      {bars.map((bar) => {
        const level = Math.max(1, Math.min(5, Math.ceil((bar.value(scores) / bar.ceiling) * 5)));
        return (
          <div key={bar.label} className="grid grid-cols-[76px_1fr_30px] items-center gap-3 text-sm">
            <span>{bar.label}</span>
            <span className="grid grid-cols-5 gap-1.5" aria-label={`${bar.label} 5段階中${level}`}>
              {[1, 2, 3, 4, 5].map((step) => (
                <span key={step} className={`h-2.5 rounded-full ${step <= level ? "bg-green" : "bg-line"}`} />
              ))}
            </span>
            <span className="text-right font-semibold text-green">{level}</span>
          </div>
        );
      })}
    </div>
  );
}
