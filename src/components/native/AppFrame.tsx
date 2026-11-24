import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { PortalCtx, takeDir } from "@/components/native/portal";
import { UIProvider } from "@/components/native/overlays";
import { Sheet } from "@/components/native/overlays";
import { Button } from "@/components/native/ui";
import { useGo } from "@/components/native/chrome";
import { useApp } from "@/lib/store";

function Animated({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const prev = useRef<string | null>(null);
  const cls = useRef("route-none");
  if (prev.current !== pathname) {
    cls.current = prev.current == null ? "route-none" : takeDir(prev.current, pathname);
    prev.current = pathname;
  }
  return (
    <div key={pathname} className={cls.current}>
      {children}
    </div>
  );
}

function GlobalSheets() {
  const app = useApp();
  const go = useGo();
  return (
    <>
      <Sheet open={app.welcome} onClose={app.dismissWelcome} title="You're in">
        <div className="gap12" style={{ paddingBottom: 12 }}>
          <p className="body">Your account is ready. The fastest next step is a free property assessment.</p>
          <Button
            variant="urgent"
            onClick={() => {
              app.dismissWelcome();
              go.push("/book?pushed=1&service=assessment");
            }}
          >
            Book Your Free Assessment
          </Button>
          <Button variant="text" onClick={app.dismissWelcome}>Not now</Button>
        </div>
      </Sheet>
      <Sheet open={app.guestGate} onClose={app.dismissGuestGate} title="Save this request">
        <div className="gap12" style={{ paddingBottom: 12 }}>
          <p className="body">Create an account or log in to confirm the booking. Your draft stays on this device.</p>
          <Button
            onClick={() => {
              app.dismissGuestGate();
              go.push("/register");
            }}
          >
            Create Account
          </Button>
          <Button
            variant="tinted"
            onClick={() => {
              app.dismissGuestGate();
              go.push("/login");
            }}
          >
            Log In
          </Button>
        </div>
      </Sheet>
      <Sheet open={app.sessionExpired} onClose={app.dismissSession} title="Session ended">
        <div className="gap12" style={{ paddingBottom: 12 }}>
          <p className="body">For your security, please log in again. Nothing else on this device was removed.</p>
          <Button
            onClick={() => {
              app.dismissSession();
              go.push("/login");
            }}
          >
            Log In
          </Button>
        </div>
      </Sheet>
    </>
  );
}

export function AppFrame({ children }: { children: ReactNode }) {
  const app = useApp();
  const phoneRef = useRef<HTMLDivElement>(null);
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setPortal(phoneRef.current);
  }, [app.ready]);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    const vv = window.visualViewport;
    const onVV = () => {
      if (!vv || !phoneRef.current) return;
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      phoneRef.current.style.setProperty("--keyboard", inset > 80 ? `${Math.round(inset)}px` : "0px");
    };
    vv?.addEventListener("resize", onVV);
    vv?.addEventListener("scroll", onVV);
    const android = /Android/i.test(navigator.userAgent);
    document.documentElement.style.setProperty("--status-h", android ? "24px" : "max(47px, env(safe-area-inset-top))");
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
      vv?.removeEventListener("resize", onVV);
      vv?.removeEventListener("scroll", onVV);
    };
  }, []);

  if (!app.ready) {
    return (
      <div className="stage">
        <div className="phone boot" />
      </div>
    );
  }

  return (
    <div className="stage">
      <div ref={phoneRef} className="phone" data-theme={app.theme}>
        <PortalCtx.Provider value={portal}>
          <UIProvider>
            {!online ? <div className="offline">You're offline. Saved information is still available.</div> : null}
            {app.prefs.language === "es" ? (
              <div className="lang-note">Spanish copy is not published yet. Showing English. [Client to confirm]</div>
            ) : null}
            <div className="phone-body">
              <Animated>{children}</Animated>
            </div>
            <GlobalSheets />
          </UIProvider>
        </PortalCtx.Provider>
      </div>
    </div>
  );
}
