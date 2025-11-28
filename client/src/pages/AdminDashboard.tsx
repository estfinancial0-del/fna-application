import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { FileText, Search, Calendar, User, DollarSign } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { APP_LOGO } from "@/const";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all FNA submissions
  const { data: submissions, isLoading } = trpc.fna.getAllSubmissions.useQuery(undefined, {
    enabled: !!user,
  });

  // Redirect if not logged in
  if (!loading && !user) {
    setLocation("/login");
    return null;
  }

  // Filter submissions based on search query
  const filteredSubmissions = submissions?.filter((submission: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      submission.clientName?.toLowerCase().includes(searchLower) ||
      submission.email?.toLowerCase().includes(searchLower) ||
      submission.phone?.includes(searchQuery)
    );
  });

  // Calculate statistics
  const totalSubmissions = submissions?.length || 0;
  const completedSubmissions = submissions?.filter((s: any) => s.status === "submitted").length || 0;
  const draftSubmissions = submissions?.filter((s: any) => s.status === "draft").length || 0;

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "submitted") {
      return <Badge className="bg-green-600">Submitted</Badge>;
    }
    return <Badge variant="secondary">Draft</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="EST Capital" className="h-8" />
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">All FNA submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSubmissions}</div>
              <p className="text-xs text-muted-foreground">Submitted FNAs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftSubmissions}</div>
              <p className="text-xs text-muted-foreground">Draft submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>FNA Submissions</CardTitle>
                <CardDescription>View and manage all financial needs analysis submissions</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading submissions...</div>
            ) : filteredSubmissions && filteredSubmissions.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission: any) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          {submission.clientName || "N/A"}
                        </TableCell>
                        <TableCell>{submission.email || "N/A"}</TableCell>
                        <TableCell>{submission.phone || "N/A"}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(submission.submittedAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/admin/fna/${submission.id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? "No submissions match your search." : "No submissions yet."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
