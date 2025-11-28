import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { ProgressSidebar } from "@/components/ProgressSidebar";
import { trpc } from "@/lib/trpc";
import { APP_LOGO } from "@/const";

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

interface FnaWizardProps {
  steps: WizardStep[];
  submissionId: number;
  onComplete: () => void;
}

export function FnaWizard({ steps, submissionId, onComplete }: FnaWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Check which steps have data
  const { data: clientDetails } = trpc.fna.getClientDetails.useQuery({ fnaSubmissionId: submissionId });
  const { data: wealthCreation } = trpc.fna.getWealthCreationGoals.useQuery({ fnaSubmissionId: submissionId });
  const { data: lifestyle } = trpc.fna.getLifestyleAspirations.useQuery({ fnaSubmissionId: submissionId });
  const { data: retirement } = trpc.fna.getRetirementPlanning.useQuery({ fnaSubmissionId: submissionId });
  const { data: personalDetails1 } = trpc.fna.getPersonalDetails.useQuery({ fnaSubmissionId: submissionId, clientNumber: 1 });
  const { data: assets } = trpc.fna.getAssetsLiabilities.useQuery({ fnaSubmissionId: submissionId });
  const { data: selfEmployment } = trpc.fna.getSelfEmploymentInfo.useQuery({ fnaSubmissionId: submissionId });
  const { data: expenses } = trpc.fna.getAnnualExpenses.useQuery({ fnaSubmissionId: submissionId });

  // Update completed steps based on data existence
  useEffect(() => {
    const completed: number[] = [];
    if (clientDetails && clientDetails.clientName) completed.push(1);
    if (wealthCreation) completed.push(2);
    if (lifestyle) completed.push(3);
    if (retirement) completed.push(4);
    if (personalDetails1) completed.push(5);
    if (assets && assets.length > 0) completed.push(6);
    if (selfEmployment) completed.push(7);
    if (expenses && expenses.length > 0) completed.push(8);
    setCompletedSteps(completed);
  }, [clientDetails, wealthCreation, lifestyle, retirement, personalDetails1, assets, selfEmployment, expenses]);

  const sidebarSteps = steps.map((step, index) => ({
    id: index + 1,
    title: step.title,
    description: step.description,
  }));

  const goToNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const StepComponent = currentStep.component;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <ProgressSidebar 
        currentStep={currentStepIndex + 1} 
        totalSteps={steps.length} 
        steps={sidebarSteps}
        completedSteps={completedSteps}
      />
      <div className="flex-1">
      {/* Header with Progress */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <img src={APP_LOGO} alt="EST Financial" className="h-10" />
                <h1 className="text-2xl font-bold text-foreground">Financial Needs Analysis</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}: {currentStep.title}
              </p>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
              <CardDescription className="text-base">{currentStep.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <StepComponent submissionId={submissionId} onNext={goToNext} />
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentStepIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>

              {currentStepIndex < steps.length - 1 ? (
                <Button onClick={goToNext} className="gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={onComplete} className="gap-2">
                  Submit FNA
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStepIndex
                    ? "w-8 bg-primary"
                    : index < currentStepIndex
                    ? "w-2 bg-primary/60"
                    : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to ${step.title}`}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
