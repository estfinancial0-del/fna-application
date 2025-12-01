import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrencyInput, PhoneInput, PostcodeInput } from "@/components/ui/formatted-inputs";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";
import { FinancialDependentsModule } from "@/components/fna-modules/FinancialDependentsModule";
import { activeFnaConfig } from "@/fnaConfig";

interface Step5Props {
  submissionId: number;
  onNext: () => void;
}

interface PersonalDetailsForm {
  title: string;
  surname: string;
  givenNames: string;
  dateOfBirth: string;
  homeAddress: string;
  postcode: string;
  yearMovedIn: number;
  bestContactNumber: string;
  emailAddress: string;
  maritalStatus: string;
  typeOfEmployment: string;
  employer: string;
  dateStarted: string;
  positionOccupation: string;
  taxableIncome: number;
}

export function Step5PersonalDetails({ submissionId, onNext }: Step5Props) {
  const [activeClient, setActiveClient] = useState<1 | 2>(1);
  
  const { register: register1, handleSubmit: handleSubmit1, setValue: setValue1, control: control1 } = useForm<PersonalDetailsForm>();
  const { register: register2, handleSubmit: handleSubmit2, setValue: setValue2, control: control2 } = useForm<PersonalDetailsForm>();
  
  // Load existing data for both clients
  const { data: client1Data, isLoading: loading1 } = trpc.fna.getPersonalDetails.useQuery({ 
    fnaSubmissionId: submissionId,
    clientNumber: 1,
  });
  
  const { data: client2Data, isLoading: loading2 } = trpc.fna.getPersonalDetails.useQuery({ 
    fnaSubmissionId: submissionId,
    clientNumber: 2,
  });

  // Populate Client 1 form
  useEffect(() => {
    if (client1Data) {
      setValue1("title", client1Data.title || "");
      setValue1("surname", client1Data.surname || "");
      setValue1("givenNames", client1Data.givenNames || "");
      if (client1Data.dateOfBirth) {
        setValue1("dateOfBirth", new Date(client1Data.dateOfBirth).toISOString().split('T')[0]);
      }
      setValue1("homeAddress", client1Data.homeAddress || "");
      setValue1("postcode", client1Data.postcode || "");
      setValue1("yearMovedIn", client1Data.yearMovedIn || 0);
      setValue1("bestContactNumber", client1Data.bestContactNumber || "");
      setValue1("emailAddress", client1Data.emailAddress || "");
      setValue1("maritalStatus", client1Data.maritalStatus || "");
      setValue1("typeOfEmployment", client1Data.typeOfEmployment || "");
      setValue1("employer", client1Data.employer || "");
      if (client1Data.dateStarted) {
        setValue1("dateStarted", new Date(client1Data.dateStarted).toISOString().split('T')[0]);
      }
      setValue1("positionOccupation", client1Data.positionOccupation || "");
      setValue1("taxableIncome", client1Data.taxableIncome || 0);
    }
  }, [client1Data, setValue1]);

  // Populate Client 2 form
  useEffect(() => {
    if (client2Data) {
      setValue2("title", client2Data.title || "");
      setValue2("surname", client2Data.surname || "");
      setValue2("givenNames", client2Data.givenNames || "");
      if (client2Data.dateOfBirth) {
        setValue2("dateOfBirth", new Date(client2Data.dateOfBirth).toISOString().split('T')[0]);
      }
      setValue2("homeAddress", client2Data.homeAddress || "");
      setValue2("postcode", client2Data.postcode || "");
      setValue2("yearMovedIn", client2Data.yearMovedIn || 0);
      setValue2("bestContactNumber", client2Data.bestContactNumber || "");
      setValue2("emailAddress", client2Data.emailAddress || "");
      setValue2("maritalStatus", client2Data.maritalStatus || "");
      setValue2("typeOfEmployment", client2Data.typeOfEmployment || "");
      setValue2("employer", client2Data.employer || "");
      if (client2Data.dateStarted) {
        setValue2("dateStarted", new Date(client2Data.dateStarted).toISOString().split('T')[0]);
      }
      setValue2("positionOccupation", client2Data.positionOccupation || "");
      setValue2("taxableIncome", client2Data.taxableIncome || 0);
    }
  }, [client2Data, setValue2]);

  const saveMutation = trpc.fna.savePersonalDetails.useMutation({
    onSuccess: () => {
      toast.success(`Client ${activeClient} details saved successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const handleSaveAndContinue = async () => {
    // Save both clients before continuing
    const form1 = handleSubmit1(async (data) => {
      await saveMutation.mutateAsync({
        fnaSubmissionId: submissionId,
        clientNumber: 1,
        title: data.title,
        surname: data.surname,
        givenNames: data.givenNames,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        homeAddress: data.homeAddress,
        postcode: data.postcode,
        yearMovedIn: Number(data.yearMovedIn) || undefined,
        bestContactNumber: data.bestContactNumber,
        emailAddress: data.emailAddress,
        maritalStatus: data.maritalStatus,
        typeOfEmployment: data.typeOfEmployment,
        employer: data.employer,
        dateStarted: data.dateStarted ? new Date(data.dateStarted) : undefined,
        positionOccupation: data.positionOccupation,
        taxableIncome: Number(data.taxableIncome) || undefined,
      });
    });

    const form2 = handleSubmit2(async (data) => {
      await saveMutation.mutateAsync({
        fnaSubmissionId: submissionId,
        clientNumber: 2,
        title: data.title,
        surname: data.surname,
        givenNames: data.givenNames,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        homeAddress: data.homeAddress,
        postcode: data.postcode,
        yearMovedIn: Number(data.yearMovedIn) || undefined,
        bestContactNumber: data.bestContactNumber,
        emailAddress: data.emailAddress,
        maritalStatus: data.maritalStatus,
        typeOfEmployment: data.typeOfEmployment,
        employer: data.employer,
        dateStarted: data.dateStarted ? new Date(data.dateStarted) : undefined,
        positionOccupation: data.positionOccupation,
        taxableIncome: Number(data.taxableIncome) || undefined,
      });
    });

    try {
      await form1();
      await form2();
      onNext();
    } catch (error) {
      // Error already handled by mutation
    }
  };

  if (loading1 || loading2) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const PersonalDetailsFormFields = ({ register, control }: { register: any; control: any }) => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input {...register("title")} placeholder="Mr/Mrs/Ms/Dr" className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="surname">Surname</Label>
          <Input {...register("surname")} placeholder="Last name" className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="givenNames">Given Names</Label>
          <Input {...register("givenNames")} placeholder="First name(s)" className="h-11" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input type="date" {...register("dateOfBirth")} className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Input {...register("maritalStatus")} placeholder="Single/Married/De facto" className="h-11" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="homeAddress">Home Address</Label>
        <Input {...register("homeAddress")} placeholder="Street address" className="h-11" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode</Label>
          <Controller
            name="postcode"
            control={control}
            render={({ field }) => (
              <PostcodeInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Postcode"
                className="h-11"
              />
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearMovedIn">Year Moved In</Label>
          <Input type="number" {...register("yearMovedIn")} placeholder="YYYY" className="h-11" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bestContactNumber">Best Contact Number</Label>
          <Controller
            name="bestContactNumber"
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
          <Label htmlFor="emailAddress">Email Address</Label>
          <Input type="email" {...register("emailAddress")} placeholder="Email" className="h-11" />
        </div>
      </div>

      <h3 className="text-lg font-semibold pt-4 border-t">Employment Details</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="typeOfEmployment">Type of Employment</Label>
          <Input {...register("typeOfEmployment")} placeholder="Full-time/Part-time/Casual" className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employer">Employer</Label>
          <Input {...register("employer")} placeholder="Company name" className="h-11" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dateStarted">Date Started</Label>
          <Input type="date" {...register("dateStarted")} className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="positionOccupation">Position/Occupation</Label>
          <Input {...register("positionOccupation")} placeholder="Job title" className="h-11" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="taxableIncome">Taxable Income (Annual)</Label>
        <Controller
          name="taxableIncome"
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
  );

  return (
    <div className="space-y-6">
      <Tabs value={String(activeClient)} onValueChange={(v) => setActiveClient(Number(v) as 1 | 2)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="1" className="gap-2">
            <User className="h-4 w-4" />
            Client 1
          </TabsTrigger>
          <TabsTrigger value="2" className="gap-2">
            <User className="h-4 w-4" />
            Client 2
          </TabsTrigger>
        </TabsList>

        <TabsContent value="1" className="mt-6">
          <PersonalDetailsFormFields register={register1} control={control1} />
        </TabsContent>

        <TabsContent value="2" className="mt-6">
          <PersonalDetailsFormFields register={register2} control={control2} />
        </TabsContent>
      </Tabs>

      {/* Financial Dependents Module */}
      {activeFnaConfig.financialDependents.enabled && (
        <div className="mt-8">
          <FinancialDependentsModule submissionId={submissionId} />
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveAndContinue} disabled={saveMutation.isPending} className="gap-2">
          {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
