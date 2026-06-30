import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const ClosingSection = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6 max-w-3xl text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
        One conversation. One orchestrator.<br />
        <span className="bg-gradient-to-r from-primary to-accent-teal bg-clip-text text-transparent">
          Unlimited capabilities.
        </span>
      </h2>
      <p className="mt-6 text-lg text-slate-600">
        That's how Hobson thinks. Quietly, methodically, and always on your behalf.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold transition"
        >
          See pricing <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-purple-200 text-purple-800 hover:bg-purple-50 font-semibold transition"
        >
          Talk to us
        </Link>
      </div>
    </div>
  </section>
);
