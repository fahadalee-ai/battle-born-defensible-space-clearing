import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type Variant = "primary" | "urgent" | "tinted" | "text" | "light" | "destructive";

export function Button({
  children,
  onClick,
  variant = "primary",
  block = true,
  small,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  block?: boolean;
  small?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} className={`btn press ${variant} ${block ? "block" : ""} ${small ? "small" : ""}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function IconButton({
  label,
  onClick,
  children,
  badge,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  badge?: number;
}) {
  return (
    <button type="button" className="icon-btn press" aria-label={label} onClick={onClick}>
      {children}
      {badge ? <span className="badge-count">{badge > 9 ? "9+" : badge}</span> : null}
    </button>
  );
}

export function Card({
  children,
  onPress,
  className = "",
}: {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
}) {
  if (onPress) {
    return (
      <button type="button" className={`card press ${className}`} onClick={onPress}>
        {children}
      </button>
    );
  }
  return <div className={`card ${className}`}>{children}</div>;
}

export function SectionHeader({
  title,
  action,
  onAction,
  group,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  group?: boolean;
}) {
  if (group) return <div className="group-label">{title}</div>;
  return (
    <div className="section-h">
      <h2>{title}</h2>
      {action ? (
        <button type="button" className="btn text" style={{ width: "auto", minHeight: 44 }} onClick={onAction}>
          {action}
        </button>
      ) : null}
    </div>
  );
}

export function ListItem({
  title,
  subtitle,
  detail,
  icon,
  image,
  imageAlt = "",
  chevron,
  onPress,
  destructive,
  badge,
}: {
  title: string;
  subtitle?: string;
  detail?: string;
  icon?: ReactNode;
  image?: string;
  imageAlt?: string;
  chevron?: boolean;
  onPress?: () => void;
  destructive?: boolean;
  badge?: ReactNode;
}) {
  const inner = (
    <>
      {icon}
      {image ? <img className="thumb" src={image} alt={imageAlt} /> : null}
      <span className="row-text">
        <span className={`row-title ${destructive ? "" : ""}`}>{title}</span>
        {subtitle ? <span className="row-sub">{subtitle}</span> : null}
      </span>
      {badge}
      {detail ? <span className="row-detail">{detail}</span> : null}
      {chevron ? <ChevronRight size={18} strokeWidth={1.75} color="var(--text-secondary)" /> : null}
    </>
  );
  if (!onPress) return <div className={`row ${destructive ? "destructive" : ""}`}>{inner}</div>;
  return (
    <button type="button" className={`row press ${destructive ? "destructive" : ""}`} onClick={onPress}>
      {inner}
    </button>
  );
}

export function Group({ children }: { children: ReactNode }) {
  return <div className="group">{children}</div>;
}
