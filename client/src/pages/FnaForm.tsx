import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { FnaWizard } from "@/components/FnaWizard";
import { Step1ClientDetails } from "@/components/fna-steps/Step1ClientDetails";
import { Step2PaymentAgreement } from "@/components/fna-steps/Step2PaymentAgreement";
import { Step2FinancialGoals } from "@/components/fna-steps/Step2FinancialGoals";
import { Step3Lifestyle } from "@/components/fna-steps/Step3Lifestyle";
import { Step4Retirement } from "@/components/fna-steps/Step4Retirement";
import { Step5PersonalDetails } from "@/components/fna-steps/Step5PersonalDetails";
import { Step6Assets } from "@/components/fna-steps/Step6Assets";
import { Step7SelfEmployment } from "@/components/fna-steps/Step7SelfEmployment";
import { Step8Expenses } from "@/components/fna-steps/Step8Expenses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function FnaForm() {
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [submissionId, setSubmissionId] = useState<number | null>(null);

  // Create a new submission when component mounts
  const createSubmissionMutation = trpc.fna.createSubmission.useMutation({
    onSuccess: (data) => {
      setSubmissionId(data.id);
    },
    onError: (error) => {
      toast.error(`Failed to create submission: ${error.message}`);
    },
  });

  // Authentication is handled by useAuth hook with redirectOnUnauthenticated

  useEffect(() => {
    if (user && !submissionId) {
      createSubmissionMutation.mutate();
    }
  }, [user]);

  const submitFnaMutation = trpc.fna.submitFna.useMutation({
    onSuccess: () => {
      toast.success("FNA submitted successfully!");
      setLocation(`/fna/success?id=${submissionId}`);
    },
    onError: (error) => {
      toast.error(`Failed to submit: ${error.message}`);
    },
  });

  const handleComplete = () => {
    if (submissionId) {
      submitFnaMutation.mutate({ submissionId });
    }
  };

  if (authLoading || createSubmissionMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Preparing your FNA form...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (!submissionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Failed to initialize FNA form</p>
          <Button onClick={() => createSubmissionMutation.mutate()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const wizardSteps = [
    {
      id: "client-details",
      title: "Client & Appointment Details",
      description: "Let's start with your basic information and appointment details",
      component: Step1ClientDetails,
    },
    {
      id: "payment-agreement",
      title: "Payment & Agreement",
      description: "Payment information and appointment acknowledgment",
      component: Step2PaymentAgreement,
    },
    {
      id: "financial-goals",
      title: "Financial Goals",
      description: "Help us understand your wealth creation and protection priorities",
      component: Step2FinancialGoals,
    },
    {
      id: "lifestyle",
      title: "Lifestyle & Aspirations",
      description: "Tell us about what matters most to you and your future plans",
      component: Step3Lifestyle,
    },
    {
      id: "retirement",
      title: "Retirement Planning",
      description: "Let's calculate your retirement needs and identify any shortfalls",
      component: Step4Retirement,
    },
    {
      id: "personal-details",
      title: "Personal Details",
      description: "Provide detailed personal information for up to 2 clients",
      component: Step5PersonalDetails,
    },
    {
      id: "assets-liabilities",
      title: "Assets & Liabilities",
      description: "List your assets, debts, and financial obligations",
      component: Step6Assets,
    },
    {
      id: "self-employment",
      title: "Self-Employment Information",
      description: "Provide details about your business if self-employed",
      component: Step7SelfEmployment,
    },
    {
      id: "annual-expenses",
      title: "Annual Expenses",
      description: "Track your regular expenses and spending patterns",
      component: Step8Expenses,
    },
  ];

  return <FnaWizard steps={wizardSteps} submissionId={submissionId} onComplete={handleComplete} />;
}
