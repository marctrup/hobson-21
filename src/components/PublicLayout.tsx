import { Outlet } from "react-router-dom";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";

/**
 * Shared layout for public marketing/content pages.
 * Ensures the site footer appears on every indexed page.
 */
export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      <HomepageFooter />
    </div>
  );
};

export default PublicLayout;
