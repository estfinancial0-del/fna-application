import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Users } from "lucide-react";

interface FinancialDependentsModuleProps {
  submissionId: number;
}

interface Dependent {
  id?: number;
  name: string;
  dateOfBirth: string;
  relationship: string;
  financiallyDependent: boolean;
  untilAge: number;
  sex: string;
}

export function FinancialDependentsModule({ submissionId }: FinancialDependentsModuleProps) {
  const [dependents, setDependents] = useState<Dependent[]>([]);
  
  const { data: existingDependents, isLoading } = trpc.fna.getFinancialDependents.useQuery({
    fnaSubmissionId: submissionId,
  });
  
  const addDependentMutation = trpc.fna.addFinancialDependent.useMutation();
  const deleteDependentMutation = trpc.fna.deleteFinancialDependent.useMutation();
  
  useEffect(() => {
    if (existingDependents && existingDependents.length > 0) {
      setDependents(
        existingDependents.map((dep) => ({
          id: dep.id,
          name: dep.name || "",
          dateOfBirth: dep.dateOfBirth ? new Date(dep.dateOfBirth).toISOString().split('T')[0] : "",
          relationship: dep.relationship || "",
          financiallyDependent: dep.financiallyDependent || false,
          untilAge: dep.untilAge || 18,
          sex: dep.sex || "",
        }))
      );
    }
  }, [existingDependents]);
  
  const addDependent = () => {
    setDependents([
      ...dependents,
      {
        name: "",
        dateOfBirth: "",
        relationship: "",
        financiallyDependent: true,
        untilAge: 18,
        sex: "",
      },
    ]);
  };
  
  const removeDependent = async (index: number) => {
    const dependent = dependents[index];
    if (dependent.id) {
      try {
        await deleteDependentMutation.mutateAsync({
          id: dependent.id,
        });
        toast.success("Dependent removed");
      } catch (error) {
        toast.error("Failed to remove dependent");
        return;
      }
    }
    setDependents(dependents.filter((_, i) => i !== index));
  };
  
  const updateDependent = (index: number, field: keyof Dependent, value: any) => {
    const updated = [...dependents];
    updated[index] = { ...updated[index], [field]: value };
    setDependents(updated);
  };
  
  const saveDependent = async (index: number) => {
    const dependent = dependents[index];
    
    if (!dependent.name || !dependent.relationship) {
      toast.error("Please fill in name and relationship");
      return;
    }
    
    try {
      const result = await addDependentMutation.mutateAsync({
        fnaSubmissionId: submissionId,
        name: dependent.name,
        dateOfBirth: dependent.dateOfBirth ? new Date(dependent.dateOfBirth) : undefined,
        relationship: dependent.relationship,
        financiallyDependent: dependent.financiallyDependent,
        untilAge: dependent.untilAge,
        sex: dependent.sex,
      });
      
      // Update the dependent with the returned ID
      const updated = [...dependents];
      updated[index] = { ...updated[index], id: result.id };
      setDependents(updated);
      
      toast.success("Dependent saved");
    } catch (error) {
      toast.error("Failed to save dependent");
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading dependents...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>Financial Dependents</CardTitle>
        </div>
        <CardDescription>
          Add details of anyone financially dependent on you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {dependents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No dependents added yet. Click "Add Dependent" to get started.
          </div>
        )}
        
        {dependents.map((dependent, index) => (
          <Card key={index} className="border-2">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`name-${index}`}>Name *</Label>
                  <Input
                    id={`name-${index}`}
                    value={dependent.name}
                    onChange={(e) => updateDependent(index, "name", e.target.value)}
                    placeholder="Full name"
                    className="h-11"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`dob-${index}`}>Date of Birth</Label>
                  <Input
                    id={`dob-${index}`}
                    type="date"
                    value={dependent.dateOfBirth}
                    onChange={(e) => updateDependent(index, "dateOfBirth", e.target.value)}
                    className="h-11"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`relationship-${index}`}>Relationship *</Label>
                  <Select
                    value={dependent.relationship}
                    onValueChange={(value) => updateDependent(index, "relationship", value)}
                  >
                    <SelectTrigger id={`relationship-${index}`} className="h-11">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Stepchild">Stepchild</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`sex-${index}`}>Sex</Label>
                  <Select
                    value={dependent.sex}
                    onValueChange={(value) => updateDependent(index, "sex", value)}
                  >
                    <SelectTrigger id={`sex-${index}`} className="h-11">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`untilAge-${index}`}>Financially Dependent Until Age</Label>
                  <Input
                    id={`untilAge-${index}`}
                    type="number"
                    value={dependent.untilAge}
                    onChange={(e) => updateDependent(index, "untilAge", parseInt(e.target.value) || 18)}
                    className="h-11"
                  />
                </div>
                
                <div className="flex items-end gap-2">
                  <Button
                    type="button"
                    onClick={() => saveDependent(index)}
                    disabled={addDependentMutation.isPending}
                    className="flex-1"
                  >
                    Save Dependent
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeDependent(index)}
                    disabled={deleteDependentMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addDependent}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Dependent
        </Button>
      </CardContent>
    </Card>
  );
}
