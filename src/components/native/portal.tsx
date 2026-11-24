import { createContext, useContext } from "react";

export const PortalCtx = createContext<HTMLElement | null>(null);
export function usePortal() {
  return useContext(PortalCtx);
}

let intent: "push" | "pop" = "push";

export function markPop() {
  intent = "pop";
}
export function markPush() {
  intent = "push";
}

const TABS = new Set(["/home", "/services", "/book", "/appointments", "/profile"]);

function isTab(path: string) {
  const clean = path.replace(/\/$/, "") || "/";
  return TABS.has(clean);
}

export function takeDir(prev: string, next: string) {
  const fade = isTab(prev) && isTab(next);
  const cls = fade ? "route-fade" : intent === "pop" ? "route-pop" : "route-push";
  intent = "push";
  return cls;
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    intent = "pop";
  });
}
