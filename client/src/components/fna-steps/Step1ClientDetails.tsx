import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/formatted-inputs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Step1Props {
  submissionId: number;
  onNext: () => void;
}

interface ClientDetailsForm {
  clientName: string;
  clientManager: string;
  phone: string;
  email: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentLocation: string;
}

export function Step1ClientDetails({ submissionId, onNext }: Step1Props) {
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<ClientDetailsForm>({
    mode: "onBlur",
  });
  
  // Load existing data
  const { data: existingData, isLoading } = trpc.fna.getClientDetails.useQuery({ 
    fnaSubmissionId: submissionId 
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingData) {
      setValue("clientName", existingData.clientName || "");
      setValue("clientManager", existingData.clientManager || "");
      setValue("phone", existingData.phone || "");
      setValue("email", existingData.email || "");
      if (existingData.appointmentDate) {
        const date = new Date(existingData.appointmentDate);
        setValue("appointmentDate", date.toISOString().split('T')[0]);
      }
      setValue("appointmentTime", existingData.appointmentTime || "");
      setValue("appointmentLocation", existingData.appointmentLocation || "");
    }
  }, [existingData, setValue]);

  const saveMutation = trpc.fna.saveClientDetails.useMutation({
    onSuccess: () => {
      toast.success("Client details saved successfully");
      onNext();
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const onSubmit = (data: ClientDetailsForm) => {
    saveMutation.mutate({
      fnaSubmissionId: submissionId,
      clientName: data.clientName,
      clientManager: data.clientManager,
      phone: data.phone,
      email: data.email,
      appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : undefined,
      appointmentTime: data.appointmentTime,
      appointmentLocation: data.appointmentLocation,
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
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name(s) <span className="text-destructive">*</span></Label>
          <Input
            id="clientName"
            {...register("clientName", { required: "Client name is required" })}
            placeholder="Enter client name(s)"
            className="h-11"
          />
          {errors.clientName && (
            <p className="text-sm text-destructive">{errors.clientName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientManager">Client Manager</Label>
          <Input
            id="clientManager"
            {...register("clientManager")}
            placeholder="Enter client manager name"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone <span className="text-destructive">*</span></Label>
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Phone number is required" }}
            render={({ field }) => (
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                placeholder="(04) 1234 5678"
                className="h-11"
              />
            )}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            placeholder="Enter email address"
            className="h-11"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointmentDate">Date of Appointment</Label>
          <Input
            id="appointmentDate"
            type="date"
            {...register("appointmentDate")}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointmentTime">Time of Appointment</Label>
          <Input
            id="appointmentTime"
            type="time"
            {...register("appointmentTime")}
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointmentLocation">Appointment Location</Label>
        <Input
          id="appointmentLocation"
          {...register("appointmentLocation")}
          placeholder="Enter appointment location"
          className="h-11"
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
