import type { ScoreMap } from "@/types/diagnosis";

const labels: Partial<Record<keyof ScoreMap, string>> = {
  fine: "細毛",
  normal: "普通毛",
  coarse: "硬毛",
  curly: "癖",
  dry: "乾燥",
  damage: "ダメージ",
  scalp: "頭皮",
  frizz: "広がり",
  volume: "ボリューム"
};

export function ScoreBars({ scores }: { scores: ScoreMap }) {
  const max = Math.max(...Object.values(scores), 1);

  return (
    <div className="mt-8 grid gap-3">
      {Object.entries(labels).map(([key, label]) => {
        const value = scores[key as keyof ScoreMap];

        return (
          <div key={key} className="grid grid-cols-[92px_1fr_32px] items-center gap-3 text-sm">
            <span>{label}</span>
            <span className="h-2 overflow-hidden rounded-full bg-line">
              <span className="block h-full rounded-full bg-green" style={{ width: `${(value / max) * 100}%` }} />
            </span>
            <span className="text-right text-muted">{value}</span>
          </div>
        );
      })}
    </div>
  );
}
