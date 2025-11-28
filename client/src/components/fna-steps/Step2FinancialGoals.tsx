import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Mic } from "lucide-react";
import { AudioRecorder } from "@/components/ui/audio-recorder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Step2Props {
  submissionId: number;
  onNext: () => void;
}

type Priority = "important" | "interested" | "not_important";

interface FinancialGoalsForm {
  // Wealth Creation
  saveForGoal?: Priority;
  payOffDebt?: Priority;
  reduceTax?: Priority;
  salaryPackaging?: Priority;
  superControl?: Priority;
  investMoney?: Priority;
  investShares?: Priority;
  investProperty?: Priority;
  retirementPlanning?: Priority;
  centrelinkBenefits?: Priority;
  moneyLastLonger?: Priority;
  // Wealth Protection
  familySecure?: Priority;
  manageSickness?: Priority;
  inheritance?: Priority;
  employmentChange?: Priority;
  recentEvent?: Priority;
  familyChange?: Priority;
}

const wealthCreationGoals = [
  { id: "saveForGoal", label: "I need to save more money for a specific goal (e.g. a house, car or child(ren)'s education)" },
  { id: "payOffDebt", label: "I am interested in paying off my personal debts more quickly" },
  { id: "reduceTax", label: "I would like to reduce the amount of tax I currently pay" },
  { id: "salaryPackaging", label: "I would like to know if I am packaging my salary effectively" },
  { id: "superControl", label: "I would like to take more control of my superannuation" },
  { id: "investMoney", label: "I would like to know how to best invest my money" },
  { id: "investShares", label: "I would like to consider an investment in shares/managed funds" },
  { id: "investProperty", label: "I would like to consider an investment in property" },
  { id: "retirementPlanning", label: "I want to start planning for a financially secure retirement" },
  { id: "centrelinkBenefits", label: "I want to know more about Centrelink benefits" },
  { id: "moneyLastLonger", label: "I would like to make my money last longer in retirement" },
];

const wealthProtectionGoals = [
  { id: "familySecure", label: "I want to ensure my family is financially secure if I die or suffer a serious illness" },
  { id: "manageSickness", label: "I am unsure how I will manage financially if I am sick for a prolonged period" },
  { id: "inheritance", label: "I want to ensure the right people will inherit my assets when I die" },
  { id: "employmentChange", label: "My employment status has recently changed, or is changing soon" },
  { id: "recentEvent", label: "A recent event has prompted me to seek financial advice" },
  { id: "familyChange", label: "My family situation has recently changed, or is about to change" },
];

function PrioritySelector({ name, value, onChange }: { name: string; value?: Priority; onChange: (value: Priority) => void }) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="important" id={`${name}-important`} />
        <Label htmlFor={`${name}-important`} className="font-normal cursor-pointer">
          Important
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="interested" id={`${name}-interested`} />
        <Label htmlFor={`${name}-interested`} className="font-normal cursor-pointer">
          Interested
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="not_important" id={`${name}-not-important`} />
        <Label htmlFor={`${name}-not-important`} className="font-normal cursor-pointer">
          Not Important
        </Label>
      </div>
    </RadioGroup>
  );
}

export function Step2FinancialGoals({ submissionId, onNext }: Step2Props) {
  const { watch, setValue } = useForm<FinancialGoalsForm>();
  
  // Load existing data
  const { data: wealthCreation, isLoading: loadingCreation } = trpc.fna.getWealthCreationGoals.useQuery({ 
    fnaSubmissionId: submissionId 
  });
  const { data: wealthProtection, isLoading: loadingProtection } = trpc.fna.getWealthProtectionGoals.useQuery({ 
    fnaSubmissionId: submissionId 
  });

  // Populate form with existing data
  useEffect(() => {
    if (wealthCreation) {
      Object.keys(wealthCreation).forEach((key) => {
        if (key !== 'id' && key !== 'fnaSubmissionId') {
          setValue(key as keyof FinancialGoalsForm, wealthCreation[key as keyof typeof wealthCreation] as Priority);
        }
      });
    }
    if (wealthProtection) {
      Object.keys(wealthProtection).forEach((key) => {
        if (key !== 'id' && key !== 'fnaSubmissionId') {
          setValue(key as keyof FinancialGoalsForm, wealthProtection[key as keyof typeof wealthProtection] as Priority);
        }
      });
    }
  }, [wealthCreation, wealthProtection, setValue]);

  const saveCreationMutation = trpc.fna.saveWealthCreationGoals.useMutation();
  const saveProtectionMutation = trpc.fna.saveWealthProtectionGoals.useMutation();

  const handleSave = async () => {
    const formData = watch();
    
    try {
      await saveCreationMutation.mutateAsync({
        fnaSubmissionId: submissionId,
        saveForGoal: formData.saveForGoal,
        payOffDebt: formData.payOffDebt,
        reduceTax: formData.reduceTax,
        salaryPackaging: formData.salaryPackaging,
        superControl: formData.superControl,
        investMoney: formData.investMoney,
        investShares: formData.investShares,
        investProperty: formData.investProperty,
        retirementPlanning: formData.retirementPlanning,
        centrelinkBenefits: formData.centrelinkBenefits,
        moneyLastLonger: formData.moneyLastLonger,
      });

      await saveProtectionMutation.mutateAsync({
        fnaSubmissionId: submissionId,
        familySecure: formData.familySecure,
        manageSickness: formData.manageSickness,
        inheritance: formData.inheritance,
        employmentChange: formData.employmentChange,
        recentEvent: formData.recentEvent,
        familyChange: formData.familyChange,
      });

      toast.success("Financial goals saved successfully");
      onNext();
    } catch (error: any) {
      toast.error(`Failed to save: ${error.message}`);
    }
  };

  if (loadingCreation || loadingProtection) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Getting to Know You - Audio Recording */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Getting to Know You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Tell us more about yourself and your financial goals. Record a voice message to help us understand your situation better.
          </p>
          <AudioRecorder
            onRecordingComplete={(blob, url) => {
              // TODO: Save audio recording to database
              console.log("Recording completed:", { blob, url });
            }}
            maxDuration={300}
          />
        </CardContent>
      </Card>

      {/* Wealth Creation Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">Wealth Creation</h3>
        <div className="space-y-4">
          {wealthCreationGoals.map((goal) => (
            <div key={goal.id} className="border-b pb-4 last:border-0">
              <p className="text-sm mb-3 text-foreground">{goal.label}</p>
              <PrioritySelector
                name={goal.id}
                value={watch(goal.id as keyof FinancialGoalsForm)}
                onChange={(value) => setValue(goal.id as keyof FinancialGoalsForm, value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Wealth Protection Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">Wealth Protection</h3>
        <div className="space-y-4">
          {wealthProtectionGoals.map((goal) => (
            <div key={goal.id} className="border-b pb-4 last:border-0">
              <p className="text-sm mb-3 text-foreground">{goal.label}</p>
              <PrioritySelector
                name={goal.id}
                value={watch(goal.id as keyof FinancialGoalsForm)}
                onChange={(value) => setValue(goal.id as keyof FinancialGoalsForm, value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSave} 
          disabled={saveCreationMutation.isPending || saveProtectionMutation.isPending}
          className="gap-2"
        >
          {(saveCreationMutation.isPending || saveProtectionMutation.isPending) && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
