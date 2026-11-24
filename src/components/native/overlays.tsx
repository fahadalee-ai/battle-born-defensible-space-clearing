import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePortal } from "@/components/native/portal";

type AlertAction = { label: string; style?: "default" | "cancel" | "destructive"; onPress?: () => void };
type AlertOpts = { title: string; message?: string; actions: AlertAction[] };
type Toast = { id: number; title: string; body?: string };
type PushNote = { title: string; body: string } | null;
type Perm = "camera" | "photos" | "location" | "notifications";

type UI = {
  toast: (title: string, body?: string) => void;
  alert: (opts: AlertOpts) => void;
  notify: (title: string, body: string) => void;
  askPermission: (kind: Perm) => Promise<boolean>;
};

const UICtx = createContext<UI | null>(null);
const PERM_KEY = "bbdsc.permissions";

const permCopy: Record<Perm, { title: string; message: string }> = {
  camera: {
    title: "Allow camera access?",
    message: "The camera is used to photograph the property for your assessment.",
  },
  photos: {
    title: "Allow photo library access?",
    message: "Photos you choose are attached to this request and saved on this device.",
  },
  location: {
    title: "Allow location access?",
    message: "Location helps confirm you are at the property. You still enter the street address.",
  },
  notifications: {
    title: "Allow notifications?",
    message: "We will let you know when an appointment is confirmed or a quote is ready. This demo stays on this device.",
  },
};

function readPerms(): Partial<Record<Perm, "yes" | "no">> {
  try {
    return JSON.parse(localStorage.getItem(PERM_KEY) || "{}");
  } catch {
    return {};
  }
}

export function useUI() {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [push, setPush] = useState<PushNote>(null);
  const [alertState, setAlertState] = useState<AlertOpts | null>(null);
  const [perm, setPerm] = useState<{ kind: Perm; resolve: (ok: boolean) => void } | null>(null);
  const toastTimer = useRef<number | null>(null);
  const pushTimer = useRef<number | null>(null);
  const permChoice = useRef(false);

  const toast = useCallback((title: string, body?: string) => {
    const id = Date.now();
    setToasts([{ id, title, body }]);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToasts([]), 3000);
  }, []);

  const notify = useCallback((title: string, body: string) => {
    setPush({ title, body });
    if (pushTimer.current) window.clearTimeout(pushTimer.current);
    pushTimer.current = window.setTimeout(() => setPush(null), 3000);
  }, []);

  const alert = useCallback((opts: AlertOpts) => setAlertState(opts), []);

  const askPermission = useCallback((kind: Perm) => {
    const saved = readPerms()[kind];
    if (saved === "yes") return Promise.resolve(true);
    if (saved === "no") return Promise.resolve(false);
    return new Promise<boolean>((resolve) => setPerm({ kind, resolve }));
  }, []);

  const closePerm = (ok: boolean) => {
    if (!perm) return;
    const all = readPerms();
    all[perm.kind] = ok ? "yes" : "no";
    localStorage.setItem(PERM_KEY, JSON.stringify(all));
    perm.resolve(ok);
    setPerm(null);
  };

  return (
    <UICtx.Provider value={{ toast, alert, notify, askPermission }}>
      {children}
      <ToastHost toast={toasts[0]} />
      {push ? (
        <div className="push" role="status">
          <strong className="headline" style={{ display: "block" }}>{push.title}</strong>
          <p className="footnote" style={{ margin: "2px 0 0" }}>{push.body}</p>
        </div>
      ) : null}
      {alertState ? (
        <Alert
          {...alertState}
          onClose={() => setAlertState(null)}
        />
      ) : null}
      {perm ? (
        <Alert
          title={permCopy[perm.kind].title}
          message={permCopy[perm.kind].message}
          actions={[
            { label: "Don't Allow", style: "cancel", onPress: () => { permChoice.current = false; } },
            { label: "Allow", onPress: () => { permChoice.current = true; } },
          ]}
          onClose={() => closePerm(permChoice.current)}
        />
      ) : null}
    </UICtx.Provider>
  );
}

function ToastHost({ toast }: { toast?: Toast }) {
  if (!toast) return null;
  return (
    <div className="toast" role="status">
      <div>
        <div className="headline">{toast.title}</div>
        {toast.body ? <div className="footnote">{toast.body}</div> : null}
      </div>
    </div>
  );
}

export function Alert({
  title,
  message,
  actions,
  onClose,
}: AlertOpts & { onClose?: () => void }) {
  const stack = actions.length > 2;
  return (
    <div className="dim" role="presentation" onClick={onClose}>
      <div className="alert" role="alertdialog" aria-modal aria-labelledby="alert-title" onClick={(e) => e.stopPropagation()}>
        <h3 id="alert-title">{title}</h3>
        {message ? <p>{message}</p> : <div style={{ height: 12 }} />}
        <div className={`alert-actions ${stack ? "stack" : ""}`}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={action.style === "destructive" ? "destructive" : action.style === "cancel" ? "cancel" : ""}
              onClick={() => {
                action.onPress?.();
                onClose?.();
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  const portal = usePortal();
  const startY = useRef(0);
  const [dy, setDy] = useState(0);
  useEffect(() => {
    if (!open) setDy(0);
  }, [open]);
  if (!open || !portal) return null;
  return createPortal(
    <div className="dim sheet-dim" onClick={onClose} role="presentation">
      <div
        className="sheet"
        role="dialog"
        aria-modal
        aria-label={title || "Sheet"}
        style={{ transform: dy ? `translateY(${dy}px)` : undefined }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          onPointerDown={(e) => {
            startY.current = e.clientY;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const next = Math.max(0, e.clientY - startY.current);
            if (e.currentTarget.hasPointerCapture(e.pointerId)) setDy(next);
          }}
          onPointerUp={() => {
            if (dy > 90) onClose();
            else setDy(0);
          }}
        >
          <div className="handle" />
          {title ? <h3>{title}</h3> : null}
        </header>
        <div className="body">{children}</div>
      </div>
    </div>,
    portal,
  );
}

export function ActionSheet({
  open,
  onClose,
  title,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  actions: { label: string; destructive?: boolean; onPress: () => void }[];
}) {
  const portal = usePortal();
  if (!open || !portal) return null;
  return createPortal(
    <div className="dim sheet-dim" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal aria-label={title || "Actions"} onClick={(e) => e.stopPropagation()} style={{ background: "transparent" }}>
        <div className="actions" style={{ paddingBottom: 8 }}>
          <div className="group">
            {title ? <div className="row" style={{ justifyContent: "center" }}><span className="footnote">{title}</span></div> : null}
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className="row"
                style={{ justifyContent: "center", color: action.destructive ? "var(--accent-ink)" : "var(--brand-ink)", fontWeight: 500, fontSize: "1.125rem" }}
                onClick={() => {
                  action.onPress();
                  onClose();
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
          <div className="group">
            <button type="button" className="row" style={{ justifyContent: "center", fontWeight: 700, fontSize: "1.125rem", color: "var(--brand-ink)" }} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    portal,
  );
}
