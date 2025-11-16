import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: {
    label: string;
    completed: boolean;
  }[];
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  steps,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center"
            style={{ flex: index < totalSteps - 1 ? 1 : 0 }}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all",
                  step.completed
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === index + 1
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted-foreground/30 bg-muted text-muted-foreground"
                )}
              >
                {step.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  step.completed || currentStep === index + 1
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "h-[2px] flex-1 mx-4 transition-all",
                  step.completed ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
