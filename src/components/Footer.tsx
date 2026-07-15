"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4">
                <Logo size={36} compact />
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
                Legal
              </h4>
              <ul className="space-y-2.5 text-sm text-muted">
                <li>
                  <Link href="/terms" className="transition hover:text-green">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition hover:text-green">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="transition hover:text-green">
                    Admin
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="transition hover:text-green">
                    Offers & escrow
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© 2026 AgriCycle. Built for sustainable agriculture.</p>
          <p className="font-medium text-green">
            White · Black · Green — grow better.
          </p>
        </div>
      </div>
    </footer>
  );
}
