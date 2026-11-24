import { contactIntent, type ContactKind } from "@/lib/contact";
import { useUI } from "@/components/native/overlays";

export function useContact() {
  const ui = useUI();
  return (kind: ContactKind, address?: string) => {
    const intent = contactIntent(kind, address);
    if (intent.type === "alert") {
      ui.alert({ title: intent.title, message: intent.message, actions: [{ label: "OK", style: "cancel" }] });
      return;
    }
    window.location.assign(intent.url);
  };
}
