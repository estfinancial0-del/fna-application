import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AddJohnUser() {
  const [success, setSuccess] = useState(false);

  const createUserMutation = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      toast.success("User john@est.com.au created successfully!");
      setSuccess(true);
    },
    onError: (error) => {
      toast.error(`Failed to create user: ${error.message}`);
    }
  });

  const handleAddUser = () => {
    createUserMutation.mutate({
      email: "john@est.com.au",
      password: "1234",
      name: "John Calagis"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-blue-600" />
            <CardTitle>Add John User</CardTitle>
          </div>
          <CardDescription>
            Create john@est.com.au account in the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                This will create: <strong>john@est.com.au</strong>
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Password: 1234
              </p>
            </div>
            
            <Button 
              onClick={handleAddUser} 
              disabled={createUserMutation.isPending || success}
              className="w-full"
            >
              {createUserMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {success ? "✓ User Created" : "Create User"}
            </Button>

            {success && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-900">
                  ✓ Success! You can now login with john@est.com.au
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
