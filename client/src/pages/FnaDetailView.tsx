import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { generateFnaPdf } from "@/lib/generateFnaPdf";

export default function FnaDetailView() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const submissionId = Number(params.id);

  // Load all FNA data
  const { data: clientDetails, isLoading: loadingClient } = trpc.fna.getClientDetails.useQuery({
    fnaSubmissionId: submissionId,
  });

  const { data: wealthCreation } = trpc.fna.getWealthCreationGoals.useQuery({
    fnaSubmissionId: submissionId,
  });

  const { data: wealthProtection } = trpc.fna.getWealthProtectionGoals.useQuery({
    fnaSubmissionId: submissionId,
  });

  const { data: lifestyle } = trpc.fna.getLifestyleAspirations.useQuery({
    fnaSubmissionId: submissionId,
  });

  const { data: retirement } = trpc.fna.getRetirementPlanning.useQuery({
    fnaSubmissionId: submissionId,
  });

  const { data: personal1 } = trpc.fna.getPersonalDetails.useQuery({
    fnaSubmissionId: submissionId,
    clientNumber: 1,
  });

  const { data: personal2 } = trpc.fna.getPersonalDetails.useQuery({
    fnaSubmissionId: submissionId,
    clientNumber: 2,
  });

  const { data: dependents = [] } = trpc.fna.getFinancialDependents.useQuery({
    fnaSubmissionId: submissionId,
  });

  const { data: assets = [] } = trpc.fna.getAssetsLiabilities.useQuery({
    fnaSubmissionId: submissionId,
  });

  const { data: risk1 } = trpc.fna.getRiskManagement.useQuery({
    fnaSubmissionId: submissionId,
    clientNumber: 1,
  });

  const { data: risk2 } = trpc.fna.getRiskManagement.useQuery({
    fnaSubmissionId: submissionId,
    clientNumber: 2,
  });

  const { data: selfEmployment } = trpc.fna.getSelfEmploymentInfo.useQuery({
    fnaSubmissionId: submissionId,
  });

  const { data: expenses = [] } = trpc.fna.getAnnualExpenses.useQuery({
    fnaSubmissionId: submissionId,
  });

  if (loadingClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!clientDetails) {
    return (
      <div className="container max-w-4xl py-12">
        <p className="text-center text-muted-foreground">FNA submission not found</p>
      </div>
    );
  }

  const handleExportPDF = () => {
    if (!clientDetails) {
      toast.error("No data available to export");
      return;
    }

    try {
      generateFnaPdf({
        clientDetails,
        wealthCreation,
        wealthProtection,
        lifestyle,
        retirement,
        personalDetails1: personal1,
        personalDetails2: personal2,
        dependents: dependents || [],
        assets: assets || [],
        riskManagement: [],
        expenses: expenses || [],
      });
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF");
    }
  };

  const calculateNetWorth = () => {
    const totalAssets = assets.reduce((sum, a) => sum + (a.valueOfAsset || 0), 0);
    const totalLiabilities = assets.reduce((sum, a) => sum + (a.amountOwing || 0), 0);
    return totalAssets - totalLiabilities;
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((sum, e) => sum + (e.perYear || 0), 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-6xl py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/admin")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{clientDetails.clientName}</h1>
                <p className="text-sm text-muted-foreground">
                  {clientDetails.appointmentDate ? `Appointment: ${new Date(clientDetails.appointmentDate).toLocaleDateString()}` : "No appointment scheduled"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                in-progress
              </Badge>
              <Button onClick={handleExportPDF} className="gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-6xl py-8 space-y-6">
        {/* Client Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Client & Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Client Name</p>
              <p className="font-medium">{clientDetails.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Client Manager</p>
              <p className="font-medium">{clientDetails.clientManager || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{clientDetails.phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{clientDetails.email || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Appointment Location</p>
              <p className="font-medium">{clientDetails.appointmentLocation || "-"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Goals */}
        {(wealthCreation || wealthProtection) && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {wealthCreation && (
                <div>
                  <h4 className="font-semibold mb-2">Wealth Creation</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Retirement Planning:</span>
                      <span className="font-medium">{wealthCreation.retirementPlanning || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Invest Money:</span>
                      <span className="font-medium">{wealthCreation.investMoney || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Investment Property:</span>
                      <span className="font-medium">{wealthCreation.investProperty || "-"}</span>
                    </div>
                  </div>
                </div>
              )}
              {wealthProtection && (
                <div>
                  <h4 className="font-semibold mb-2">Wealth Protection</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Family Security:</span>
                      <span className="font-medium">{wealthProtection.familySecure || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manage Sickness:</span>
                      <span className="font-medium">{wealthProtection.manageSickness || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inheritance Planning:</span>
                      <span className="font-medium">{wealthProtection.inheritance || "-"}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Retirement Planning */}
        {retirement && (
          <Card>
            <CardHeader>
              <CardTitle>Retirement Planning</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Retirement Age</p>
                <p className="text-2xl font-bold">{retirement.estimatedRetirementAge || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Desired Income (Annual)</p>
                <p className="text-2xl font-bold">
                  ${(retirement.desiredYearlyIncome || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Shortfall</p>
                <p className="text-2xl font-bold text-destructive">
                  ${(retirement.retirementShortfall || 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personal Details */}
        {(personal1 || personal2) && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {personal1 && (
                <div>
                  <h4 className="font-semibold mb-3">Client 1</h4>
                  <div className="grid gap-3 md:grid-cols-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Full Name:</span>
                      <span className="ml-2 font-medium">{personal1.givenNames && personal1.surname ? `${personal1.givenNames} ${personal1.surname}` : "-"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date of Birth:</span>
                      <span className="ml-2 font-medium">
                        {personal1.dateOfBirth ? new Date(personal1.dateOfBirth).toLocaleDateString() : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Occupation:</span>
                      <span className="ml-2 font-medium">{personal1.positionOccupation || "-"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taxable Income:</span>
                      <span className="ml-2 font-medium">
                        ${(personal1.taxableIncome || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {personal2 && (
                <div>
                  <h4 className="font-semibold mb-3">Client 2</h4>
                  <div className="grid gap-3 md:grid-cols-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Full Name:</span>
                      <span className="ml-2 font-medium">{personal2.givenNames && personal2.surname ? `${personal2.givenNames} ${personal2.surname}` : "-"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date of Birth:</span>
                      <span className="ml-2 font-medium">
                        {personal2.dateOfBirth ? new Date(personal2.dateOfBirth).toLocaleDateString() : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Occupation:</span>
                      <span className="ml-2 font-medium">{personal2.positionOccupation || "-"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taxable Income:</span>
                      <span className="ml-2 font-medium">
                        ${(personal2.taxableIncome || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Financial Dependents */}
        {dependents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Dependents ({dependents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dependents.map((dep, idx) => (
                  <div key={dep.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{dep.relationship}</p>
                      <p className="text-sm text-muted-foreground">
                        {dep.sex || "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assets & Liabilities */}
        {assets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Assets & Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Assets</p>
                    <p className="text-xl font-bold">
                      ${assets.reduce((sum, a) => sum + (a.valueOfAsset || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Liabilities</p>
                    <p className="text-xl font-bold text-destructive">
                      ${assets.reduce((sum, a) => sum + (a.amountOwing || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Worth</p>
                    <p className="text-xl font-bold text-primary">
                      ${calculateNetWorth().toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {assets.map((asset) => (
                    <div key={asset.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{asset.assetType}</p>
                        <p className="text-sm text-muted-foreground">
                          {asset.lender && `Lender: ${asset.lender}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(asset.valueOfAsset || 0).toLocaleString()}</p>
                        {asset.amountOwing && (
                          <p className="text-sm text-destructive">
                            Owing: ${asset.amountOwing.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Annual Expenses */}
        {expenses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Annual Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Annual Expenses</p>
                  <p className="text-2xl font-bold text-primary">
                    ${calculateTotalExpenses().toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{expense.expenseItem}</p>
                        <p className="text-sm text-muted-foreground">{expense.expenseCategory}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p>${(expense.perYear || 0).toLocaleString()}/year</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
