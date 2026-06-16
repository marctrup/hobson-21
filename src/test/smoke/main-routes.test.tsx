import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../utils";
import { Homepage } from "@/components/Homepage";
import Pricing from "@/pages/Pricing";
import ContactUs from "@/pages/ContactUs";
import Blog from "@/pages/Blog";
import InvestmentOpportunity from "@/pages/InvestmentOpportunity";
import Learn from "@/pages/Learn";

/**
 * Layer 1 — main site smoke tests.
 * Each page mounts inside the standard provider tree (router, query, helmet)
 * with Supabase fully mocked. If a page throws on mount (broken import,
 * bad hook, missing provider, runtime error in render), the test fails.
 */
const cases: Array<[string, () => JSX.Element, string]> = [
  ["Homepage (/)",                    () => <Homepage />,              "/"],
  ["Pricing (/pricing)",              () => <Pricing />,               "/pricing"],
  ["Contact (/contact)",              () => <ContactUs />,             "/contact"],
  ["Blog (/blog)",                    () => <Blog />,                  "/blog"],
  ["Investment (/investment-opportunity)", () => <InvestmentOpportunity />, "/investment-opportunity"],
  ["Learn FAQ (/learn/faq)",          () => <Learn />,                 "/learn/faq"],
];

describe("Main site — route smoke", () => {
  for (const [name, factory, route] of cases) {
    it(`${name} renders without throwing`, () => {
      const { container } = renderWithProviders(factory(), { route });
      expect(container).toBeTruthy();
      expect(container.textContent?.length ?? 0).toBeGreaterThan(0);
    });
  }
});
