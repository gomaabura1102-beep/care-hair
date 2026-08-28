import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { number: 1, label: "写真" },
  { number: 2, label: "質問" },
  { number: 3, label: "診断結果" }
] as const;

export function DiagnosisSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="mb-7 rounded-brand border border-line bg-white/95 px-4 py-4 shadow-brand" aria-label="診断ステップ">
      <ol className="grid grid-cols-3 gap-2">
        {steps.map((step) => {
          const completed = step.number < current;
          const active = step.number === current;
          return (
            <li key={step.number} className={cn("text-center text-xs sm:text-sm", active ? "font-bold text-green" : "text-muted")}>
              <span
                className={cn(
                  "mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full border",
                  completed && "border-green bg-green text-white",
                  active && "border-green bg-secondary text-green",
                  step.number > current && "border-line bg-soft"
                )}
              >
                {completed ? <Check className="h-4 w-4" /> : step.number}
              </span>
              {step.number} / 3 {step.label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
