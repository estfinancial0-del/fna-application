import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CurrencyInput, PhoneInput, ABNInput } from "@/components/ui/formatted-inputs";
import { toast } from "sonner";
import { Loader2, Building2 } from "lucide-react";

interface Step7Props {
  submissionId: number;
  onNext: () => void;
}

interface SelfEmploymentForm {
  businessStructure: string;
  businessName: string;
  abn: string;
  taxYear1: string;
  taxYear1Completed: boolean;
  taxYear2: string;
  taxYear2Completed: boolean;
  furtherInfo: string;
  grossTurnover1: number;
  grossTurnover2: number;
  lessExpenses1: number;
  lessExpenses2: number;
  netProfitLoss1: number;
  netProfitLoss2: number;
  taxableIncome1: number;
  taxableIncome2: number;
  interest1: number;
  interest2: number;
  depreciation1: number;
  depreciation2: number;
  superannuation1: number;
  superannuation2: number;
  accountantName: string;
  accountantPhone: string;
  accountantFirm: string;
  accountantEmail: string;
}

export function Step7SelfEmployment({ submissionId, onNext }: Step7Props) {
  const [isSelfEmployed, setIsSelfEmployed] = useState<boolean | null>(null);
  const { register, handleSubmit, setValue, watch, control } = useForm<SelfEmploymentForm>();
  
  // Load existing data
  const { data: existingData, isLoading } = trpc.fna.getSelfEmploymentInfo.useQuery({ 
    fnaSubmissionId: submissionId 
  });

  // If existing data exists, user must be self-employed
  useEffect(() => {
    if (existingData && existingData.businessName) {
      setIsSelfEmployed(true);
    }
  }, [existingData]);

  // Populate form with existing data
  useEffect(() => {
    if (existingData) {
      Object.keys(existingData).forEach((key) => {
        if (key !== 'id' && key !== 'fnaSubmissionId') {
          setValue(key as keyof SelfEmploymentForm, existingData[key as keyof typeof existingData] as any);
        }
      });
    }
  }, [existingData, setValue]);

  const saveMutation = trpc.fna.saveSelfEmploymentInfo.useMutation({
    onSuccess: () => {
      toast.success("Self-employment information saved successfully");
      onNext();
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const onSubmit = (data: SelfEmploymentForm) => {
    saveMutation.mutate({
      fnaSubmissionId: submissionId,
      businessStructure: data.businessStructure,
      businessName: data.businessName,
      abn: data.abn,
      taxYear1: data.taxYear1,
      taxYear1Completed: data.taxYear1Completed,
      taxYear2: data.taxYear2,
      taxYear2Completed: data.taxYear2Completed,
      furtherInfo: data.furtherInfo,
      grossTurnover1: Number(data.grossTurnover1) || undefined,
      grossTurnover2: Number(data.grossTurnover2) || undefined,
      lessExpenses1: Number(data.lessExpenses1) || undefined,
      lessExpenses2: Number(data.lessExpenses2) || undefined,
      netProfitLoss1: Number(data.netProfitLoss1) || undefined,
      netProfitLoss2: Number(data.netProfitLoss2) || undefined,
      taxableIncome1: Number(data.taxableIncome1) || undefined,
      taxableIncome2: Number(data.taxableIncome2) || undefined,
      interest1: Number(data.interest1) || undefined,
      interest2: Number(data.interest2) || undefined,
      depreciation1: Number(data.depreciation1) || undefined,
      depreciation2: Number(data.depreciation2) || undefined,
      superannuation1: Number(data.superannuation1) || undefined,
      superannuation2: Number(data.superannuation2) || undefined,
      accountantName: data.accountantName,
      accountantPhone: data.accountantPhone,
      accountantFirm: data.accountantFirm,
      accountantEmail: data.accountantEmail,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user hasn't answered the self-employment question yet
  if (isSelfEmployed === null) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Self-Employment Information</h3>
          <p className="text-muted-foreground mb-8">
            Are you or your partner self-employed or operating a business?
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              type="button"
              size="lg"
              onClick={() => setIsSelfEmployed(true)}
              className="min-w-32"
            >
              Yes
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => {
                setIsSelfEmployed(false);
                // Skip this step
                toast.success("Self-employment section skipped");
                setTimeout(() => onNext(), 500);
              }}
              className="min-w-32"
            >
              No
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If user selected "No", this shouldn't render (already moved to next step)
  if (!isSelfEmployed) {
    return null;
  }

  // Show full self-employment form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Business Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Business Information
        </h3>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessStructure">Business Structure</Label>
              <Input
                {...register("businessStructure")}
                placeholder="Sole Trader/Partnership/Company/Trust"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                {...register("businessName")}
                placeholder="Enter business name"
                className="h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="abn">ABN</Label>
            <Controller
              name="abn"
              control={control}
              render={({ field }) => (
                <ABNInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="12 345 678 901"
                  className="h-11"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Tax Years */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Tax Years</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="taxYear1">Tax Year 1</Label>
            <Input
              {...register("taxYear1")}
              placeholder="e.g., 2023-2024"
              className="h-11"
            />
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="taxYear1Completed"
                checked={watch("taxYear1Completed")}
                onCheckedChange={(checked) => setValue("taxYear1Completed", checked as boolean)}
              />
              <Label htmlFor="taxYear1Completed" className="font-normal cursor-pointer">
                Tax return completed
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxYear2">Tax Year 2</Label>
            <Input
              {...register("taxYear2")}
              placeholder="e.g., 2022-2023"
              className="h-11"
            />
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="taxYear2Completed"
                checked={watch("taxYear2Completed")}
                onCheckedChange={(checked) => setValue("taxYear2Completed", checked as boolean)}
              />
              <Label htmlFor="taxYear2Completed" className="font-normal cursor-pointer">
                Tax return completed
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Information - Year 1 vs Year 2 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium">Item</th>
                <th className="text-right py-3 px-2 font-medium">Year 1</th>
                <th className="text-right py-3 px-2 font-medium">Year 2</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3 px-2">Gross Turnover</td>
                <td className="py-3 px-2">
                  <Controller
                    name="grossTurnover1"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
                <td className="py-3 px-2">
                  <Controller
                    name="grossTurnover2"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-2">Less Expenses</td>
                <td className="py-3 px-2">
                  <Controller
                    name="lessExpenses1"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
                <td className="py-3 px-2">
                  <Controller
                    name="lessExpenses2"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-2 font-semibold">Net Profit/Loss</td>
                <td className="py-3 px-2">
                  <Controller
                    name="netProfitLoss1"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
                <td className="py-3 px-2">
                  <Controller
                    name="netProfitLoss2"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-2">Taxable Income</td>
                <td className="py-3 px-2">
                  <Controller
                    name="taxableIncome1"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
                <td className="py-3 px-2">
                  <Controller
                    name="taxableIncome2"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-2">Interest</td>
                <td className="py-3 px-2">
                  <Controller
                    name="interest1"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
                <td className="py-3 px-2">
                  <Controller
                    name="interest2"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-2">Depreciation</td>
                <td className="py-3 px-2">
                  <Controller
                    name="depreciation1"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
                <td className="py-3 px-2">
                  <Controller
                    name="depreciation2"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-2">Superannuation</td>
                <td className="py-3 px-2">
                  <Controller
                    name="superannuation1"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
                <td className="py-3 px-2">
                  <Controller
                    name="superannuation2"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="$0" className="h-10 text-right" />
                    )}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Further Information */}
      <div className="space-y-2">
        <Label htmlFor="furtherInfo">Further Information</Label>
        <Textarea
          {...register("furtherInfo")}
          placeholder="Any additional information about your business..."
          className="min-h-24 resize-y"
        />
      </div>

      {/* Accountant Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Accountant Details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="accountantName">Accountant Name</Label>
            <Input
              {...register("accountantName")}
              placeholder="Full name"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountantPhone">Phone</Label>
            <Controller
              name="accountantPhone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Phone number"
                  className="h-11"
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountantFirm">Firm Name</Label>
            <Input
              {...register("accountantFirm")}
              placeholder="Accounting firm"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountantEmail">Email</Label>
            <Input
              type="email"
              {...register("accountantEmail")}
              placeholder="Email address"
              className="h-11"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={saveMutation.isPending} className="gap-2">
          {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save & Continue
        </Button>
      </div>
    </form>
  );
}
