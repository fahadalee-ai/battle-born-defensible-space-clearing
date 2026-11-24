import { useRef, useState, type ReactNode } from "react";
import { Camera, Check, ChevronLeft, ChevronRight, ImagePlus, Star, X } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { TIME_SLOTS } from "@/lib/format";
import { ActionSheet, useUI } from "@/components/native/overlays";
import { Button } from "@/components/native/ui";

export function Photo({
  src,
  alt,
  ratio = "16 / 9",
  eager = false,
  className = "",
}: {
  src: string;
  alt: string;
  ratio?: string;
  eager?: boolean;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  return (
    <div className={`photo ${className}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={ready ? "ready" : ""} onLoad={() => setReady(true)} />
    </div>
  );
}

export function Avatar({ name, size = 64, src }: { name: string; size?: number; src?: string }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "BB";
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size < 48 ? "0.8125rem" : "1.25rem" }}>
      {src ? <img src={src} alt="" /> : initials}
    </span>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "red" | "tint" }) {
  return <span className={`badge ${tone === "neutral" ? "" : tone}`}>{children}</span>;
}

export function Skeleton({ height = 16, width = "100%", radius = 8 }: { height?: number | string; width?: number | string; radius?: number }) {
  return <div className="skeleton" style={{ height, width, borderRadius: radius }} />;
}

export function EmptyState({
  image,
  alt,
  title,
  body,
  action,
}: {
  image: string;
  alt: string;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <img src={image} alt={alt} />
      <h2 className="title-3">{title}</h2>
      <p className="subhead muted" style={{ margin: 0 }}>{body}</p>
      {action}
    </div>
  );
}

export function ErrorState({ title, body, onRetry }: { title: string; body: string; onRetry: () => void }) {
  return (
    <div className="empty">
      <h2 className="title-3">{title}</h2>
      <p className="subhead muted">{body}</p>
      <Button variant="tinted" onClick={onRetry}>Retry</Button>
    </div>
  );
}

export function RatingStars({ value, onChange, label = "Rating" }: { value: number; onChange?: (value: number) => void; label?: string }) {
  return (
    <div className="stars" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= value;
        const icon = <Star size={28} strokeWidth={1.75} fill={on ? "currentColor" : "none"} />;
        return onChange ? (
          <button key={n} type="button" className={`star-btn ${on ? "on" : ""}`} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => onChange(n)}>
            {icon}
          </button>
        ) : (
          <span key={n} className={`star-btn ${on ? "on" : ""}`} aria-hidden>{icon}</span>
        );
      })}
    </div>
  );
}

export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  const compact = steps.length > 4;
  if (compact) {
    return (
      <div className="gap12">
        <div className="spread">
          <span className="footnote" style={{ color: "var(--text)", fontWeight: 600 }}>Step {current} of {steps.length}</span>
          <span className="footnote">{steps[current - 1]}</span>
        </div>
        <div className="progress-track" aria-hidden>
          <i style={{ width: `${(current / steps.length) * 100}%` }} />
        </div>
      </div>
    );
  }
  return (
    <div className="steps" aria-label="Steps">
      {steps.map((step, index) => {
        const n = index + 1;
        const state = n < current ? "done" : n === current ? "on" : "";
        return (
          <div key={step} className="step-col">
            <span className={`step-dot ${state}`}>{n < current ? <Check size={14} strokeWidth={2.5} /> : n}</span>
            <span className="caption" style={{ fontWeight: 600, color: "var(--text)" }}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}

export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [x, setX] = useState(56);
  const ref = useRef<HTMLDivElement>(null);
  const move = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const next = Math.min(92, Math.max(8, ((clientX - rect.left) / rect.width) * 100));
    setX(next);
  };
  return (
    <div
      className="ba"
      ref={ref}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(x)}
      aria-label="Before and after comparison"
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e.clientX);
      }}
    >
      <img src={after} alt={afterAlt} />
      <div className="after-clip" style={{ width: `${x}%` }}>
        <img src={before} alt={beforeAlt} style={{ width: `${(100 / x) * 100}%`, maxWidth: "none", height: "100%", objectFit: "cover" }} />
      </div>
      <i className="bar" style={{ left: `${x}%` }} />
      <button type="button" className="handle" style={{ left: `${x}%` }} aria-hidden tabIndex={-1}>
        <span><ChevronLeft size={12} /><ChevronRight size={12} /></span>
      </button>
    </div>
  );
}

export function ServiceCard({
  image,
  alt,
  name,
  benefit,
  onPress,
  layout = "scroll",
}: {
  image: string;
  alt: string;
  name: string;
  benefit: string;
  onPress: () => void;
  layout?: "scroll" | "row";
}) {
  if (layout === "row") {
    return (
      <button type="button" className="row press" onClick={onPress}>
        <img className="thumb" src={image} alt={alt} />
        <span className="row-text">
          <span className="row-title strong">{name}</span>
          <span className="row-sub">{benefit}</span>
        </span>
        <ChevronRight size={18} strokeWidth={1.75} color="var(--text-secondary)" />
      </button>
    );
  }
  return (
    <button type="button" className="card svc-card press" onClick={onPress}>
      <Photo src={image} alt={alt} ratio="4 / 3" />
      <span className="meta">
        <h3>{name}</h3>
        <span className="footnote">{benefit}</span>
        <ChevronRight size={18} color="var(--brand-ink)" />
      </span>
    </button>
  );
}

export function ProjectCard({
  before,
  after,
  beforeAlt,
  afterAlt,
  title,
  meta,
  onPress,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  title: string;
  meta: string;
  onPress: () => void;
}) {
  return (
    <article className="card" style={{ padding: 12, width: 280 }}>
      <BeforeAfter before={before} after={after} beforeAlt={beforeAlt} afterAlt={afterAlt} />
      <button type="button" className="row press" style={{ padding: "12px 4px 4px" }} onClick={onPress}>
        <span className="row-text">
          <span className="row-title strong">{title}</span>
          <span className="row-sub">{meta}</span>
        </span>
        <ChevronRight size={18} color="var(--text-secondary)" />
      </button>
    </article>
  );
}

export function DatePicker({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const base = value ? new Date(`${value}T12:00:00`) : new Date();
  const [cursor, setCursor] = useState(new Date(base.getFullYear(), base.getMonth(), 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const start = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const label = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cells: ({ day: number } | null)[] = [...Array(start).fill(null), ...Array.from({ length: days }, (_, i) => ({ day: i + 1 }))];
  while (cells.length % 7) cells.push(null);
  return (
    <div className="gap12">
      <div className="spread">
        <button type="button" className="icon-btn" aria-label="Previous month" onClick={() => setCursor(new Date(year, month - 1, 1))}>
          <ChevronLeft size={22} />
        </button>
        <strong>{label}</strong>
        <button type="button" className="icon-btn" aria-label="Next month" onClick={() => setCursor(new Date(year, month + 1, 1))}>
          <ChevronRight size={22} />
        </button>
      </div>
      <div className="cal-head" aria-hidden>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={d + i}>{d}</span>)}
      </div>
      <div className="cal-grid">
        {cells.map((cell, i) => {
          if (!cell) return <span key={`e${i}`} className="cal-day out" />;
          const date = new Date(year, month, cell.day);
          date.setHours(0, 0, 0, 0);
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
          const blocked = date < today || date.getDay() === 0 || siteConfig.blockedDates.includes(iso);
          return (
            <button key={iso} type="button" className={`cal-day ${value === iso ? "on" : ""}`} disabled={blocked} onClick={() => onChange(iso)}>
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TimeSlotGrid({ value, onChange }: { value: string; onChange: (slot: string) => void }) {
  return (
    <div className="chips" role="listbox" aria-label="Time of day">
      {TIME_SLOTS.map((slot) => (
        <button key={slot.id} type="button" className={`chip ${value === slot.id ? "on" : ""}`} onClick={() => onChange(slot.id)}>
          {slot.label}
          <span className="footnote" style={{ marginLeft: 6 }}>{slot.range}</span>
        </button>
      ))}
    </div>
  );
}

export function TimeWheel({ slot, value, onChange }: { slot: string; value: string; onChange: (time: string) => void }) {
  const times = TIME_SLOTS.find((s) => s.id === slot)?.times ?? [];
  if (!times.length) return null;
  return (
    <div className="card flat" style={{ padding: 8 }}>
      <p className="footnote" style={{ textAlign: "center", margin: "4px 0 0" }}>Preferred start</p>
      <div className="wheel">
        {times.map((time) => (
          <button key={time} type="button" className={value === time ? "on" : ""} onClick={() => onChange(time)}>
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}

async function compress(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const scale = Math.min(1, 1280 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.72);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function PhotoUploader({
  photos,
  onChange,
  max = 6,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
}) {
  const ui = useUI();
  const input = useRef<HTMLInputElement>(null);
  const [sheet, setSheet] = useState(false);
  const [camera, setCamera] = useState(false);

  const open = async (useCamera: boolean) => {
    const ok = await ui.askPermission(useCamera ? "camera" : "photos");
    if (!ok) {
      ui.toast("Permission needed", "You can still describe the property in notes.");
      return;
    }
    setCamera(useCamera);
    window.setTimeout(() => input.current?.click(), 0);
  };

  return (
    <div className="gap12">
      <div className="photos">
        {photos.map((src, index) => (
          <div className="slot" key={src.slice(0, 32) + index}>
            <img src={src} alt={`Property photo ${index + 1}`} />
            <button type="button" className="x" aria-label={`Remove photo ${index + 1}`} onClick={() => onChange(photos.filter((_, i) => i !== index))}>
              <X size={16} />
            </button>
          </div>
        ))}
        {photos.length < max ? (
          <button type="button" className="slot" onClick={() => setSheet(true)} aria-label="Add photo">
            <ImagePlus size={24} strokeWidth={1.75} />
          </button>
        ) : null}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture={camera ? "environment" : undefined}
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const data = await compress(file);
          onChange([...photos, data].slice(0, max));
        }}
      />
      <ActionSheet
        open={sheet}
        onClose={() => setSheet(false)}
        title="Add a property photo"
        actions={[
          { label: "Take Photo", onPress: () => void open(true) },
          { label: "Photo Library", onPress: () => void open(false) },
        ]}
      />
      <span className="footnote" style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Camera size={14} /> Up to {max} photos. They stay on this device.
      </span>
    </div>
  );
}

export function ProgressRing({ value, total }: { value: number; total: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = total ? value / total : 0;
  return (
    <svg className="ring" viewBox="0 0 64 64" aria-label={`${value} of ${total} complete`}>
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--fill)" strokeWidth="6" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="6"
        strokeDasharray={`${c * pct} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="36" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text)">{value}/{total}</text>
    </svg>
  );
}

export function SuccessMark() {
  return (
    <svg className="checkmark" width="88" height="88" viewBox="0 0 88 88" aria-hidden>
      <circle cx="44" cy="44" r="40" fill="none" stroke="#2A4E01" strokeWidth="4" strokeDasharray="260" strokeDashoffset="260" style={{ animation: "draw 700ms ease forwards" }} />
      <path d="M28 46 l10 10 22-24" fill="none" stroke="#2A4E01" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="60" style={{ animation: "draw 400ms ease 450ms forwards" }} />
    </svg>
  );
}
