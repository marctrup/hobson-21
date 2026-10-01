import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Returns the window to the top whenever the route changes,
 * so each page opens fresh rather than keeping the previous scroll position.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // A section anchor (e.g. /web-summit#questions): glide to it instead
      // of the top. Retry briefly so lazy-rendered sections are present.
      let attempts = 0;
      const tryScroll = () => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempts++ < 10) {
          setTimeout(tryScroll, 100);
        }
      };
      tryScroll();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
