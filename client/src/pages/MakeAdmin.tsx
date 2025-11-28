import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Shield } from "lucide-react";

export default function MakeAdmin() {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const makeAdminMutation = trpc.admin.makeUserAdmin.useMutation({
    onSuccess: () => {
      toast.success("User is now an admin! Please log out and log back in.");
      setIsProcessing(false);
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
      setIsProcessing(false);
    },
  });

  const handleMakeAdmin = () => {
    setIsProcessing(true);
    makeAdminMutation.mutate({ email: "john@est.com.au" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle>Make User Admin</CardTitle>
          </div>
          <CardDescription>
            Grant admin access to view all FNA submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                This will grant admin privileges to: <strong>john@est.com.au</strong>
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Admin users can view all FNA submissions in the dashboard.
              </p>
            </div>
            
            <Button 
              onClick={handleMakeAdmin} 
              disabled={isProcessing || makeAdminMutation.isSuccess}
              className="w-full"
            >
              {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {makeAdminMutation.isSuccess ? "✓ Admin Access Granted" : "Grant Admin Access"}
            </Button>

            {makeAdminMutation.isSuccess && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-900">
                  ✓ Success! Please log out and log back in to see all submissions.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
