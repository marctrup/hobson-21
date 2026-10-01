import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Returns the window to the top whenever the route changes,
 * so each page opens fresh rather than keeping the previous scroll position.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
