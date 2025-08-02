import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

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
      "Name",
      "Company", 
      "Role",
      "Email",
      "Phone",
      "Preferred Contact",
      "Website",
      "Business Types",
      "Help Needed",
      "Submitted Date"
    ];

    const csvData = applications.map(app => [
      app.name,
      app.company,
      app.role,
      app.email,
      app.phone || "",
      app.preferred_contact || "",
      app.website || "",
      app.business_types?.join("; ") || "",
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
    link.setAttribute("download", `pilot-applications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <CardTitle>Pilot Applications ({applications.length})</CardTitle>
              <Button onClick={exportToCSV} variant="outline">
                Export to CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingApplications ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pilot applications found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Business Types</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.name}</TableCell>
                        <TableCell>{app.company}</TableCell>
                        <TableCell>{app.role}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.phone || "N/A"}</TableCell>
                        <TableCell>
                          {app.business_types?.map((type) => (
                            <Badge key={type} variant="secondary" className="mr-1 mb-1">
                              {type}
                            </Badge>
                          )) || "N/A"}
                        </TableCell>
                        <TableCell>
                          {app.website ? (
                            <a 
                              href={app.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Visit
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(app.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
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