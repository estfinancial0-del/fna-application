import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/formatted-inputs";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { RiskManagementModule } from "@/components/fna-modules/RiskManagementModule";
import { activeFnaConfig } from "@/fnaConfig";

interface Step6Props {
  submissionId: number;
  onNext: () => void;
}

interface AssetForm {
  assetType: string;
  valueOfAsset: number;
  amountOwing: number;
  repayment: number;
  frequency: string;
  lender: string;
  rentAmount: number;
}

export function Step6Assets({ submissionId, onNext }: Step6Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const { register, handleSubmit, reset, control } = useForm<AssetForm>();
  
  const utils = trpc.useUtils();
  
  // Load existing assets
  const { data: assets = [], isLoading } = trpc.fna.getAssetsLiabilities.useQuery({ 
    fnaSubmissionId: submissionId 
  });

  const addMutation = trpc.fna.addAssetLiability.useMutation({
    onSuccess: () => {
      toast.success("Asset/Liability added successfully");
      utils.fna.getAssetsLiabilities.invalidate({ fnaSubmissionId: submissionId });
      reset();
      setShowAddForm(false);
    },
    onError: (error) => {
      toast.error(`Failed to add: ${error.message}`);
    },
  });

  const deleteMutation = trpc.fna.deleteAssetLiability.useMutation({
    onSuccess: () => {
      toast.success("Item deleted successfully");
      utils.fna.getAssetsLiabilities.invalidate({ fnaSubmissionId: submissionId });
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  const onSubmit = (data: AssetForm) => {
    addMutation.mutate({
      fnaSubmissionId: submissionId,
      assetType: data.assetType,
      valueOfAsset: Number(data.valueOfAsset) || undefined,
      amountOwing: Number(data.amountOwing) || undefined,
      repayment: Number(data.repayment) || undefined,
      frequency: data.frequency,
      lender: data.lender,
      rentAmount: Number(data.rentAmount) || undefined,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate({ id });
    }
  };

  const calculateTotals = () => {
    const totalValue = assets.reduce((sum, asset) => sum + (asset.valueOfAsset || 0), 0);
    const totalOwing = assets.reduce((sum, asset) => sum + (asset.amountOwing || 0), 0);
    const netWorth = totalValue - totalOwing;
    return { totalValue, totalOwing, netWorth };
  };

  const { totalValue, totalOwing, netWorth } = calculateTotals();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div>
              <p className="text-muted-foreground">Total Assets</p>
              <p className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Liabilities</p>
              <p className="text-2xl font-bold text-destructive">${totalOwing.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Net Worth</p>
              <p className="text-2xl font-bold text-primary">${netWorth.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Assets & Liabilities</h3>
          <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base">Add New Asset/Liability</CardTitle>
              <CardDescription>Enter the details of your asset or liability</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="assetType">Asset Type</Label>
                    <Input
                      {...register("assetType", { required: true })}
                      placeholder="e.g., Home, Car, Investment Property"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valueOfAsset">Value of Asset</Label>
                    <Controller
                      name="valueOfAsset"
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
                    <Label htmlFor="amountOwing">Amount Owing</Label>
                    <Controller
                      name="amountOwing"
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
                    <Label htmlFor="repayment">Repayment</Label>
                    <Controller
                      name="repayment"
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
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input
                      {...register("frequency")}
                      placeholder="Weekly/Monthly/Yearly"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lender">Lender</Label>
                    <Input
                      {...register("lender")}
                      placeholder="Bank or lender name"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rentAmount">Rent Amount (if investment property)</Label>
                    <Controller
                      name="rentAmount"
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
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addMutation.isPending}>
                    {addMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Add Item
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {assets.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No assets or liabilities added yet</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Item" to get started</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Type</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Amount Owing</TableHead>
                  <TableHead className="text-right">Repayment</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Lender</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.assetType}</TableCell>
                    <TableCell className="text-right">
                      ${(asset.valueOfAsset || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      ${(asset.amountOwing || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${(asset.repayment || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>{asset.frequency || "-"}</TableCell>
                    <TableCell>{asset.lender || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(asset.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Risk Management Module */}
      {activeFnaConfig.assetsLiabilities.riskManagement && (
        <div className="mt-8">
          <RiskManagementModule submissionId={submissionId} />
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} className="gap-2">
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
