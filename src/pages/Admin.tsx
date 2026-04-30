import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, BookOpen, FileText } from "lucide-react";

const ADMIN_SECTIONS = [
  {
    title: "Blog",
    description: "Create, edit and publish blog posts.",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "FAQ Management",
    description: "Manage frequently asked questions shown across the site.",
    href: "/admin/faq-management",
    icon: HelpCircle,
  },
  {
    title: "Glossary Management",
    description: "Manage glossary terms and definitions.",
    href: "/admin/glossary-management",
    icon: BookOpen,
  },
];

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth?returnTo=/admin");
      return;
    }

    const checkAdminRole = async () => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Access denied",
            description: "You need admin privileges to access this page.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setIsAdmin(true);
      } catch (error: any) {
        toast({
          title: "Error checking permissions",
          description: error.message,
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminRole();
  }, [user, authLoading, navigate, toast]);

  if (authLoading || checkingAdmin) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="container mx-auto py-10 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
        <p className="mt-2 text-muted-foreground">
          Manage site content and configuration.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_SECTIONS.map(({ title, description, href, icon: Icon }) => (
          <Link key={href} to={href} className="group">
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-secondary p-2 text-secondary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary">
                    {title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
