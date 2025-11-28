import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function RunMigration() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const migrationMutation = trpc.migrate.runMigration.useMutation({
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      setResult({ success: false, message: error.message });
    },
  });

  const handleRunMigration = () => {
    setResult(null);
    migrationMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Database Migration</CardTitle>
          <CardDescription>
            Click the button below to run the database migration that adds EFTPOS payment method support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleRunMigration}
            disabled={migrationMutation.isPending}
            className="w-full"
            size="lg"
          >
            {migrationMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Run Migration
          </Button>

          {result && (
            <div
              className={`p-4 rounded-lg border ${
                result.success
                  ? "bg-green-50 border-green-200 text-green-900"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <div>
                  <p className="font-semibold">
                    {result.success ? "Success!" : "Error"}
                  </p>
                  <p className="text-sm">{result.message}</p>
                </div>
              </div>
            </div>
          )}

          {result?.success && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Migration completed! You can now close this page.
              </p>
              <Button
                variant="outline"
                onClick={() => window.close()}
              >
                Close Window
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
