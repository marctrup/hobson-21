import { Link } from "react-router-dom";

export const ClosingSection = () => (
  <section className="py-24" style={{ background: "var(--paper)" }}>
    <div className="container mx-auto px-6 max-w-3xl text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight" style={{ color: "var(--ink)" }}>
        One conversation. One voice.<br />
        <span style={{ color: "var(--brass)" }}>
          Unlimited capabilities.
        </span>
      </h2>
      <p className="mt-6 text-lg" style={{ color: "var(--charcoal)" }}>
        That is how I think. Quietly, methodically, and always on your behalf.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition hover:bg-secondary"
          style={{ background: "var(--paper)", border: "1px solid var(--brass)", color: "var(--ink)" }}
        >
          Talk to me
        </Link>
      </div>
    </div>
  </section>
);
