import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import owlDefault from "@/assets/prototype/owl-default.png";

const SESSION_KEY = "hobson_prototype_open";

/** Set by an already-admitted container (Back Office) so prototypes embedded inside it don't ask again. */
export const PrototypeGateAdmitted = React.createContext(false);

function alreadyAdmitted(sessionKey: string): boolean {
  try {
    return window.sessionStorage.getItem(sessionKey) === "granted";
  } catch {
    return false;
  }
}

type PrototypeGateProps = {
  children: React.ReactNode;
  scope?: "work" | "unit" | "documents" | "backoffice";
};

/**
 * Doors the prototype behind a pass phrase checked on the server, so the phrase
 * never ships in the site's code and a stray link shows only a quiet entrance.
 */
export function PrototypeGate(props: PrototypeGateProps) {
  const inside = React.useContext(PrototypeGateAdmitted);
  return inside ? <>{props.children}</> : <PrototypeGateDoor {...props} />;
}

function PrototypeGateDoor({ children, scope = "work" }: PrototypeGateProps) {
  const sessionKey = scope === "unit" ? "hobson_prototype_unit_open" : scope === "documents" ? "hobson_prototype_documents_open" : scope === "backoffice" ? "hobson_prototype_backoffice_open" : SESSION_KEY;
  const [admitted, setAdmitted] = useState<boolean>(() => alreadyAdmitted(sessionKey));
  const [passphrase, setPassphrase] = useState("");
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // The demonstration must never appear in search results while it is reachable.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checking || passphrase.trim().length === 0) return;

    setChecking(true);
    setNotice(null);

    try {
      const { data, error } = await supabase.functions.invoke("prototype-gate", {
        body: { passphrase: passphrase.trim(), scope },
      });

      if (error) {
        const status = (error as { context?: { status?: number } }).context?.status;
        setNotice(
          status === 429
            ? "Too many attempts. Please try again in a little while."
            : "I'm sorry — I couldn't check that just now."
        );
        return;
      }

      if (data?.valid === true) {
        try {
          window.sessionStorage.setItem(sessionKey, "granted");
        } catch {
          // Storage may be unavailable; the door still opens for this visit.
        }
        setAdmitted(true);
        return;
      }

      setNotice("I'm sorry — that isn't recognised.");
    } catch {
      setNotice("I'm sorry — I couldn't check that just now.");
    } finally {
      setChecking(false);
    }
  }

  if (admitted) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div
        role="region"
        aria-label="Prototype entrance"
        className="w-full max-w-md text-center border border-border rounded-lg p-10 bg-card"
      >
        <img
          src={owlDefault}
          alt=""
          aria-hidden="true"
          className="h-20 w-20 mx-auto mb-6 object-contain"
        />
        <h1 className="text-2xl font-semibold text-foreground">{scope === "backoffice" ? "The Back Office" : "This room is private"}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          I'm afraid I can't show you around without being asked. If you were given a pass phrase,
          do use it.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 text-left">
          <label
            htmlFor="prototype-passphrase"
            className="block text-xs uppercase tracking-wide text-muted-foreground"
          >
            Pass phrase
          </label>
          <Input
            id="prototype-passphrase"
            name="prototype-passphrase"
            type="password"
            autoComplete="off"
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            className="mt-2"
            disabled={checking}
          />

          {notice ? (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {notice}
            </p>
          ) : null}

          <Button
            type="submit"
            className="mt-5 w-full"
            disabled={checking || passphrase.trim().length === 0}
          >
            {checking ? "One moment…" : "Enter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
