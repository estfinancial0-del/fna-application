import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/formatted-inputs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Step1Props {
  submissionId: number;
  onNext: () => void;
}

interface ClientDetailsForm {
  // Client 1
  client1Name: string;
  client1Phone: string;
  client1Email: string;
  // Client 2
  client2Name: string;
  client2Phone: string;
  client2Email: string;
  // Shared fields
  clientManager: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentLocation: string;
}

const CLIENT_MANAGERS = ["Jim Calagis", "Umar Khan"];

export function Step1ClientDetails({ submissionId, onNext }: Step1Props) {
  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm<ClientDetailsForm>({
    mode: "onBlur",
  });
  
  const [hasClient2, setHasClient2] = useState(false);
  
  // Load existing data
  const { data: existingData, isLoading } = trpc.fna.getClientDetails.useQuery({ 
    fnaSubmissionId: submissionId 
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingData) {
      // Parse client names if stored as comma-separated
      const clientNames = existingData.clientName?.split(',').map(n => n.trim()) || [];
      setValue("client1Name", clientNames[0] || "");
      setValue("client2Name", clientNames[1] || "");
      
      // Parse phone numbers if stored as comma-separated
      const phones = existingData.phone?.split(',').map(p => p.trim()) || [];
      setValue("client1Phone", phones[0] || "");
      setValue("client2Phone", phones[1] || "");
      
      // Parse emails if stored as comma-separated
      const emails = existingData.email?.split(',').map(e => e.trim()) || [];
      setValue("client1Email", emails[0] || "");
      setValue("client2Email", emails[1] || "");
      
      // Check if there's a second client
      if (clientNames[1] || phones[1] || emails[1]) {
        setHasClient2(true);
      }
      
      setValue("clientManager", existingData.clientManager || "");
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
    // Combine client names, phones, and emails
    const clientNames = hasClient2 && data.client2Name
      ? `${data.client1Name}, ${data.client2Name}`
      : data.client1Name;
    
    const phones = hasClient2 && data.client2Phone
      ? `${data.client1Phone}, ${data.client2Phone}`
      : data.client1Phone;
    
    const emails = hasClient2 && data.client2Email
      ? `${data.client1Email}, ${data.client2Email}`
      : data.client1Email;

    saveMutation.mutate({
      fnaSubmissionId: submissionId,
      clientName: clientNames,
      clientManager: data.clientManager,
      phone: phones,
      email: emails,
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
      {/* Client 1 Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client 1 Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="client1Name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="client1Name"
                {...register("client1Name", { required: "Client 1 name is required" })}
                placeholder="Enter full name"
                className="h-11"
              />
              {errors.client1Name && (
                <p className="text-sm text-destructive">{errors.client1Name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client1Phone">Phone <span className="text-destructive">*</span></Label>
              <Controller
                name="client1Phone"
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
              {errors.client1Phone && (
                <p className="text-sm text-destructive">{errors.client1Phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client1Email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="client1Email"
                type="email"
                {...register("client1Email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder="Enter email address"
                className="h-11"
              />
              {errors.client1Email && (
                <p className="text-sm text-destructive">{errors.client1Email.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Client 2 Button */}
      {!hasClient2 && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setHasClient2(true)}
            className="gap-2"
          >
            + Add Second Client
          </Button>
        </div>
      )}

      {/* Client 2 Section */}
      {hasClient2 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Client 2 Information</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setHasClient2(false);
                setValue("client2Name", "");
                setValue("client2Phone", "");
                setValue("client2Email", "");
              }}
              className="text-destructive hover:text-destructive"
            >
              Remove
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="client2Name">Full Name</Label>
                <Input
                  id="client2Name"
                  {...register("client2Name")}
                  placeholder="Enter full name"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client2Phone">Phone</Label>
                <Controller
                  name="client2Phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="(04) 1234 5678"
                      className="h-11"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client2Email">Email</Label>
                <Input
                  id="client2Email"
                  type="email"
                  {...register("client2Email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  placeholder="Enter email address"
                  className="h-11"
                />
                {errors.client2Email && (
                  <p className="text-sm text-destructive">{errors.client2Email.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointment Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="clientManager">Client Manager <span className="text-destructive">*</span></Label>
              <Controller
                name="clientManager"
                control={control}
                rules={{ required: "Client manager is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select client manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLIENT_MANAGERS.map((manager) => (
                        <SelectItem key={manager} value={manager}>
                          {manager}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.clientManager && (
                <p className="text-sm text-destructive">{errors.clientManager.message}</p>
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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="appointmentLocation">Appointment Location</Label>
              <Input
                id="appointmentLocation"
                {...register("appointmentLocation")}
                placeholder="Enter appointment location"
                className="h-11"
              />
            </div>
          </div>
        </CardContent>
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
