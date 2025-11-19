import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/formatted-inputs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, DollarSign } from "lucide-react";
import { ComprehensiveExpensesModule } from "@/components/fna-modules/ComprehensiveExpensesModule";
import { activeFnaConfig } from "@/fnaConfig";

interface Step8Props {
  submissionId: number;
  onNext: () => void;
}

interface ExpenseForm {
  expenseCategory: string;
  expenseItem: string;
  perWeek: number;
  perMonth: number;
  perYear: number;
}

const expenseCategories = [
  "Housing",
  "Utilities",
  "Transportation",
  "Food & Groceries",
  "Healthcare",
  "Insurance",
  "Education",
  "Entertainment",
  "Personal Care",
  "Debt Payments",
  "Savings & Investments",
  "Other",
];

export function Step8Expenses({ submissionId, onNext }: Step8Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { register, handleSubmit, reset, setValue, control } = useForm<ExpenseForm>();
  
  const utils = trpc.useUtils();
  
  // Load existing expenses
  const { data: expenses = [], isLoading } = trpc.fna.getAnnualExpenses.useQuery({ 
    fnaSubmissionId: submissionId 
  });

  const addMutation = trpc.fna.addAnnualExpense.useMutation({
    onSuccess: () => {
      toast.success("Expense added successfully");
      utils.fna.getAnnualExpenses.invalidate({ fnaSubmissionId: submissionId });
      reset();
      setSelectedCategory("");
      setShowAddForm(false);
    },
    onError: (error) => {
      toast.error(`Failed to add: ${error.message}`);
    },
  });

  const deleteMutation = trpc.fna.deleteAnnualExpense.useMutation({
    onSuccess: () => {
      toast.success("Expense deleted successfully");
      utils.fna.getAnnualExpenses.invalidate({ fnaSubmissionId: submissionId });
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  const onSubmit = (data: ExpenseForm) => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    
    addMutation.mutate({
      fnaSubmissionId: submissionId,
      expenseCategory: selectedCategory,
      expenseItem: data.expenseItem,
      perWeek: Number(data.perWeek) || undefined,
      perMonth: Number(data.perMonth) || undefined,
      perYear: Number(data.perYear) || undefined,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteMutation.mutate({ id });
    }
  };

  const calculateTotals = () => {
    const totalWeekly = expenses.reduce((sum, exp) => sum + (exp.perWeek || 0), 0);
    const totalMonthly = expenses.reduce((sum, exp) => sum + (exp.perMonth || 0), 0);
    const totalYearly = expenses.reduce((sum, exp) => sum + (exp.perYear || 0), 0);
    return { totalWeekly, totalMonthly, totalYearly };
  };

  const { totalWeekly, totalMonthly, totalYearly } = calculateTotals();

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.expenseCategory || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {} as Record<string, typeof expenses>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If comprehensive expenses are enabled, use the comprehensive module
  if (activeFnaConfig.annualExpenses.comprehensive) {
    return (
      <div className="space-y-6">
        <ComprehensiveExpensesModule submissionId={submissionId} />
        <div className="flex justify-end pt-4">
          <Button onClick={onNext} className="gap-2">
            Save & Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Total Annual Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div>
              <p className="text-muted-foreground">Per Week</p>
              <p className="text-2xl font-bold text-foreground">${totalWeekly.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Per Month</p>
              <p className="text-2xl font-bold text-foreground">${totalMonthly.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Per Year</p>
              <p className="text-2xl font-bold text-primary">${totalYearly.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Form */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Annual Expenses</h3>
          <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base">Add New Expense</CardTitle>
              <CardDescription>Enter your expense details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expenseCategory">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenseItem">Expense Item</Label>
                    <Input
                      {...register("expenseItem", { required: true })}
                      placeholder="e.g., Rent, Electricity, Car Payment"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="perWeek">Per Week</Label>
                    <Controller
                      name="perWeek"
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
                    <Label htmlFor="perMonth">Per Month</Label>
                    <Controller
                      name="perMonth"
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
                    <Label htmlFor="perYear">Per Year</Label>
                    <Controller
                      name="perYear"
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
                    Add Expense
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Expenses List */}
        {expenses.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No expenses added yet</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Expense" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(expensesByCategory).map(([category, categoryExpenses]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Per Week</TableHead>
                          <TableHead className="text-right">Per Month</TableHead>
                          <TableHead className="text-right">Per Year</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryExpenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell className="font-medium">{expense.expenseItem}</TableCell>
                            <TableCell className="text-right">
                              ${(expense.perWeek || 0).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              ${(expense.perMonth || 0).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              ${(expense.perYear || 0).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(expense.id)}
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} className="gap-2">
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
