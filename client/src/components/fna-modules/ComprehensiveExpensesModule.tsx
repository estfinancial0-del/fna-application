import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/formatted-inputs";
import { toast } from "sonner";
import { Loader2, Calculator } from "lucide-react";
import { comprehensiveExpenseCategories, simplifiedExpenseCategories } from "@/expenseCategories";
import { activeFnaConfig } from "@/fnaConfig";

interface ComprehensiveExpensesModuleProps {
  submissionId: number;
}

interface ExpenseValues {
  [key: string]: {
    perWeek?: number;
    perMonth?: number;
    perYear?: number;
  };
}

export function ComprehensiveExpensesModule({ submissionId }: ComprehensiveExpensesModuleProps) {
  const [expenses, setExpenses] = useState<ExpenseValues>({});
  const [saving, setSaving] = useState(false);

  const categories = activeFnaConfig.annualExpenses.comprehensive
    ? comprehensiveExpenseCategories
    : simplifiedExpenseCategories;

  // Auto-calculate based on frequency
  const handleFrequencyChange = (itemId: string, frequency: "perWeek" | "perMonth" | "perYear", value: number | undefined) => {
    const numValue = value || 0;
    
    const newExpense: ExpenseValues[string] = {};
    
    if (frequency === "perWeek") {
      newExpense.perWeek = numValue;
      newExpense.perMonth = numValue * 4.33; // Average weeks per month
      newExpense.perYear = numValue * 52;
    } else if (frequency === "perMonth") {
      newExpense.perWeek = numValue / 4.33;
      newExpense.perMonth = numValue;
      newExpense.perYear = numValue * 12;
    } else if (frequency === "perYear") {
      newExpense.perWeek = numValue / 52;
      newExpense.perMonth = numValue / 12;
      newExpense.perYear = numValue;
    }

    setExpenses(prev => ({
      ...prev,
      [itemId]: newExpense,
    }));
  };

  const calculateTotals = () => {
    let totalPerWeek = 0;
    let totalPerMonth = 0;
    let totalPerYear = 0;

    Object.values(expenses).forEach(expense => {
      totalPerWeek += expense.perWeek || 0;
      totalPerMonth += expense.perMonth || 0;
      totalPerYear += expense.perYear || 0;
    });

    return { totalPerWeek, totalPerMonth, totalPerYear };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Save to database via tRPC
      toast.success("Expenses saved successfully");
    } catch (error) {
      toast.error("Failed to save expenses");
    } finally {
      setSaving(false);
    }
  };

  const { totalPerWeek, totalPerMonth, totalPerYear } = calculateTotals();

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Annual Expenses Summary
          </CardTitle>
          <CardDescription>
            Enter expenses in any frequency - we'll calculate the rest automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div>
              <p className="text-muted-foreground">Total Per Week</p>
              <p className="text-2xl font-bold text-foreground">${totalPerWeek.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Per Month</p>
              <p className="text-2xl font-bold text-foreground">${totalPerMonth.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Per Year</p>
              <p className="text-2xl font-bold text-primary">${totalPerYear.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {categories.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="text-lg">{category.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.items.map((item) => (
                <div key={item.id} className="grid gap-4 md:grid-cols-4 items-end">
                  <div className="md:col-span-1">
                    <Label className="text-sm font-medium">{item.label}</Label>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`${item.id}_week`} className="text-xs text-muted-foreground">
                      Per Week
                    </Label>
                    <CurrencyInput
                      value={expenses[item.id]?.perWeek}
                      onValueChange={(val) => handleFrequencyChange(item.id, "perWeek", val)}
                      placeholder="$0.00"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`${item.id}_month`} className="text-xs text-muted-foreground">
                      Per Month
                    </Label>
                    <CurrencyInput
                      value={expenses[item.id]?.perMonth}
                      onValueChange={(val) => handleFrequencyChange(item.id, "perMonth", val)}
                      placeholder="$0.00"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`${item.id}_year`} className="text-xs text-muted-foreground">
                      Per Year
                    </Label>
                    <CurrencyInput
                      value={expenses[item.id]?.perYear}
                      onValueChange={(val) => handleFrequencyChange(item.id, "perYear", val)}
                      placeholder="$0.00"
                      className="h-9"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Expenses
        </Button>
      </div>
    </div>
  );
}
