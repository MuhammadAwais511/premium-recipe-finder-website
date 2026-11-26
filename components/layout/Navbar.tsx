
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  ChefHat,
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingBasket,
  Sun,
  X,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/categories", label: "Categories" },
  { href: "/favorites", label: "Favorites" },
  { href: "/shopping-list", label: "Shopping List" },
];

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [openForPath, setOpenForPath] = useState(pathname);

  // Hydration-safe mounted detection without useEffect
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Automatically considers menu closed after route changes
  const menuIsOpen = open && openForPath === pathname;

  // Theme
  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(isDark ? "light" : "dark");
  };

  // Mobile menu toggle
  const toggleMenu = () => {
    if (menuIsOpen) {
      setOpen(false);
      return;
    }

    setOpenForPath(pathname);
    setOpen(true);
  };

  // Active navigation link
  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/" && pathname.startsWith(`${href}/`));

  // Shared icon button styles
  const iconButtonClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/80 bg-surface/80 text-muted transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-60";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-2xl">
      <div className="container-shell">
        <div className="flex h-19 items-center justify-between gap-3 sm:gap-4">

          {/* Brand */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex shrink-0 items-center gap-2.5 sm:gap-3"
          >
            <motion.div
              whileHover={{ rotate: -6, scale: 1.05 }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary-deep text-white shadow-lg shadow-primary/20 sm:h-11 sm:w-11"
            >
              <ChefHat className="h-5 w-5" aria-hidden="true" />
            </motion.div>

            <div className="leading-none">
              <p className="font-display text-[19px] font-bold tracking-tight text-foreground sm:text-xl">
                What&apos;s In My Kitchen?
              </p>

              <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-[10px] sm:tracking-[0.2em]">
                Smart Recipe Finder
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center rounded-full border border-border/60 bg-surface/60 p-1 xl:flex"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-200 2xl:px-3.5 ${
                    active
                      ? "text-primary"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-full bg-primary/10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 xl:flex">
            <button
              type="button"
              onClick={toggleTheme}
              disabled={!mounted}
              className={iconButtonClass}
              aria-label="Toggle color theme"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="h-4.5 w-4.5" aria-hidden="true" />
              ) : (
                <Moon className="h-4.5 w-4.5" aria-hidden="true" />
              )}
            </button>

            <Link
              href="/favorites"
              className={iconButtonClass}
              aria-label="Favorites"
              title="Favorites"
            >
              <Heart className="h-4.5 w-4.5" aria-hidden="true" />
            </Link>

            <Link
              href="/shopping-list"
              className={iconButtonClass}
              aria-label="Shopping list"
              title="Shopping list"
            >
              <ShoppingBasket
                className="h-4.5 w-4.5"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/ingredients"
              className="group ml-1 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/15 transition-all duration-200 hover:bg-primary-deep hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97] 2xl:px-5"
            >
              Find Recipes
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Tablet Actions */}
          <div className="hidden items-center gap-2 md:flex xl:hidden">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-deep"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Discover
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              disabled={!mounted}
              className={iconButtonClass}
              aria-label="Toggle color theme"
            >
              {isDark ? (
                <Sun className="h-4.5 w-4.5" aria-hidden="true" />
              ) : (
                <Moon className="h-4.5 w-4.5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              disabled={!mounted}
              className={iconButtonClass}
              aria-label="Toggle color theme"
            >
              {isDark ? (
                <Sun className="h-4.5 w-4.5" aria-hidden="true" />
              ) : (
                <Moon className="h-4.5 w-4.5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleMenu}
              className={`${iconButtonClass} text-foreground`}
              aria-expanded={menuIsOpen}
              aria-controls="mobile-nav"
              aria-label={
                menuIsOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
            >
              {menuIsOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence initial={false}>
        {menuIsOpen && (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/50 md:hidden"
          >
            <motion.nav
              initial={{ y: -2 }}
              animate={{ y: 0 }}
              exit={{ y: -2 }}
              className="container-shell flex flex-col gap-1 py-4"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link, index) => {
                const active = isActive(link.href);

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -2.5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.035 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted hover:bg-surface-muted/70 hover:text-foreground"
                      }`}
                    >
                      {link.label}

                      {active && (
                        <span
                          className="h-2 w-2 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              <Link
                href="/ingredients"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/15 transition hover:bg-primary-deep"
              >
                Find Recipes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
