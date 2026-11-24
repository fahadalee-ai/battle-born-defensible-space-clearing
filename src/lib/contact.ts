import { isPlaceholder, siteConfig } from "@/data/siteConfig";

export type ContactKind = "call" | "text" | "email" | "directions";

export function contactIntent(kind: ContactKind, address?: string):
  | { type: "url"; url: string }
  | { type: "alert"; title: string; message: string } {
  if (kind === "call") {
    if (isPlaceholder(siteConfig.phoneDisplay) || !siteConfig.phoneTel) {
      return {
        type: "alert",
        title: "Phone not published yet",
        message: `${siteConfig.phoneDisplay}. Add the live number in site settings before this button can place a call.`,
      };
    }
    return { type: "url", url: `tel:${siteConfig.phoneTel}` };
  }
  if (kind === "text") {
    if (isPlaceholder(siteConfig.phoneDisplay) || !siteConfig.phoneTel) {
      return {
        type: "alert",
        title: "Texting not available yet",
        message: `${siteConfig.phoneDisplay}. Add the live number in site settings before this button can open Messages.`,
      };
    }
    return { type: "url", url: `sms:${siteConfig.phoneTel}` };
  }
  if (kind === "email") {
    if (isPlaceholder(siteConfig.email) || !siteConfig.email.includes("@")) {
      return {
        type: "alert",
        title: "Email not published yet",
        message: `${siteConfig.email}. Add the live address in site settings before this button can open Mail.`,
      };
    }
    return { type: "url", url: `mailto:${siteConfig.email}` };
  }
  const dest = address || siteConfig.address;
  if (isPlaceholder(dest)) {
    return {
      type: "alert",
      title: "Address not published yet",
      message: `${dest}. Add the live street address in site settings before directions can open.`,
    };
  }
  return { type: "url", url: `https://maps.apple.com/?q=${encodeURIComponent(dest)}` };
}
