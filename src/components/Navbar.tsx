"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, LogOut, Menu, X } from "lucide-react";
import { easeOut } from "@/components/motion";
import { signOut, useSession } from "@/lib/auth-client";

const links = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/buyers", label: "Buyers" },
  { href: "/price-predict", label: "AI Pricing" },
  { href: "/transport", label: "Transport" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-white/80 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          : "border-b border-transparent bg-white/50 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.06 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green to-green-dark text-white shadow-lg shadow-green/25"
          >
            <Leaf className="h-5 w-5" strokeWidth={2.2} />
          </motion.span>
          <div className="leading-tight">
            <span className="block font-serif text-base tracking-tight text-foreground sm:text-lg">
              AgriWaste<span className="text-green">X</span>
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-muted sm:block">
              Farm Waste Exchange
            </span>
          </div>
        </Link>

        <ul className="hidden items-center gap-0.5 rounded-full border border-border/70 bg-surface/70 p-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={`relative z-10 block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active ? "text-green" : "text-muted hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm ring-1 ring-green/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="max-w-[120px] truncate text-xs font-medium text-muted">
                {session.user.name}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-green/30 hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full border border-border px-3.5 py-1.5 text-sm font-medium text-muted transition hover:border-green/30 hover:text-foreground sm:inline-flex"
            >
              Sign in
            </Link>
          )}
          <Link href="/sell" className="btn-primary hidden !py-2 !px-4 sm:inline-flex">
            Sell Waste
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-border p-2.5 text-muted transition hover:border-green/30 hover:text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden border-t border-border bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {links.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, ease: easeOut }}
                  >
                    <Link
                      href={link.href}
                      className={`block rounded-xl px-3 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-green-dim text-green"
                          : "text-muted hover:bg-surface hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
              <li>
                {session?.user ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-2 w-full rounded-xl border border-border px-3 py-3 text-left text-sm font-medium text-muted"
                  >
                    Sign out ({session.user.name})
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="mt-2 block rounded-xl border border-border px-3 py-3 text-sm font-medium text-muted"
                  >
                    Sign in
                  </Link>
                )}
              </li>
              <li>
                <Link
                  href="/sell"
                  className="btn-primary mt-2 w-full !py-3"
                >
                  Sell Waste
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
