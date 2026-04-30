// Public route: accept a CRM invitation.
//
// IMPORTANT — exemption to the project-wide "all signups redirect to
// app.hobsonschoice.ai/signup" rule. CRM invitees are internal staff,
// not marketing-funnel signups; they must land on /crm after acceptance.
// Do not "fix" this redirect later.

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

type State =
  | { kind: "loading" }
  | { kind: "needs_signin"; token: string }
  | { kind: "email_mismatch"; invitedEmail: string; message: string }
  | { kind: "error"; message: string }
  | { kind: "success" };

export default function CrmAcceptInvite() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<State>({ kind: "loading" });

  const token = params.get("token") ?? "";

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setState({
        kind: "error",
        message: "This invitation link is missing a token.",
      });
      return;
    }

    if (!user) {
      setState({ kind: "needs_signin", token });
      return;
    }

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.functions.invoke(
        "crm-accept-invite",
        { body: { token } },
      );
      if (cancelled) return;

      if (error) {
        setState({ kind: "error", message: error.message });
        return;
      }
      if (data?.error === "email_mismatch") {
        setState({
          kind: "email_mismatch",
          invitedEmail: data.invited_email,
          message: data.message,
        });
        return;
      }
      if (data?.error) {
        setState({ kind: "error", message: data.error });
        return;
      }
      setState({ kind: "success" });
      setTimeout(() => navigate("/crm", { replace: true }), 1200);
    })();

    return () => {
      cancelled = true;
    };
  }, [token, user, authLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Helmet>
        <title>Accept CRM invitation | Hobson</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight mb-1">
          CRM invitation
        </h1>

        {state.kind === "loading" && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mt-4">
            <Loader2 className="size-4 animate-spin" />
            Verifying your invitation…
          </div>
        )}

        {state.kind === "needs_signin" && (
          <>
            <p className="text-sm text-slate-600 mt-2">
              You need to sign in (or create an account with the same email
              the invite was sent to) before you can accept this invitation.
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() =>
                navigate(
                  `/auth?returnTo=${encodeURIComponent(
                    `/crm/accept-invite?token=${encodeURIComponent(state.token)}`,
                  )}`,
                )
              }
            >
              Sign in to continue
            </Button>
          </>
        )}

        {state.kind === "email_mismatch" && (
          <>
            <div className="mt-4 flex items-start gap-2 text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              <span>{state.message}</span>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              You're currently signed in as <strong>{user?.email}</strong>.
            </p>
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={async () => {
                await signOut();
                navigate(
                  `/auth?returnTo=${encodeURIComponent(
                    `/crm/accept-invite?token=${encodeURIComponent(token)}`,
                  )}`,
                );
              }}
            >
              Sign out and use the right email
            </Button>
          </>
        )}

        {state.kind === "error" && (
          <>
            <div className="mt-4 flex items-start gap-2 text-red-800 bg-red-50 border border-red-200 rounded-md p-3 text-sm">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              <span>{state.message}</span>
            </div>
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Back to homepage
            </Button>
          </>
        )}

        {state.kind === "success" && (
          <div className="mt-4 flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md p-3 text-sm">
            <CheckCircle2 className="size-4" />
            Invitation accepted. Redirecting to the CRM…
          </div>
        )}
      </div>
    </div>
  );
}
