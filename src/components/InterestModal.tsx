import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const C = {
  bg: "#FFFFFF",
  purple: "#534AB7",
  navy: "#1A1A2E",
  muted: "#6B6B8A",
  greenBg: "#ECFDF5",
  greenText: "#166534",
};

interface InterestModalProps {
  open: boolean;
  onClose: () => void;
  source?: string;
}

export const InterestModal = ({ open, onClose, source = "login-interest" }: InterestModalProps) => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleClose = () => {
    setFirst(""); setLast(""); setEmail("");
    setPhone(""); setCompany(""); setDone(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!first.trim() || !last.trim() || !email.trim()) return;
    setSubmitting(true);
    try {
      await supabase.functions.invoke('send-pilot-application', {
        body: {
          name: `${first.trim()} ${last.trim()}`,
          email: email.trim(),
          phone: phone.trim() || null,
          company: company.trim() || "Not provided",
          role: "Not provided",
          source,
        }
      });
      setDone(true);
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={handleClose}>
      <div className="rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl" style={{ background: C.bg }} onClick={e => e.stopPropagation()}>
        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: C.greenBg }}>
              <svg width="28" height="28" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke={C.greenText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: C.navy }}>You're on the list!</h3>
            <p className="text-sm mb-6" style={{ color: C.muted }}>We'll be in touch very soon with your access details.</p>
            <button onClick={handleClose} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: C.purple }}>Close</button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-1" style={{ color: C.navy }}>We're not quite open yet</h3>
            <p className="text-sm mb-6" style={{ color: C.muted }}>Register your interest and we'll be in touch as soon as we go live.</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="First name *" value={first} onChange={e => setFirst(e.target.value)} className="rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2" style={{ border: '1.5px solid #B0ADCF', color: C.navy, background: '#F9F9FC', colorScheme: 'light' }} />
                <input type="text" placeholder="Last name *" value={last} onChange={e => setLast(e.target.value)} className="rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2" style={{ border: '1.5px solid #B0ADCF', color: C.navy, background: '#F9F9FC', colorScheme: 'light' }} />
              </div>
              <input type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2" style={{ border: '1.5px solid #B0ADCF', color: C.navy, background: '#F9F9FC', colorScheme: 'light' }} />
              <input type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2" style={{ border: '1.5px solid #B0ADCF', color: C.navy, background: '#F9F9FC', colorScheme: 'light' }} />
              <input type="text" placeholder="Company (optional)" value={company} onChange={e => setCompany(e.target.value)} className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2" style={{ border: '1.5px solid #B0ADCF', color: C.navy, background: '#F9F9FC', colorScheme: 'light' }} />
            </div>
            <button onClick={handleSubmit} disabled={submitting || !first.trim() || !last.trim() || !email.trim()} className="w-full mt-5 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50" style={{ background: C.purple }}>
              {submitting ? "Submitting…" : "Get early access"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
