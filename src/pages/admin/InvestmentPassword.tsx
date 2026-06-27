import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";

export default function InvestmentPassword() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth?returnTo=/admin/investment-password");
      return;
    }
    (async () => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          toast({ title: "Access denied", description: "Admin privileges required.", variant: "destructive" });
          navigate("/");
          return;
        }
        setIsAdmin(true);
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
        navigate("/");
      } finally {
        setChecking(false);
      }
    })();
  }, [user, authLoading, navigate, toast]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", description: "Re-enter to confirm.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("set-investment-password", {
        body: { password },
      });
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || "Failed to update password");
      toast({ title: "Password updated", description: "The investment page password has been changed." });
      setPassword("");
      setConfirm("");
    } catch (e: any) {
      toast({ title: "Update failed", description: e.message ?? String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || checking) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="mt-2 text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <main className="container mx-auto py-10 px-4 max-w-xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Investment Page Password</h1>
        <p className="mt-2 text-muted-foreground">
          Set a new password for the <code>/investment-opportunity</code> page. The current password cannot be
          recovered — setting a new one replaces it.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-secondary p-2 text-secondary-foreground">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Set new password</CardTitle>
              <CardDescription>Minimum 6 characters. Share it only with intended viewers.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
                maxLength={100}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
