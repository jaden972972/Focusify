"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers";

interface ProModalProps {
  open: boolean;
  onClose: () => void;
}

const PRO_FEATURES: { icon: "bolt" | "diamond" | "shield"; text: string }[] = [
  { icon: "bolt",    text: "Multiplicador XP x2 — Sube de liga el doble de rápido." },
  { icon: "bolt",    text: "Modo Hormozi — Estética negra y magenta para enfoque extremo." },
  { icon: "shield",  text: "Protección de Racha — 1 escudo por semana si olvidas estudiar." },
  { icon: "bolt",    text: "Timer 100% Ajustable — De 1 a 180 minutos para Deep Work real." },
  { icon: "diamond", text: "Estatus de Leyenda — Badge neón en todos los rankings." },
  { icon: "bolt",    text: "Algoritmo de contenido — Los mejores vídeos, no los de YouTube." },
];

export default function ProModal({ open, onClose }: ProModalProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const accent      = isDark ? "#8b5cf6" : "#D100D1";
  const accentLight = isDark ? "rgba(139,92,246,0.12)" : "rgba(209,0,209,0.07)";
  const accentBorder= isDark ? "rgba(139,92,246,0.35)" : "rgba(209,0,209,0.25)";
  const accentText  = isDark ? "#a78bfa" : "#D100D1";
  const panelBg     = isDark
    ? "rgba(10, 8, 20, 0.92)"
    : "#FFFFFF";
  const panelBorder = isDark ? "rgba(139,92,246,0.35)" : "#D100D1";
  const panelShadow = isDark
    ? "0 0 0 1px rgba(139,92,246,0.15), 0 0 60px rgba(139,92,246,0.2), 0 24px 64px rgba(0,0,0,0.7)"
    : "0 8px 48px rgba(209,0,209,0.18), 0 0 0 1px rgba(209,0,209,0.12), 0 24px 64px rgba(0,0,0,0.1)";
  const textPrimary   = isDark ? "#FFFFFF" : "#1D1D1F";
  const textSecondary = isDark ? "#9ca3af" : "#6E6E73";
  const textMuted     = isDark ? "#6b7280" : "#9ca3af";
  const featureRowBg  = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const featureRowBorder = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const btnBg         = isDark ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" : "#D100D1";
  const btnShadow     = isDark
    ? "0 0 32px rgba(139,92,246,0.4), 0 4px 16px rgba(0,0,0,0.4)"
    : "0 4px 20px rgba(209,0,209,0.35), 0 2px 8px rgba(0,0,0,0.08)";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-5 pointer-events-none"
          >
            <div
              className="relative pointer-events-auto w-full max-w-sm rounded-3xl p-8 flex flex-col gap-5 border"
              style={{
                background: panelBg,
                backdropFilter: isDark ? "blur(24px) saturate(180%)" : "none",
                WebkitBackdropFilter: isDark ? "blur(24px) saturate(180%)" : "none",
                borderColor: panelBorder,
                boxShadow: panelShadow,
              }}
            >
              {/* Glow orb (dark only) */}
              {isDark && (
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)" }}
                />
              )}

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
                style={{ color: textMuted }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Badge */}
              <div className="flex justify-center">
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
                  style={{ background: accentLight, borderColor: accentBorder, color: accentText }}
                >
                  💎 Sé una Leyenda
                </span>
              </div>

              {/* Price */}
              <div className="text-center">
                <div className="flex items-end justify-center gap-1.5 mb-1">
                  <span className="text-5xl font-black" style={{ color: textPrimary }}>€2,50</span>
                  <span className="text-sm mb-1.5" style={{ color: textMuted }}>/mes</span>
                </div>
                <p className="text-[11px]" style={{ color: textSecondary }}>
                  Sin permanencia · Cancela cuando quieras
                </p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2">
                {PRO_FEATURES.map((f) => (
                  <li
                    key={f.text}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
                    style={{ background: featureRowBg, border: `1px solid ${featureRowBorder}` }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ background: accentLight }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill={accentText} stroke="none">
                        {f.icon === "bolt"    && <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />}
                        {f.icon === "diamond" && <polygon points="12,2 22,12 12,22 2,12" />}
                        {f.icon === "shield"  && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
                      </svg>
                    </div>
                    <span className="text-[12px] font-medium leading-snug" style={{ color: textPrimary }}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { onClose(); router.push("/login"); }}
                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.12em] text-white relative overflow-hidden"
                style={{ background: btnBg, boxShadow: btnShadow }}
              >
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />
                Garantizar mi Estatus Pro →
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
