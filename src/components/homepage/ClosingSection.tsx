import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const ClosingSection = () => (
  <section className="py-24" style={{ background: "#FCFAF7" }}>
    <div className="container mx-auto px-6 max-w-3xl text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight" style={{ color: "#2D2D2D" }}>
        One conversation. One orchestrator.<br />
        <span style={{ color: "#B4914F" }}>
          Unlimited capabilities.
        </span>
      </h2>
      <p className="mt-6 text-lg" style={{ color: "#5a5a5a" }}>
        That's how Hobson thinks. Quietly, methodically, and always on your behalf.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition hover:opacity-90"
          style={{ background: "#2D2D2D", color: "#FCFAF7" }}
        >
          See pricing <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition hover:bg-[#FBF7EE]"
          style={{ background: "#FCFAF7", border: "1px solid #B4914F", color: "#2D2D2D" }}
        >
          Talk to us
        </Link>
      </div>
    </div>
  </section>
);
