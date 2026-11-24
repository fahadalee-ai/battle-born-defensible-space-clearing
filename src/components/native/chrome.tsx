import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation, useRouter } from "@tanstack/react-router";
import { Bell, CalendarDays, CalendarPlus, ChevronLeft, House, TreePine, UserRound } from "lucide-react";
import logoUrl from "@/img/logo.png";
import { markPop, markPush } from "@/components/native/portal";
import { IconButton } from "@/components/native/ui";

export function Logo({ width = 120, className = "" }: { width?: number; className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="Battle Born Defensible Space Clearing LLC"
      className={className}
      style={{ width, height: "auto" }}
      draggable={false}
    />
  );
}

const INDEX_ROUTES = new Set(["/book", "/services", "/appointments", "/profile", "/projects", "/guide", "/quotes"]);

function normalize(to: string) {
  const hashIndex = to.indexOf("#");
  const hash = hashIndex >= 0 ? to.slice(hashIndex) : "";
  const withoutHash = hash ? to.slice(0, hashIndex) : to;
  const [path, search] = withoutHash.split("?");
  const clean = path.replace(/\/$/, "") || "/";
  const next = INDEX_ROUTES.has(clean) ? `${clean}/` : path;
  return `${next}${search ? `?${search}` : ""}${hash}`;
}

export function useGo() {
  const router = useRouter();
  return useMemo(
    () => ({
      push(to: string) {
        markPush();
        void router.navigate({ href: normalize(to) });
      },
      replace(to: string) {
        markPush();
        void router.navigate({ href: normalize(to), replace: true });
      },
      back(fallback = "/home") {
        markPop();
        if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
        else void router.navigate({ href: normalize(fallback) });
      },
    }),
    [router],
  );
}

export function BackButton({ label, onPress }: { label?: string; onPress: () => void }) {
  return (
    <button type="button" className="back-btn press" onClick={onPress} aria-label={label ? `Back to ${label}` : "Back"}>
      <ChevronLeft size={28} strokeWidth={2.5} />
      {label ? <span>{label}</span> : null}
    </button>
  );
}

