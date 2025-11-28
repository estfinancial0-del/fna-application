import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  givenNames: string;
  surname: string;
  title: string;
  dateOfBirth: string;
  homeAddress: string;
  postcode: string;
  yearMovedIn: number;
  bestContactNumber: string;
  emailAddress: string;
  maritalStatus: string;
  maritalStatusOther?: string;
  typeOfEmployment: string;
  typeOfEmploymentOther?: string;
  employer: string;
  dateStarted: string;
  positionOccupation: string;
  incomeCurrency: string;
  taxableIncome: number;
  includeSuperInIncome: boolean;
  estimatedSuper: number;
}

const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "defacto", label: "De facto" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
  { value: "other", label: "Other" },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "fulltime", label: "Full-time employed" },
  { value: "parttime", label: "Part-time employed" },
  { value: "casual", label: "Casual employed" },
  { value: "selfemployed", label: "Self-employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "retired", label: "Retired" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" },
];

const CURRENCY_OPTIONS = [
  { value: "AUD", label: "AUD" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "NZD", label: "NZD" },
];

// Australian Superannuation Guarantee rate (as of 2024-2025: 11.5%)
const SUPER_GUARANTEE_RATE = 0.115;

export function Step5PersonalDetails({ submissionId, onNext }: Step5Props) {
  const [activeClient, setActiveClient] = useState<1 | 2>(1);
  const [sameAddressAsClient1, setSameAddressAsClient1] = useState(false);
  
  const { register: register1, handleSubmit: handleSubmit1, setValue: setValue1, control: control1, watch: watch1 } = useForm<PersonalDetailsForm>({
    defaultValues: {
      incomeCurrency: "AUD",
      includeSuperInIncome: false,
    }
  });
  const { register: register2, handleSubmit: handleSubmit2, setValue: setValue2, control: control2, watch: watch2 } = useForm<PersonalDetailsForm>({
    defaultValues: {
      incomeCurrency: "AUD",
      includeSuperInIncome: false,
    }
  });
  
  // Watch employment type to conditionally show fields
  const employmentType1 = watch1("typeOfEmployment");
  const employmentType2 = watch2("typeOfEmployment");
  const maritalStatus1 = watch1("maritalStatus");
  const maritalStatus2 = watch2("maritalStatus");
  const taxableIncome1 = watch1("taxableIncome");
  const taxableIncome2 = watch2("taxableIncome");
  const includeSuperInIncome1 = watch1("includeSuperInIncome");
  const includeSuperInIncome2 = watch2("includeSuperInIncome");
  
  // Calculate super
  const calculatedSuper1 = taxableIncome1 ? Math.round(taxableIncome1 * SUPER_GUARANTEE_RATE) : 0;
  const calculatedSuper2 = taxableIncome2 ? Math.round(taxableIncome2 * SUPER_GUARANTEE_RATE) : 0;
  
  // Update estimated super when income changes
  useEffect(() => {
    if (includeSuperInIncome1) {
      setValue1("estimatedSuper", calculatedSuper1);
    }
  }, [taxableIncome1, includeSuperInIncome1, calculatedSuper1, setValue1]);
  
  useEffect(() => {
    if (includeSuperInIncome2) {
      setValue2("estimatedSuper", calculatedSuper2);
    }
  }, [taxableIncome2, includeSuperInIncome2, calculatedSuper2, setValue2]);
  
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
      setValue1("dateStarted", client1Data.dateStarted || "");
      setValue1("positionOccupation", client1Data.positionOccupation || "");
      setValue1("taxableIncome", client1Data.taxableIncome || 0);
      setValue1("incomeCurrency", client1Data.incomeCurrency || "AUD");
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
      setValue2("dateStarted", client2Data.dateStarted || "");
      setValue2("positionOccupation", client2Data.positionOccupation || "");
      setValue2("taxableIncome", client2Data.taxableIncome || 0);
      setValue2("incomeCurrency", client2Data.incomeCurrency || "AUD");
    }
  }, [client2Data, setValue2]);
  
  // Copy Client 1 address to Client 2
  useEffect(() => {
    if (sameAddressAsClient1 && activeClient === 2) {
      const client1Address = watch1("homeAddress");
      const client1Postcode = watch1("postcode");
      const client1YearMovedIn = watch1("yearMovedIn");
      
      setValue2("homeAddress", client1Address);
      setValue2("postcode", client1Postcode);
      setValue2("yearMovedIn", client1YearMovedIn);
    }
  }, [sameAddressAsClient1, activeClient, watch1, setValue2]);

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
        maritalStatus: data.maritalStatus === "other" ? data.maritalStatusOther : data.maritalStatus,
        typeOfEmployment: data.typeOfEmployment === "other" ? data.typeOfEmploymentOther : data.typeOfEmployment,
        employer: data.employer,
        dateStarted: data.dateStarted,
        positionOccupation: data.positionOccupation,
        incomeCurrency: data.incomeCurrency,
        taxableIncome: Number(data.taxableIncome) || undefined,
        estimatedSuper: data.includeSuperInIncome ? data.estimatedSuper : undefined,
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
        maritalStatus: data.maritalStatus === "other" ? data.maritalStatusOther : data.maritalStatus,
        typeOfEmployment: data.typeOfEmployment === "other" ? data.typeOfEmploymentOther : data.typeOfEmployment,
        employer: data.employer,
        dateStarted: data.dateStarted,
        positionOccupation: data.positionOccupation,
        incomeCurrency: data.incomeCurrency,
        taxableIncome: Number(data.taxableIncome) || undefined,
        estimatedSuper: data.includeSuperInIncome ? data.estimatedSuper : undefined,
      });
    });

    try {
      await form1();
      await form2();
      onNext();
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  if (loading1 || loading2) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const PersonalDetailsFormFields = ({ 
    register, 
    control, 
    watch, 
    setValue,
    clientNumber 
  }: { 
    register: any; 
    control: any; 
    watch: any;
    setValue: any;
    clientNumber: 1 | 2;
  }) => {
    const employmentType = watch("typeOfEmployment");
    const maritalStatus = watch("maritalStatus");
    const taxableIncome = watch("taxableIncome");
    const includeSuperInIncome = watch("includeSuperInIncome");
    const calculatedSuper = taxableIncome ? Math.round(taxableIncome * SUPER_GUARANTEE_RATE) : 0;
    
    const showEmploymentDetails = employmentType && 
      !["unemployed", "retired", "student"].includes(employmentType);
    
    return (
      <div className="space-y-6">
        {/* Name Fields - Reordered: Given Names, Surname, Title */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="givenNames">Given Names (First Name)</Label>
            <Input {...register("givenNames")} placeholder="First name(s)" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surname">Surname (Last Name)</Label>
            <Input {...register("surname")} placeholder="Last name" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input {...register("title")} placeholder="Mr/Mrs/Ms/Dr" className="h-11" />
          </div>
        </div>

        {/* Date of Birth and Marital Status */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input 
              type="date" 
              {...register("dateOfBirth", {
                validate: (value) => {
                  if (!value) return true;
                  const year = new Date(value).getFullYear();
                  const yearString = year.toString();
                  if (yearString.length !== 4) {
                    return "Year must be 4 digits";
                  }
                  return true;
                }
              })} 
              className="h-11" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Controller
              name="maritalStatus"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARITAL_STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Other Marital Status */}
        {maritalStatus === "other" && (
          <div className="space-y-2">
            <Label htmlFor="maritalStatusOther">Please specify</Label>
            <Input {...register("maritalStatusOther")} placeholder="Enter marital status" className="h-11" />
          </div>
        )}

        {/* Address Section */}
        {clientNumber === 2 && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Checkbox
              id="sameAddress"
              checked={sameAddressAsClient1}
              onCheckedChange={(checked) => setSameAddressAsClient1(checked as boolean)}
            />
            <Label htmlFor="sameAddress" className="cursor-pointer font-normal">
              Same address as Client 1
            </Label>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="homeAddress">Home Address</Label>
          <Input 
            {...register("homeAddress")} 
            placeholder="Street address" 
            className="h-11"
            disabled={clientNumber === 2 && sameAddressAsClient1}
          />
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
                  disabled={clientNumber === 2 && sameAddressAsClient1}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearMovedIn">Year Moved In</Label>
            <Input 
              type="number" 
              {...register("yearMovedIn")} 
              placeholder="YYYY" 
              className="h-11"
              disabled={clientNumber === 2 && sameAddressAsClient1}
            />
          </div>
        </div>

        {/* Contact Information */}
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

        {/* Type of Employment */}
        <div className="space-y-2">
          <Label htmlFor="typeOfEmployment">Type of Employment</Label>
          <Controller
            name="typeOfEmployment"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Other Employment Type */}
        {employmentType === "other" && (
          <div className="space-y-2">
            <Label htmlFor="typeOfEmploymentOther">Please specify</Label>
            <Input {...register("typeOfEmploymentOther")} placeholder="Enter employment type" className="h-11" />
          </div>
        )}

        {/* Show employment details only if employed */}
        {showEmploymentDetails && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employer">Employer</Label>
                <Input {...register("employer")} placeholder="Company name" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="positionOccupation">Position/Occupation</Label>
                <Input {...register("positionOccupation")} placeholder="Job title" className="h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateStarted">Date Started (approximate is fine)</Label>
              <Input 
                {...register("dateStarted")} 
                placeholder="e.g., Early 2020, Mid 2019, or 01/2020" 
                className="h-11" 
              />
            </div>

            {/* Income with Currency Selector */}
            <div className="space-y-2">
              <Label htmlFor="taxableIncome">Taxable Income (Annual)</Label>
              <div className="flex gap-2">
                <Controller
                  name="incomeCurrency"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCY_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name="taxableIncome"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="$0"
                      className="h-11 flex-1"
                    />
                  )}
                />
              </div>
            </div>

            {/* Super Calculation */}
            <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <Controller
                  name="includeSuperInIncome"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`includeSuper-${clientNumber}`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor={`includeSuper-${clientNumber}`} className="cursor-pointer font-normal">
                  Include Super calculation (Est. ${calculatedSuper.toLocaleString()})
                </Label>
              </div>
              {includeSuperInIncome && (
                <div className="text-sm text-gray-700">
                  <p>Based on {(SUPER_GUARANTEE_RATE * 100).toFixed(1)}% Superannuation Guarantee rate</p>
                  <p className="font-semibold mt-1">Estimated Super: ${calculatedSuper.toLocaleString()}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

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
          <PersonalDetailsFormFields 
            register={register1} 
            control={control1} 
            watch={watch1}
            setValue={setValue1}
            clientNumber={1}
          />
        </TabsContent>

        <TabsContent value="2" className="mt-6">
          <PersonalDetailsFormFields 
            register={register2} 
            control={control2} 
            watch={watch2}
            setValue={setValue2}
            clientNumber={2}
          />
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
