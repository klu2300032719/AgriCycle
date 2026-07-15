"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { Reveal } from "@/components/motion";

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green to-green-dark text-white shadow-md shadow-green/20">
                  <Leaf className="h-4 w-4" />
                </span>
                <span className="font-serif text-lg tracking-tight text-foreground">
                  AgriWaste<span className="text-green">X</span>
                </span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                Turning farm residue into revenue. Connect farmers with
                industries that need organic waste — stop burning, start
                earning.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                Platform
              </h4>
              <ul className="space-y-2.5 text-sm text-muted">
                {[
                  ["/marketplace", "Marketplace"],
                  ["/buyers", "Nearby Buyers"],
                  ["/sell", "List Waste"],
                  ["/transport", "Transport"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="transition hover:text-green"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                Tools
              </h4>
              <ul className="space-y-2.5 text-sm text-muted">
                {[
                  ["/price-predict", "AI Price Prediction"],
                  ["/dashboard", "Analytics"],
                  ["/dashboard", "Payments"],
                ].map(([href, label]) => (
                  <li key={href + label}>
                    <Link
                      href={href}
                      className="transition hover:text-green"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                Impact
              </h4>
              <ul className="space-y-2.5 text-sm text-muted">
                <li>Reduce stubble burning</li>
                <li>Circular agri-economy</li>
                <li>Cleaner air & soil</li>
                <li>Extra income for farmers</li>
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© 2026 AgriWasteX. Built for sustainable agriculture.</p>
          <p className="font-medium text-green">
            White · Black · Green — grow better.
          </p>
        </div>
      </div>
    </footer>
  );
}