export function AppHeader({
  title,
  showTitle,
  back,
  onBack,
  right,
}: {
  title?: string;
  showTitle?: boolean;
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <div className="nav">
      <div className="nav-side">{back && onBack ? <BackButton onPress={onBack} /> : null}</div>
      <div className={`nav-title ${showTitle ? "" : "hidden"}`}>{title}</div>
      <div className="nav-side" style={{ justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}

const TABS = [
  { to: "/home", label: "Home", icon: House },
  { to: "/services", label: "Services", icon: TreePine },
  { to: "/book", label: "Book", icon: CalendarPlus, book: true },
  { to: "/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export function BottomTabBar() {
  const { pathname } = useLocation();
  const go = useGo();
  const path = pathname.replace(/\/$/, "") || "/";
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((tab) => {
        const active = tab.to === "/book" ? path === "/book" : path === tab.to || path.startsWith(`${tab.to}/`);
        const Icon = tab.icon;
        return (
          <button
            key={tab.to}
            type="button"
            className={`tab ${tab.book ? "book" : ""} ${active ? "active" : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={() => {
              if (path !== tab.to) go.push(tab.to);
            }}
          >
            {tab.book ? (
              <span className="book-orb">
                <Icon size={18} strokeWidth={2} />
              </span>
            ) : (
              <span className="tab-glyph">
                <Icon size={22} strokeWidth={1.75} fill={active ? "currentColor" : "none"} />
              </span>
            )}
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function ScreenContainer({
  title,
  large,
  tab,
  back,
  onBack,
  right,
  footer,
  tone = "default",
  chrome = true,
  overlay = false,
  showNavTitle = true,
  onRefresh,
  children,
}: {
  title?: string;
  large?: boolean;
  tab?: boolean;
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  footer?: ReactNode;
  tone?: "default" | "brand";
  chrome?: boolean;
  overlay?: boolean;
  statusLight?: boolean;
  showNavTitle?: boolean;
  onRefresh?: () => Promise<void> | void;
  children: ReactNode;
}) {
  const go = useGo();
  const { href } = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [dragX, setDragX] = useState(0);
  const dragXRef = useRef(0);
  const pullRef = useRef(0);
  const pullStart = useRef<number | null>(null);
  const edge = useRef<{ x: number; y: number } | null>(null);
  const handleBack = onBack ?? (() => go.back(tab ? "/home" : "/home"));

  useEffect(() => {
    if (title) document.title = `${title} · Battle Born`;
  }, [title]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = 0;
    setScrolled(false);
    window.scrollTo(0, 0);
  }, [href]);

  const canSwipe = Boolean(back || onBack);
  const standardBar = (Boolean(back) || Boolean(tab)) && tone !== "brand" && !overlay;
  const showInline = standardBar || !large || scrolled;

  return (
    <div
      className={`screen tone-${tone} ${tab ? "has-tab" : ""}`}
      style={dragX ? { transform: `translateX(${dragX}px)`, transition: edge.current ? "none" : "transform 200ms ease" } : undefined}
      onTouchStart={(e) => {
        if (!canSwipe) return;
        const t = e.touches[0];
        if (t.clientX < 24) edge.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchMove={(e) => {
        if (!edge.current) return;
        const t = e.touches[0];
        const dx = t.clientX - edge.current.x;
        const dy = Math.abs(t.clientY - edge.current.y);
        if (dx > 8 && dx > dy) {
          const next = Math.max(0, dx);
          dragXRef.current = next;
          setDragX(next);
        }
      }}
      onTouchEnd={() => {
        if (dragXRef.current > 90) handleBack();
        edge.current = null;
        dragXRef.current = 0;
        setDragX(0);
      }}
    >
      {chrome ? (
        <header className={`screen-head ${standardBar || scrolled ? "scrolled" : ""} ${overlay ? "overlay" : ""}`}>
          <AppHeader title={title} showTitle={showNavTitle && showInline} back={back} onBack={handleBack} right={right} />
        </header>
      ) : null}
      <div
        ref={scrollRef}
        className={`scroll ${!chrome ? "no-nav" : ""} ${overlay ? "overlay-scroll" : ""} ${tab ? "has-tab" : ""} ${footer ? "has-dock" : ""}`}
        style={footer && tab ? { ["--dock" as string]: "150px" } : footer ? { ["--dock" as string]: "120px" } : undefined}
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 20)}
        onTouchStart={(e) => {
          if (scrollRef.current && scrollRef.current.scrollTop <= 0) pullStart.current = e.touches[0].clientY;
          else pullStart.current = null;
        }}
        onTouchMove={(e) => {
          if (pullStart.current == null || !onRefresh) return;
          const dy = e.touches[0].clientY - pullStart.current;
          if (dy > 0 && scrollRef.current && scrollRef.current.scrollTop <= 0) {
            const next = Math.min(72, dy * 0.4);
            pullRef.current = next;
            setPull(next);
          }
        }}
        onTouchEnd={() => {
          if (pullRef.current > 56 && onRefresh) {
            setRefreshing(true);
            Promise.resolve(onRefresh()).finally(() => {
              setRefreshing(false);
              setPull(0);
            });
          } else setPull(0);
          pullRef.current = 0;
          pullStart.current = null;
        }}
      >
        <div className="pull" style={{ height: refreshing ? 36 : pull }} aria-hidden>
          {(refreshing || pull > 12) && <span className="spinner dark" />}
        </div>
        {large && chrome && !standardBar ? <h1 className="large-title">{title}</h1> : null}
        {children}
      </div>
      {footer ? <div className="dock">{footer}</div> : null}
      {tab ? <BottomTabBar /> : null}
    </div>
  );
}

export function NotifyButton({ count, onPress }: { count: number; onPress: () => void }) {
  return (
    <IconButton label="Notifications" badge={count} onClick={onPress}>
      <Bell size={24} strokeWidth={1.75} />
    </IconButton>
  );
}
