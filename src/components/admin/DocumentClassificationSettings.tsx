import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ClassificationSettings {
  id: string;
  simple_document_threshold: number;
  lease_threshold: number;
  reclassification_behaviour: string;
  reclassification_message: string;
}

interface ExtractionEvent {
  id: string;
  created_at: string;
  user_email: string | null;
  document_name: string;
  declared_type: string;
  actual_tokens: number;
  charged_type: string;
  amount_charged: number;
  reclassified: boolean;
}

export default function DocumentClassificationSettings() {
  const [settings, setSettings] = useState<ClassificationSettings | null>(null);
  const [simpleThreshold, setSimpleThreshold] = useState("50000");
  const [leaseThreshold, setLeaseThreshold] = useState("50001");
  const [behaviour, setBehaviour] = useState("flag_review");
  const [message, setMessage] = useState(
    "One or more documents you uploaded as standard documents were identified as leases based on their content. The difference in extraction cost has been applied. Leases: £[lease_price]. Standard documents: £[doc_price]."
  );
  const [events, setEvents] = useState<ExtractionEvent[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAll();
  }, []);


  const fetchAll = async () => {
    try {
      const [settingsRes, eventsRes] = await Promise.all([
        supabase
          .from("document_classification_settings" as any)
          .select("*")
          .limit(1)
          .single(),
        supabase
          .from("extraction_events" as any)
          .select("*")
          .order("created_at" as any, { ascending: false })
          .limit(20),
      ]);

      if (settingsRes.data) {
        const d = settingsRes.data as any;
        setSettings(d);
        setSimpleThreshold(String(d.simple_document_threshold));
        setLeaseThreshold(String(d.lease_threshold));
        setBehaviour(d.reclassification_behaviour);
        setMessage(d.reclassification_message);
      }

      if (eventsRes.data) {
        setEvents(eventsRes.data as any[]);
      }
    } catch (err) {
      console.error("Error fetching classification settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (settings) {
        const { error } = await (supabase.from("document_classification_settings" as any) as any)
          .update({
            simple_document_threshold: parseInt(simpleThreshold),
            lease_threshold: parseInt(leaseThreshold),
            reclassification_behaviour: behaviour,
            reclassification_message: message,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settings.id);
        if (error) throw error;
      }

      toast({ title: "Classification settings updated." });
    } catch (err: any) {
      console.error("Error saving classification settings:", err);
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader><CardTitle>Document Classification Thresholds</CardTitle></CardHeader>
        <CardContent><div className="animate-pulse h-32 bg-muted rounded" /></CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Document Classification Thresholds</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-8">
          <div>
            <p className="text-sm text-muted-foreground mb-6">
              Hobson measures the actual token count of every document when it is extracted. This is used to verify the document type declared by the user and charge accurately. If a user declares a document as a simple document but the token count exceeds the lease threshold, it is automatically reclassified and the price difference is charged.
            </p>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium mb-1 block">Simple document token threshold</label>
                <Input
                  type="number"
                  min="0"
                  value={simpleThreshold}
                  onChange={e => setSimpleThreshold(e.target.value)}
                  required
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Documents below this token count are charged at the simple document rate. Typical simple documents use approximately 13,000 tokens.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Lease token threshold</label>
                <Input
                  type="number"
                  min="0"
                  value={leaseThreshold}
                  onChange={e => setLeaseThreshold(e.target.value)}
                  required
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Documents at or above this token count are charged at the lease rate. Typical leases use approximately 209,600 tokens.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Reclassification behaviour</label>
                <select
                  value={behaviour}
                  onChange={e => setBehaviour(e.target.value)}
                  disabled={saving}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="charge_auto">Charge the difference automatically and notify the user</option>
                  <option value="flag_review">Flag for manual review before charging</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  What happens when a document is reclassified based on its token count.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Reclassification notification message</label>
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Shown to the user when automatic reclassification occurs. Use [lease_price] and [doc_price] as placeholders.
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save classification settings"}
          </Button>
        </form>

      </CardContent>
    </Card>
  );
}
