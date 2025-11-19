import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/formatted-inputs";
import { toast } from "sonner";
import { Loader2, Calculator } from "lucide-react";

interface Step4Props {
  submissionId: number;
  onNext: () => void;
}

interface RetirementForm {
  estimatedRetirementAge: number;
  currentAge: number;
  desiredYearlyIncome: number;
  superannuation: number;
  savings: number;
  sharesBonds: number;
  equityNotHome: number;
  otherAssets: number;
}

export function Step4Retirement({ submissionId, onNext }: Step4Props) {
  const { register, handleSubmit, setValue, watch, control } = useForm<RetirementForm>();
  
  // Load existing data
  const { data: existingData, isLoading } = trpc.fna.getRetirementPlanning.useQuery({ 
    fnaSubmissionId: submissionId 
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingData) {
      setValue("estimatedRetirementAge", existingData.estimatedRetirementAge || 65);
      setValue("currentAge", existingData.currentAge || 30);
      setValue("desiredYearlyIncome", existingData.desiredYearlyIncome || 0);
      setValue("superannuation", existingData.superannuation || 0);
      setValue("savings", existingData.savings || 0);
      setValue("sharesBonds", existingData.sharesBonds || 0);
      setValue("equityNotHome", existingData.equityNotHome || 0);
      setValue("otherAssets", existingData.otherAssets || 0);
    }
  }, [existingData, setValue]);

  const saveMutation = trpc.fna.saveRetirementPlanning.useMutation({
    onSuccess: (data) => {
      toast.success("Retirement planning saved successfully");
      onNext();
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const onSubmit = (data: RetirementForm) => {
    saveMutation.mutate({
      fnaSubmissionId: submissionId,
      estimatedRetirementAge: Number(data.estimatedRetirementAge),
      currentAge: Number(data.currentAge),
      desiredYearlyIncome: Number(data.desiredYearlyIncome),
      superannuation: Number(data.superannuation),
      savings: Number(data.savings),
      sharesBonds: Number(data.sharesBonds),
      equityNotHome: Number(data.equityNotHome),
      otherAssets: Number(data.otherAssets),
    });
  };

  // Watch form values for live calculations
  const formValues = watch();
  const currentAge = Number(formValues.currentAge) || 0;
  const retirementAge = Number(formValues.estimatedRetirementAge) || 65;
  const yearlyIncome = Number(formValues.desiredYearlyIncome) || 0;
  const totalProvisions = 
    (Number(formValues.superannuation) || 0) +
    (Number(formValues.savings) || 0) +
    (Number(formValues.sharesBonds) || 0) +
    (Number(formValues.equityNotHome) || 0) +
    (Number(formValues.otherAssets) || 0);

  const yearsBeforeRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = Math.max(0, 85 - retirementAge);
  const totalRequired = yearlyIncome * yearsInRetirement;
  const shortfall = Math.max(0, totalRequired - totalProvisions);
  const yearlyNeeded = yearsBeforeRetirement > 0 ? shortfall / yearsBeforeRetirement : 0;
  const weeklyNeeded = yearlyNeeded / 52;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Customer Information
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currentAge">Current Age</Label>
            <Input
              id="currentAge"
              type="number"
              {...register("currentAge")}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedRetirementAge">Estimated Retirement Age</Label>
            <Input
              id="estimatedRetirementAge"
              type="number"
              {...register("estimatedRetirementAge")}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desiredYearlyIncome">Desired Yearly Income (in retirement)</Label>
            <Controller
              name="desiredYearlyIncome"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="$0"
                  className="h-11"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Current Retirement Provisions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Retirement Provisions</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="superannuation">Superannuation</Label>
            <Controller
              name="superannuation"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="$0"
                  className="h-11"
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="savings">Savings</Label>
            <Controller
              name="savings"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="$0"
                  className="h-11"
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sharesBonds">Shares/Bonds</Label>
            <Controller
              name="sharesBonds"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="$0"
                  className="h-11"
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="equityNotHome">Equity - Not in your Home</Label>
            <Controller
              name="equityNotHome"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="$0"
                  className="h-11"
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="otherAssets">Anything Else?</Label>
            <Controller
              name="otherAssets"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="$0"
                  className="h-11"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Calculated Results */}
      <Card className="bg-muted/50 p-6">
        <h3 className="text-lg font-semibold mb-4 text-primary">Retirement Projections</h3>
        <div className="grid gap-4 md:grid-cols-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Years Before Retirement:</span>
            <span className="font-semibold">{yearsBeforeRetirement}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Years in Retirement (to 85):</span>
            <span className="font-semibold">{yearsInRetirement}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Amount Required:</span>
            <span className="font-semibold">${totalRequired.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Provisions:</span>
            <span className="font-semibold">${totalProvisions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between col-span-2 pt-4 border-t">
            <span className="text-lg font-semibold text-destructive">Retirement Shortfall:</span>
            <span className="text-lg font-bold text-destructive">${shortfall.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Needed Yearly:</span>
            <span className="font-semibold">${Math.round(yearlyNeeded).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Needed Weekly:</span>
            <span className="font-semibold">${Math.round(weeklyNeeded).toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={saveMutation.isPending} className="gap-2">
          {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save & Continue
        </Button>
      </div>
    </form>
  );
}
