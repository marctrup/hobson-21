/**
 * useAutoFollowScroll
 * --------------------
 * Shared scroll behaviour for every chat and action-sequence container in the
 * Hobson prototype.
 *
 *   1. Auto-follows new content (messages streaming, steps revealing, tables
 *      rendering) so the latest content is always in view.
 *   2. Does NOT fight the user — if they scroll up to re-read, auto-follow
 *      pauses. It resumes when they return to (or near) the bottom.
 *   3. Leaves comfortable breathing room beneath the final line via
 *      scroll-padding-bottom; pair with a bottom spacer if needed.
 *
 * Reduced-motion: jumps without animation.
 */
import { useCallback, useEffect, useRef, useState } from "react";

const BOTTOM_THRESHOLD_PX = 96;          // "near bottom" tolerance
const BREATHING_ROOM_PX = 48;            // scroll-padding gutter at the bottom

export type AutoFollowScroll = {
  /** Attach to the scrollable element. */
  ref: React.MutableRefObject<HTMLDivElement | null>;
  /** True while auto-follow is paused (user has scrolled up). */
  paused: boolean;
  /** Force jump to bottom and resume auto-follow. */
  scrollToBottom: (smooth?: boolean) => void;
};

export function useAutoFollowScroll(
  /** Dependencies that should trigger a follow attempt (messages, streaming text, etc). */
  deps: ReadonlyArray<unknown> = [],
): AutoFollowScroll {
  const ref = useRef<HTMLDivElement | null>(null);
  const pinnedRef = useRef(true);                  // start glued to bottom
  const [paused, setPaused] = useState(false);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Apply breathing-room padding once the element is attached.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // scrollPaddingBottom keeps focused elements off the edge; bottom padding
    // gives the rendered content a gutter.
    el.style.scrollPaddingBottom = `${BREATHING_ROOM_PX}px`;
    if (!el.style.paddingBottom) {
      el.style.paddingBottom = `${BREATHING_ROOM_PX}px`;
    }
  }, []);

  const goToBottom = useCallback((smooth = false) => {
    const el = ref.current;
    if (!el) return;
    if (smooth && !reducedMotion) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [reducedMotion]);

  // Track user scroll to update pinned state.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      const near = distance <= BOTTOM_THRESHOLD_PX;
      pinnedRef.current = near;
      setPaused((prev) => (prev === near ? !near : !near));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Follow content growth via ResizeObserver — covers streaming text, new
  // bubbles, revealed steps, late-arriving tables, etc.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const follow = () => {
      if (!pinnedRef.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => goToBottom(false));
    };
    const ro = new ResizeObserver(follow);
    ro.observe(el);
    const inner = el.firstElementChild as HTMLElement | null;
    if (inner) ro.observe(inner);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [goToBottom]);

  // Explicit follow on dependency changes (covers cases where layout doesn't
  // change in a way ResizeObserver notices, e.g. text-only updates).
  useEffect(() => {
    if (!pinnedRef.current) return;
    const id = requestAnimationFrame(() => goToBottom(false));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const scrollToBottom = useCallback((smooth = true) => {
    pinnedRef.current = true;
    setPaused(false);
    goToBottom(smooth);
  }, [goToBottom]);

  return { ref, paused, scrollToBottom };
}

/**
 * Small "↓ Jump to latest" affordance to pair with the hook when auto-follow
 * is paused. Keyboard-accessible.
 */
export const JUMP_BUTTON_CLASS =
  "absolute bottom-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 " +
  "px-3 py-1.5 rounded-full text-[12px] font-medium border border-[#C4B5FD] " +
  "bg-white/95 text-[#5B21B6] shadow-sm hover:bg-[#F5F3FF] " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40";
