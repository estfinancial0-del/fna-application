import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ProgressSidebarProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  completedSteps: number[]; // Array of step IDs that have data saved
}

export function ProgressSidebar({ currentStep, totalSteps, steps, completedSteps }: ProgressSidebarProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="hidden lg:block w-80 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
      </div>

      <nav className="space-y-1">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-colors",
                isCurrent && "bg-red-50 border border-red-200",
                isCompleted && "bg-gray-50",
                isUpcoming && "opacity-50"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  isCompleted && "bg-green-600 text-white",
                  isCurrent && "bg-red-600 text-white",
                  isUpcoming && "bg-gray-200 text-gray-600"
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-red-900",
                    isCompleted && "text-gray-900",
                    isUpcoming && "text-gray-600"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900 font-medium mb-1">Need Help?</p>
        <p className="text-xs text-blue-700">
          Contact your financial advisor if you have any questions while completing this form.
        </p>
      </div>
    </div>
  );
}
