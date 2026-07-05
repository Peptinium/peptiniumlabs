import { useEffect } from "react";

const PRESS_CLASS = "press-active";

function isPressable(el: HTMLElement): boolean {
  // Native buttons
  if (el.tagName === "BUTTON") return true;
  // Explicit button roles
  if (el.getAttribute("role") === "button") return true;
  // Link-based CTAs that look like buttons (inline-flex + rounded)
  if (el.tagName === "A") {
    const cls = el.className;
    if (typeof cls === "string") {
      const hasInlineFlex = /\binline-flex\b/.test(cls);
      const hasRounded = /\brounded(-\w+)?\b/.test(cls);
      if (hasInlineFlex && hasRounded) return true;
    }
  }
  return false;
}

function findPressable(el: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current) {
    if (isPressable(current)) return current;
    current = current.parentElement;
  }
  return null;
}

function clearPress(el: HTMLElement) {
  if (el.classList.contains(PRESS_CLASS)) {
    el.classList.remove(PRESS_CLASS);
  }
}


export function usePressEffect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onPointerDown = (e: PointerEvent) => {
      const target = findPressable(e.target as HTMLElement);
      if (target) {
        target.classList.add(PRESS_CLASS);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const target = findPressable(e.target as HTMLElement);
      if (target) clearPress(target);
    };

    const onPointerCancel = (e: PointerEvent) => {
      const target = findPressable(e.target as HTMLElement);
      if (target) clearPress(target);
    };


    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("pointerleave", onPointerUp, { passive: true });
    document.addEventListener("pointercancel", onPointerCancel, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerleave", onPointerUp);
      document.removeEventListener("pointercancel", onPointerCancel);
    };
  }, []);
}
