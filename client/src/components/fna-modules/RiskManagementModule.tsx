import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Shield, User } from "lucide-react";

interface RiskManagementModuleProps {
  submissionId: number;
}

interface RiskManagementForm {
  lifeInsurance: boolean;
  lifeInsuranceAmount: number;
  tpdInsurance: boolean;
  tpdInsuranceAmount: number;
  incomeProtection: boolean;
  incomeProtectionAmount: number;
  traumaCover: boolean;
  traumaCoverAmount: number;
  smoker: boolean;
}

export function RiskManagementModule({ submissionId }: RiskManagementModuleProps) {
  const [activeClient, setActiveClient] = useState<1 | 2>(1);
  
  const { register: register1, handleSubmit: handleSubmit1, setValue: setValue1, watch: watch1 } = useForm<RiskManagementForm>();
  const { register: register2, handleSubmit: handleSubmit2, setValue: setValue2, watch: watch2 } = useForm<RiskManagementForm>();
  
  const { data: client1Data, isLoading: loading1 } = trpc.fna.getRiskManagement.useQuery({
    fnaSubmissionId: submissionId,
    clientNumber: 1,
  });
  
  const { data: client2Data, isLoading: loading2 } = trpc.fna.getRiskManagement.useQuery({
    fnaSubmissionId: submissionId,
    clientNumber: 2,
  });
  
  const saveRiskMutation = trpc.fna.saveRiskManagement.useMutation();
  
  // Populate Client 1 form
  useEffect(() => {
    if (client1Data) {
      setValue1("lifeInsurance", client1Data.lifeInsurance || false);
      setValue1("lifeInsuranceAmount", client1Data.lifeInsuranceAmount || 0);
      setValue1("tpdInsurance", client1Data.tpdInsurance || false);
      setValue1("tpdInsuranceAmount", client1Data.tpdInsuranceAmount || 0);
      setValue1("incomeProtection", client1Data.incomeProtection || false);
      setValue1("incomeProtectionAmount", client1Data.incomeProtectionAmount || 0);
      setValue1("traumaCover", client1Data.traumaCover || false);
      setValue1("traumaCoverAmount", client1Data.traumaCoverAmount || 0);
      setValue1("smoker", client1Data.smoker || false);
    }
  }, [client1Data, setValue1]);
  
  // Populate Client 2 form
  useEffect(() => {
    if (client2Data) {
      setValue2("lifeInsurance", client2Data.lifeInsurance || false);
      setValue2("lifeInsuranceAmount", client2Data.lifeInsuranceAmount || 0);
      setValue2("tpdInsurance", client2Data.tpdInsurance || false);
      setValue2("tpdInsuranceAmount", client2Data.tpdInsuranceAmount || 0);
      setValue2("incomeProtection", client2Data.incomeProtection || false);
      setValue2("incomeProtectionAmount", client2Data.incomeProtectionAmount || 0);
      setValue2("traumaCover", client2Data.traumaCover || false);
      setValue2("traumaCoverAmount", client2Data.traumaCoverAmount || 0);
      setValue2("smoker", client2Data.smoker || false);
    }
  }, [client2Data, setValue2]);
  
  const onSubmit1 = async (data: RiskManagementForm) => {
    try {
      await saveRiskMutation.mutateAsync({
        fnaSubmissionId: submissionId,
        clientNumber: 1,
        ...data,
      });
      toast.success("Client 1 insurance details saved");
    } catch (error) {
      toast.error("Failed to save insurance details");
    }
  };
  
  const onSubmit2 = async (data: RiskManagementForm) => {
    try {
      await saveRiskMutation.mutateAsync({
        fnaSubmissionId: submissionId,
        clientNumber: 2,
        ...data,
      });
      toast.success("Client 2 insurance details saved");
    } catch (error) {
      toast.error("Failed to save insurance details");
    }
  };
  
  const renderForm = (
    register: any,
    handleSubmit: any,
    watch: any,
    clientNumber: number
  ) => {
    const lifeInsurance = watch("lifeInsurance");
    const tpdInsurance = watch("tpdInsurance");
    const incomeProtection = watch("incomeProtection");
    const traumaCover = watch("traumaCover");
    
    return (
      <form onSubmit={handleSubmit(clientNumber === 1 ? onSubmit1 : onSubmit2)} className="space-y-6">
        <div className="space-y-4">
          {/* Life Insurance */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`life-${clientNumber}`}
                {...register("lifeInsurance")}
                checked={lifeInsurance}
              />
              <Label htmlFor={`life-${clientNumber}`} className="font-semibold">
                Life Insurance
              </Label>
            </div>
            {lifeInsurance && (
              <div>
                <Label htmlFor={`lifeAmount-${clientNumber}`}>Coverage Amount ($)</Label>
                <Input
                  id={`lifeAmount-${clientNumber}`}
                  type="number"
                  {...register("lifeInsuranceAmount", { valueAsNumber: true })}
                  placeholder="0"
                  className="h-11"
                />
              </div>
            )}
          </div>
          
          {/* TPD Insurance */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`tpd-${clientNumber}`}
                {...register("tpdInsurance")}
                checked={tpdInsurance}
              />
              <Label htmlFor={`tpd-${clientNumber}`} className="font-semibold">
                TPD (Total & Permanent Disability) Insurance
              </Label>
            </div>
            {tpdInsurance && (
              <div>
                <Label htmlFor={`tpdAmount-${clientNumber}`}>Coverage Amount ($)</Label>
                <Input
                  id={`tpdAmount-${clientNumber}`}
                  type="number"
                  {...register("tpdInsuranceAmount", { valueAsNumber: true })}
                  placeholder="0"
                  className="h-11"
                />
              </div>
            )}
          </div>
          
          {/* Income Protection */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`income-${clientNumber}`}
                {...register("incomeProtection")}
                checked={incomeProtection}
              />
              <Label htmlFor={`income-${clientNumber}`} className="font-semibold">
                Income Protection Insurance
              </Label>
            </div>
            {incomeProtection && (
              <div>
                <Label htmlFor={`incomeAmount-${clientNumber}`}>Monthly Benefit ($)</Label>
                <Input
                  id={`incomeAmount-${clientNumber}`}
                  type="number"
                  {...register("incomeProtectionAmount", { valueAsNumber: true })}
                  placeholder="0"
                  className="h-11"
                />
              </div>
            )}
          </div>
          
          {/* Trauma Cover */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`trauma-${clientNumber}`}
                {...register("traumaCover")}
                checked={traumaCover}
              />
              <Label htmlFor={`trauma-${clientNumber}`} className="font-semibold">
                Trauma Cover
              </Label>
            </div>
            {traumaCover && (
              <div>
                <Label htmlFor={`traumaAmount-${clientNumber}`}>Coverage Amount ($)</Label>
                <Input
                  id={`traumaAmount-${clientNumber}`}
                  type="number"
                  {...register("traumaCoverAmount", { valueAsNumber: true })}
                  placeholder="0"
                  className="h-11"
                />
              </div>
            )}
          </div>
          
          {/* Smoker Status */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`smoker-${clientNumber}`}
                {...register("smoker")}
              />
              <Label htmlFor={`smoker-${clientNumber}`} className="font-semibold">
                Smoker
              </Label>
            </div>
          </div>
        </div>
        
        <Button type="submit" disabled={saveRiskMutation.isPending} className="w-full">
          {saveRiskMutation.isPending ? "Saving..." : `Save Client ${clientNumber} Insurance Details`}
        </Button>
      </form>
    );
  };
  
  if (loading1 || loading2) {
    return <div className="text-center py-8 text-muted-foreground">Loading insurance details...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Risk Management & Insurance</CardTitle>
        </div>
        <CardDescription>
          Provide details of existing insurance coverage for each client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeClient.toString()} onValueChange={(v) => setActiveClient(parseInt(v) as 1 | 2)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="1" className="gap-2">
              <User className="h-4 w-4" />
              Client 1
            </TabsTrigger>
            <TabsTrigger value="2" className="gap-2">
              <User className="h-4 w-4" />
              Client 2
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="1">
            {renderForm(register1, handleSubmit1, watch1, 1)}
          </TabsContent>
          
          <TabsContent value="2">
            {renderForm(register2, handleSubmit2, watch2, 2)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
