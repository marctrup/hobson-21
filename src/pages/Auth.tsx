import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import hobsonOwl from "@/assets/hobson-owl.png";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user && !isLoading) {
      checkUserRoleAndRedirect();
    }
  }, [user, isLoading, navigate]);

  const checkUserRoleAndRedirect = async () => {
    // Honour ?returnTo=/some/path if present (only same-origin paths)
    const returnTo = searchParams.get("returnTo");
    if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
      navigate(returnTo, { replace: true });
      return;
    }

    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id)
        .eq("role", "admin")
        .single();

      if (data) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch {
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
    <>
    <Helmet>
      <title>Sign In | Hobson AI</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <img
          src={hobsonOwl}
          alt="Hobson"
          className="h-20 w-20 object-contain mb-3"
        />
        <div className="text-lg font-semibold tracking-tight mb-6">
          Hobson CRM
        </div>
        <AuthForm
          mode={mode}
          onToggleMode={handleToggleMode}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
    </>
  );
}