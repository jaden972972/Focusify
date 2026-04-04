"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LogoStuddia from "@/app/components/LogoStuddia";

interface NavbarProps {
  /** Override onClick for Timer shortcut (e.g. scroll or open modal) */
  onTimer?: () => void;
  /** Override onClick for Ligas shortcut */
  onLeague?: () => void;
  /** Override onClick for Modo Video shortcut */
  onVideo?: () => void;
}

const NAV_ITEMS = [
  { label: "Timer",      key: "timer"  },
  { label: "Ligas",      key: "league" },
  { label: "Modo Video", key: "video"  },
] as const;

export default function Navbar({ onTimer, onLeague, onVideo }: NavbarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handlers: Record<string, (() => void) | undefined> = {
    timer:  onTimer,
    league: onLeague,
    video:  onVideo,
  };

  return (
    <nav
      style={{
        background: "#000000",
        borderBottom: "1px solid rgba(255, 0, 255, 0.10)",
        opacity:    mounted ? 1 : 0,
        transform:  mounted ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
      }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-14"
    >
      {/* ── Logo + wordmark ── */}
      <Link
        href="/"
        className="flex items-center gap-3 shrink-0 group"
        aria-label="Studdia — inicio"
      >
        <LogoStuddia size={50} glowIntensity="soft" />
        <span className="text-lg font-black tracking-tight text-white hidden sm:inline group-hover:opacity-80 transition-opacity">
          Studdia
        </span>
      </Link>

      {/* ── Nav shortcuts ── */}
      <div className="flex items-center gap-0.5">
        {NAV_ITEMS.map(({ label, key }) => {
          const handler = handlers[key];
          const sharedClass =
            "px-4 py-2 rounded-xl text-[13px] font-semibold text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200";

          return handler ? (
            <button key={key} onClick={handler} className={sharedClass}>
              {label}
            </button>
          ) : (
            <Link key={key} href="/cockpit" className={sharedClass}>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
