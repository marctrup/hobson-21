import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      checkUserRoleAndRedirect();
    }
  }, [user, isLoading, navigate]);

  const checkUserRoleAndRedirect = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id)
        .eq("role", "admin")
        .single();

      if (data) {
        // User is admin, redirect to admin page
        navigate("/admin");
      } else {
        // User is not admin, redirect to landing page
        navigate("/");
      }
    } catch (error) {
      // If there's an error or no role found, redirect to landing page
      navigate("/");
    }
  };

  const handleToggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  const handleSuccess = () => {
    // The redirect will be handled by the useEffect above
    // when the user state updates
  };

  if (isLoading) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <AuthForm 
        mode={mode} 
        onToggleMode={handleToggleMode}
        onSuccess={handleSuccess}
      />
    </div>
  );
}