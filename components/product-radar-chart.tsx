import type { Product } from "@/types/product";
import type { ScoreKey } from "@/types/diagnosis";
import { cn } from "@/lib/utils";

type RadarAxis = {
  label: string;
  keys: ScoreKey[];
};

const axes: RadarAxis[] = [
  { label: "軽さ", keys: ["airy", "volume", "fine"] },
  { label: "まとまり", keys: ["moist", "frizz"] },
  { label: "補修", keys: ["repair", "damage"] },
  { label: "頭皮", keys: ["scalp", "refresh"] },
  { label: "くせケア", keys: ["curly", "frizz"] },
  { label: "指通り", keys: ["smooth", "straight"] }
];

type ProductRadarChartProps = {
  product: Product;
  compact?: boolean;
  className?: string;
};

function axisValue(product: Product, keys: ScoreKey[]) {
  const max = Math.max(...keys.map((key) => product.scores[key] ?? 0), 0);
  return Math.min(100, Math.round((max / 7) * 100));
}

function point(index: number, value: number, radius = 64) {
  const angle = -Math.PI / 2 + (index / axes.length) * Math.PI * 2;
  const distance = radius * (value / 100);
  return {
    x: 90 + Math.cos(angle) * distance,
    y: 90 + Math.sin(angle) * distance
  };
}

function ringPoints(value: number) {
  return axes
    .map((_, index) => {
      const current = point(index, value);
      return `${current.x},${current.y}`;
    })
    .join(" ");
}

export function ProductRadarChart({ product, compact = false, className }: ProductRadarChartProps) {
  const values = axes.map((axis) => axisValue(product, axis.keys));
  const polygon = values
    .map((value, index) => {
      const current = point(index, value);
      return `${current.x},${current.y}`;
    })
    .join(" ");

  return (
    <div className={cn("rounded-brand border border-line bg-white", compact ? "p-3" : "p-5", className)}>
      {!compact && (
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">Performance</p>
          <h2 className="mt-2 text-2xl font-medium">性能バランス</h2>
        </div>
      )}
      <div className={cn("mx-auto", compact ? "max-w-[180px]" : "max-w-[320px]")}>
        <svg viewBox="0 0 180 180" role="img" aria-label={`${product.name}の性能バランスグラフ`} className="h-auto w-full">
          {[25, 50, 75, 100].map((value) => (
            <polygon key={value} points={ringPoints(value)} fill="none" stroke="#e8e5de" strokeWidth="1" />
          ))}
          {axes.map((axis, index) => {
            const outer = point(index, 108);
            const center = point(index, 100);
            return (
              <g key={axis.label}>
                <line x1="90" y1="90" x2={center.x} y2={center.y} stroke="#e8e5de" strokeWidth="1" />
                <text
                  x={outer.x}
                  y={outer.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={compact ? "fill-muted text-[9px]" : "fill-muted text-[10px]"}
                >
                  {axis.label}
                </text>
              </g>
            );
          })}
          <polygon points={polygon} fill="rgba(22, 55, 47, .18)" stroke="#16372f" strokeWidth="2" />
          {values.map((value, index) => {
            const current = point(index, value);
            return <circle key={`${axes[index].label}-${value}`} cx={current.x} cy={current.y} r="2.8" fill="#16372f" />;
          })}
        </svg>
      </div>
      {!compact && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted sm:grid-cols-3">
          {axes.map((axis, index) => (
            <div key={axis.label} className="rounded-brand bg-soft px-3 py-2">
              <span className="block text-xs">{axis.label}</span>
              <b className="text-green">{values[index]}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
