"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { easeOut } from "@/components/motion";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-green">
          <span className="h-px w-6 bg-green/60" />
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Card({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  if (!hover) {
    return (
      <div
        className={`rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className={`card-premium p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "green" | "outline" | "warn" | "muted";
}) {
  const styles = {
    default: "bg-surface text-foreground ring-1 ring-border",
    green: "bg-green-dim text-green ring-1 ring-green/30",
    outline: "border border-border text-muted",
    warn: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/25",
    muted: "bg-surface text-muted",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function GradeBadge({ grade }: { grade: "A" | "B" | "C" }) {
  const map = {
    A: "bg-green-dim text-green ring-1 ring-green/40",
    B: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/25",
    C: "bg-surface text-muted ring-1 ring-border",
  };
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${map[grade]}`}
    >
      {grade}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card hover className="relative overflow-hidden">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green/8 blur-2xl" />
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-2 font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs font-medium text-green">{hint}</p>}
    </Card>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const styles = {
    primary: "btn-primary rounded-full",
    secondary:
      "rounded-full bg-foreground px-5 py-2.5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-neutral-800",
    ghost:
      "rounded-full bg-transparent px-4 py-2.5 text-muted transition hover:bg-surface hover:text-foreground",
    outline: "btn-ghost",
  };
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`inline-flex items-center justify-center gap-2 text-sm disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function Input({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (v: string) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-muted"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted/50 focus:border-green/50 focus:ring-2 focus:ring-green/15"
      />
    </div>
  );
}

export function Select({
  label,
  id,
  value,
  onChange,
  options,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-muted"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-green/50 focus:ring-2 focus:ring-green/15"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      <p className="text-lg font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}
