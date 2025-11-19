import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Step3Props {
  submissionId: number;
  onNext: () => void;
}

interface LifestyleForm {
  importantThings: string;
  whyImportant: string;
  currentConcerns: string;
  mustChange: string;
  wantToChange: string;
  financialDreams: string;
  hobbiesActivities: string;
}

export function Step3Lifestyle({ submissionId, onNext }: Step3Props) {
  const { register, handleSubmit, setValue } = useForm<LifestyleForm>();
  
  // Load existing data
  const { data: existingData, isLoading } = trpc.fna.getLifestyleAspirations.useQuery({ 
    fnaSubmissionId: submissionId 
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingData) {
      setValue("importantThings", existingData.importantThings || "");
      setValue("whyImportant", existingData.whyImportant || "");
      setValue("currentConcerns", existingData.currentConcerns || "");
      setValue("mustChange", existingData.mustChange || "");
      setValue("wantToChange", existingData.wantToChange || "");
      setValue("financialDreams", existingData.financialDreams || "");
      setValue("hobbiesActivities", existingData.hobbiesActivities || "");
    }
  }, [existingData, setValue]);

  const saveMutation = trpc.fna.saveLifestyleAspirations.useMutation({
    onSuccess: () => {
      toast.success("Lifestyle information saved successfully");
      onNext();
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const onSubmit = (data: LifestyleForm) => {
    saveMutation.mutate({
      fnaSubmissionId: submissionId,
      ...data,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="importantThings">
          What are the most important things in your life at the moment?
        </Label>
        <p className="text-sm text-muted-foreground">
          (e.g., family, assets, job, reliable income, holidays, second property)
        </p>
        <Textarea
          id="importantThings"
          {...register("importantThings")}
          placeholder="Share what matters most to you..."
          className="min-h-24 resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whyImportant">Why are they important to you?</Label>
        <Textarea
          id="whyImportant"
          {...register("whyImportant")}
          placeholder="Tell us why these things are important..."
          className="min-h-24 resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentConcerns">Do you have any concerns about your current situation?</Label>
        <Textarea
          id="currentConcerns"
          {...register("currentConcerns")}
          placeholder="Share any concerns you may have..."
          className="min-h-24 resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mustChange" className="text-primary font-semibold">
          What would you like to change about your financial situation or lifestyle? What must change?
        </Label>
        <Textarea
          id="mustChange"
          {...register("mustChange")}
          placeholder="What needs to change?"
          className="min-h-24 resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wantToChange">What do you want to change?</Label>
        <Textarea
          id="wantToChange"
          {...register("wantToChange")}
          placeholder="What would you like to change?"
          className="min-h-24 resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="financialDreams">What are your financial dreams/aspirations?</Label>
        <Textarea
          id="financialDreams"
          {...register("financialDreams")}
          placeholder="Share your financial goals and dreams..."
          className="min-h-24 resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hobbiesActivities">
          What activities do you enjoy; e.g. any hobbies; sports; travel?
        </Label>
        <Textarea
          id="hobbiesActivities"
          {...register("hobbiesActivities")}
          placeholder="Tell us about your hobbies and interests..."
          className="min-h-24 resize-y"
        />
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
