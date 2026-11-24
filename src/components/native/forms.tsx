import { useState, type ReactNode } from "react";
import { Check, ChevronDown, CircleAlert, Eye, EyeOff, X } from "lucide-react";
import { formatPhone } from "@/lib/format";
import { Sheet } from "@/components/native/overlays";

function intoView(e: React.FocusEvent<HTMLElement>) {
  window.setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 280);
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  error,
  autoComplete,
  icon,
  secure,
  clearable = true,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  icon?: ReactNode;
  secure?: boolean;
  clearable?: boolean;
}) {
  const [show, setShow] = useState(false);
  const actual = secure ? (show ? "text" : "password") : type;
  return (
    <label className="field">
      {label ? <span className="field-label">{label}</span> : null}
      <span className="control-wrap">
        {icon ? <span className="lead-icon">{icon}</span> : null}
        <input
          className={`control ${icon ? "pad-left" : ""}`}
          value={value}
          type={actual}
          inputMode={inputMode}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={intoView}
          aria-invalid={error ? true : undefined}
        />
        {secure ? (
          <button type="button" className="suffix-btn" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((v) => !v)}>
            {show ? <EyeOff size={20} strokeWidth={1.75} /> : <Eye size={20} strokeWidth={1.75} />}
          </button>
        ) : clearable && value ? (
          <button type="button" className="suffix-btn" aria-label={`Clear ${label || "field"}`} onClick={() => onChange("")}>
            <X size={18} strokeWidth={1.75} />
          </button>
        ) : null}
      </span>
      {error ? (
        <span className="field-error">
          <CircleAlert size={14} strokeWidth={1.75} /> {error}
        </span>
      ) : null}
    </label>
  );
}

export function PhoneInput({
  label = "Phone",
  value,
  onChange,
  error,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <Input
      label={label}
      value={formatPhone(value)}
      onChange={(v) => onChange(v.replace(/\D/g, "").slice(0, 10))}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="(775) 555-0100"
      error={error}
    />
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
  maxLength = 600,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
}) {
  return (
    <label className="field">
      {label ? <span className="field-label">{label}</span> : null}
      <textarea className="control" value={value} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} onFocus={intoView} />
      <span className="footnote" style={{ textAlign: "right" }}>{value.length}/{maxLength}</span>
      {error ? <span className="field-error"><CircleAlert size={14} /> {error}</span> : null}
    </label>
  );
}

export function Select({
  label,
  value,
  placeholder = "Select",
  options,
  onChange,
  error,
}: {
  label?: string;
  value: string;
  placeholder?: string;
  options: string[];
  onChange: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="field">
      {label ? <span className="field-label">{label}</span> : null}
      <button type="button" className="control" style={{ textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={() => setOpen(true)}>
        <span style={{ color: value ? "inherit" : "var(--text-secondary)" }}>{value || placeholder}</span>
        <ChevronDown size={18} strokeWidth={1.75} />
      </button>
      {error ? <span className="field-error"><CircleAlert size={14} /> {error}</span> : null}
      <Sheet open={open} onClose={() => setOpen(false)} title={label || placeholder}>
        <div className="group">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className="row"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              <span className="row-text"><span className="row-title">{option}</span></span>
              {value === option ? <Check size={18} strokeWidth={1.75} color="var(--brand-ink)" /> : null}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

export function SegmentedControl({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  label?: string;
}) {
  return (
    <div className="field">
      {label ? <span className="field-label">{label}</span> : null}
      <div className="segment" role="tablist" aria-label={label || "Options"}>
        {options.map((option) => (
          <button key={option} type="button" role="tab" aria-selected={value === option} className={value === option ? "on" : ""} onClick={() => onChange(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Chip({
  selected,
  children,
  onClick,
}: {
  selected?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button type="button" className={`chip press ${selected ? "on" : ""}`} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`switch ${checked ? "on" : ""}`} onClick={() => onChange(!checked)}>
      <i />
    </button>
  );
}

export function CheckRow({
  checked,
  onChange,
  label,
  detail,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  detail?: string;
}) {
  return (
    <button type="button" className="row" onClick={() => onChange(!checked)} aria-pressed={checked}>
      <span className={`check ${checked ? "on" : ""}`}>{checked ? <Check size={14} strokeWidth={3} /> : null}</span>
      <span className="row-text">
        <span className="row-title">{label}</span>
        {detail ? <span className="row-sub">{detail}</span> : null}
      </span>
    </button>
  );
}

export function Stepper({
  label,
  value,
  min = 1,
  max = 40,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="spread">
      <span className="row-title">{label}</span>
      <span className="stepper">
        <button type="button" className="icon-btn" aria-label={`Decrease ${label}`} onClick={() => onChange(Math.max(min, value - 1))} style={{ background: "var(--fill)", borderRadius: 10 }}>
          −
        </button>
        <strong>{value}</strong>
        <button type="button" className="icon-btn" aria-label={`Increase ${label}`} onClick={() => onChange(Math.min(max, value + 1))} style={{ background: "var(--fill)", borderRadius: 10 }}>
          +
        </button>
      </span>
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="spread" style={{ gap: 8 }}>
      <label className="control-wrap" style={{ flex: 1 }}>
        <span className="sr" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>{placeholder}</span>
        <input
          className="control"
          style={{ paddingLeft: 16, borderRadius: 12, background: "var(--fill)", borderColor: "transparent" }}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => {
            setFocused(true);
            intoView(e);
          }}
          onBlur={() => setFocused(false)}
        />
      </label>
      {focused || value ? (
        <button type="button" className="btn text" style={{ width: "auto" }} onMouseDown={(e) => e.preventDefault()} onClick={() => onChange("")}>
          Cancel
        </button>
      ) : null}
    </div>
  );
}
