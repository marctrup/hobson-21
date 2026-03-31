import React, { useEffect, useState } from "react";
import { getEdgeFunctionUrl } from "@/utils/supabaseHelpers";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import PricingSettings from "@/components/admin/PricingSettings";
import DocumentClassificationSettings from "@/components/admin/DocumentClassificationSettings";

interface PilotApplication {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string | null;
  preferred_contact: string | null;
  website: string | null;
  business_types: string[] | null;
  help: string | null;
  created_at: string;
}

export default function Admin() {
  const { user, isLoading, signOut } = useAuth();
  const [applications, setApplications] = useState<PilotApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      checkAdminRole();
    }
  }, [user, isLoading, navigate]);

  const checkAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id)
        .eq("role", "admin")
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setIsAdmin(true);
        fetchApplications();
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions to access this page.",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error checking admin role:", error);
      toast({
        title: "Error",
        description: "Failed to verify admin permissions.",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("pilot_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load pilot applications.",
        variant: "destructive",
      });
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const exportToCSV = () => {
    const headers = [
      "Source",
      "Name",
      "Email",
      "Phone",
      "Message",
      "Submitted Date"
    ];

    const csvData = applications.map(app => [
      app.role || "Unknown",
      app.name,
      app.email,
      app.phone || "",
      app.help || "",
      new Date(app.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `enquiries-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // Get the current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call edge function to update password (server-side hashing)
      const response = await fetch(
        getEdgeFunctionUrl('update-investment-password'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update password');
      }

      toast({
        title: "Password Updated",
        description: "Investment page password has been successfully updated.",
      });

      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update the password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Content Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Knowledge Base</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => navigate("/admin/faq-management")}>
                    Manage FAQs
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/admin/glossary-management")}>
                    Manage Glossary
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Content</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => navigate("/admin/blog")}>
                    Manage Blog
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <PricingSettings />
        <DocumentClassificationSettings />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Investment Page Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
              <div>
                <label htmlFor="newPassword" className="text-sm font-medium mb-2 block">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                    disabled={isUpdatingPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium mb-2 block">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  disabled={isUpdatingPassword}
                />
              </div>

              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Applications ({applications.length})</CardTitle>
              <Button onClick={exportToCSV} variant="outline">
                Export to CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingApplications ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading enquiries...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No enquiries found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => {
                      const source = app.role || "Unknown";
                      const badgeVariant = source.toLowerCase().includes("contact") ? "default" 
                        : source.toLowerCase().includes("waitlist") ? "secondary" 
                        : source.toLowerCase().includes("enterprise") ? "outline"
                        : "secondary";
                      return (
                        <TableRow key={app.id}>
                          <TableCell>
                            <Badge variant={badgeVariant}>{source}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{app.name}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.phone || "—"}</TableCell>
                          <TableCell className="max-w-xs truncate">{app.help || "—"}</TableCell>
                          <TableCell>
                            {new Date(app.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteApplication(app.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}