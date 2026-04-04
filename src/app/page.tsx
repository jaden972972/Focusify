"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

/* ═══════════════════════════════════════════════════════════════════════════
   COPY & DATA — Hormozi-style: pain-first, specific numbers, value-stack
   ═══════════════════════════════════════════════════════════════════════════ */

const PAINS = [
  "Abres YouTube para poner música y 40 minutos después sigues viendo shorts.",
  "Llevas una semana diciéndote 'mañana me pongo en serio'.",
  "Empiezas a estudiar y ya tienes 8 pestañas abiertas que no son el libro.",
  "Acabas el día sin haber hecho nada y sin saber exactamente cómo pasó.",
];

const VALUE_STACK = [
  { item: "Timer Pomodoro profesional + alarma real",         value: "€3/mes",  note: "vs Pomofocus Pro" },
  { item: "Filtro anti-distracciones YouTube en tiempo real", value: "€9/mes",  note: "vs Freedom App" },
  { item: "Música sin anuncios integrada en la app",          value: "€10/mes", note: "vs Spotify Premium" },
  { item: "Liga semanal — sala de 30 estudiantes reales",     value: "€0",      note: "exclusivo Studdia" },
  { item: "Playlists personalizadas por materia, ilimitadas", value: "€5/mes",  note: "vs Notion" },
  { item: "Timer ajustable 5–120 min para bloques pro",       value: "€4/mes",  note: "vs Focusmate" },
  { item: "Sincronización entre todos tus dispositivos",      value: "€2/mes",  note: "Google OAuth" },
];

const STEPS = [
  {
    n: "01",
    title: "Abre la app. Sin registro.",
    desc: "En menos de 10 segundos estás en el cockpit. Sin tutorial. Sin onboarding. El timer ya está listo.",
    icon: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  },
  {
    n: "02",
    title: "Pon tu música. Sin anuncios.",
    desc: "Elige tu playlist de la materia o busca cualquier vídeo de YouTube. Recomendaciones, shorts y anuncios: bloqueados.",
    icon: "M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z",
  },
  {
    n: "03",
    title: "Pulsa Iniciar. Desaparece el mundo.",
    desc: "El sidebar se pliega. El timer cuenta atrás. La sesión se registra en la liga. Al final: alarma, racha +1, podio.",
    icon: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
  },
];

const TESTIMONIALS = [
  {
    quote: "Solía perder 45 minutos por sesión abriendo YouTube para poner música. En la primera semana con Studdia completé 18 sesiones de foco. Subí de Novato a Aficionado en 4 días.",
    name: "Mia R.",
    role: "2.º Bachillerato · Biología",
    metric: "18 sesiones / semana",
    initials: "MR",
    color: "#8b5cf6",
  },
  {
    quote: "La liga me convirtió el estudio en un juego que no puedo perder. Esta semana soy #2 en mi sala de 30. No voy a dejar que me adelanten.",
    name: "Carlos D.",
    role: "4.º ESO · Física y Matemáticas",
    metric: "#2 en su liga",
    initials: "CD",
    color: "#f59e0b",
  },
  {
    quote: "Tengo una playlist de lo-fi para cada asignatura. Cuando suena, mi cerebro sabe que toca trabajar. Es Pavlov pero funciona de verdad.",
    name: "Jade K.",
    role: "1.º Bachillerato · Química e Historia",
    metric: "5 playlists activas",
    initials: "JK",
    color: "#10b981",
  },
];

const FAQS = [
  {
    q: "¿Realmente bloquea los anuncios de YouTube?",
    a: "El reproductor integrado usa la API oficial de YouTube IFrame. No aparecen recomendaciones, el feed lateral, ni los shorts. Solo el vídeo que tú hayas elegido. No es un bloqueador de anuncios — es que la API simplemente no los carga en modo embedded.",
  },
  {
    q: "¿Qué pasa si no me concentro más después de usarlo?",
    a: "Entonces ninguna app del mundo puede ayudarte. Studdia elimina el 100 % de las distracciones visuales de YouTube, pone música sin interrupciones y un timer que no miente. Si con eso no trabajas más, el problema es más profundo.",
  },
  {
    q: "¿La liga semanal es real?",
    a: "Cada usuario está asignado a una sala de 30 personas reales. Cada lunes se calculan los rankings por sesiones completadas esa semana. Los top 5 suben de división. Los últimos bajan. El #1 gana Pro gratis. Es exactamente como Duolingo pero para estudiar.",
  },
  {
    q: "¿Cómo cancelo si no me gusta?",
    a: "Escríbenos. Sin preguntas, sin retención agresiva, sin '¿estás seguro?'. En serio. No somos ese tipo de empresa.",
  },
  {
    q: "¿Necesito crear una cuenta?",
    a: "No. Puedes usar el timer y el reproductor sin cuenta en segundos. Solo conectas Google si quieres sincronizar tus playlists entre dispositivos y entrar en la liga.",
  },
];

const STATS = [
  { value: "0",     label: "Anuncios en toda la app" },
  { value: "<10s",  label: "Para estar en sesión" },
  { value: "€2,50", label: "Pro al mes" },
  { value: "30",    label: "Rivales reales por sala" },
];

const PRO_FEATURES = [
  "Todo lo del plan gratis",
  "Liga semanal — sala de 30 reales",
  "Timer ajustable (5–120 min)",
  "Playlists personalizadas ilimitadas",
  "Modo Neón Pro + badge exclusivo",
  "Si eres #1 de tu liga → Pro gratis",
];

const FREE_FEATURES = [
  "Timer Pomodoro completo",
  "Música sin anuncios (YouTube)",
  "4 playlists por materia",
  "1 playlist personalizada",
  "Sincronización entre dispositivos",
];

const FREE_MISSING = [
  "Liga semanal",
  "Timer ajustable (5–120 min)",
  "Playlists ilimitadas",
];

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function Landing() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const spotsLeft = 13;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Particle background ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.22 + 0.03,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050507] text-white font-sans overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* ── SCARCITY BANNER ─────────────────────────────────────────────── */}
      <div
        className="relative z-30 w-full flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-4 py-2.5 text-[11px] font-black text-center"
        style={{
          background: "linear-gradient(90deg,#7c2d12,#b91c1c,#7c2d12)",
          backgroundSize: "200% 100%",
          animation: "pro-badge 4s linear infinite",
        }}
      >
        <span className="text-yellow-300">🔥 ÚLTIMAS PLAZAS:</span>
        <span className="text-white">Solo quedan {spotsLeft} de 100 plazas Pro al precio de lanzamiento.</span>
        <span className="text-red-200 hidden sm:inline">— Cuando se llenen, sube el precio.</span>
        <a href="#pricing" className="text-yellow-300 underline hover:no-underline ml-1 font-black">
          Asegurar mi plaza →
        </a>
      </div>

      {/* ── NAVBAR ── */}
      <Navbar />

      {/* Ambient glow */}
      <div
        className="fixed top-14 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none z-0 opacity-25"
        style={{ background: "radial-gradient(ellipse at top, rgba(139,92,246,0.25) 0%, transparent 65%)" }}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-20 max-w-5xl mx-auto">
        {/* Eyebrow — pain */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-widest uppercase mb-8"
          style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)", color: "#fca5a5" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          Estás perdiendo 3 horas al día mientras &quot;estudias&quot;
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.03] mb-6 max-w-4xl">
          Deja de{" "}
          <span className="line-through decoration-red-500 decoration-[5px]" style={{ color: "#6b7280" }}>
            regalar
          </span>{" "}
          tus tardes
          <br className="hidden sm:block" /> a YouTube.{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#c4b5fd,#8b5cf6,#7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Gana la liga.
          </span>
        </h1>

        {/* Sub */}
        <p className="text-gray-300 text-xl md:text-2xl leading-relaxed mb-4 max-w-3xl font-medium">
          Studdia bloquea recomendaciones y anuncios de YouTube en tiempo real, pone tu música sin
          interrupciones y te mete en una liga semanal contra{" "}
          <strong className="text-white">29 estudiantes reales</strong>.
        </p>
        <p className="text-gray-500 text-base mb-12 max-w-xl">
          Por <strong className="text-white">€2,50/mes</strong> — menos que un Red Bull — recuperas{" "}
          <strong className="text-white">10+ horas semanales</strong> que ahora mismo estás tirando a la
          basura.
        </p>

        {/* CTA pair */}
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <button
            onClick={() => router.push("/cockpit")}
            className="group relative px-10 py-5 rounded-2xl font-black text-base uppercase tracking-[0.1em] transition-all duration-200 active:scale-[0.97] overflow-hidden"
            style={{
              background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
              boxShadow: "0 0 60px rgba(139,92,246,0.5), 0 4px 20px rgba(0,0,0,0.4)",
              border: "1px solid rgba(168,85,247,0.5)",
            }}
          >
            <span className="relative z-10">Obtener mi ventaja ahora — Gratis →</span>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.05] transition-all duration-300" />
          </button>
          <a
            href="#pricing"
            className="px-8 py-5 rounded-2xl font-bold text-sm text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all duration-200"
          >
            Ver el precio →
          </a>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center py-4 px-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-2xl md:text-3xl font-black" style={{ color: "#a78bfa" }}>
                {s.value}
              </span>
              <span className="text-gray-500 text-[10px] mt-1 tracking-wide text-center leading-tight">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          APP MOCKUP
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex justify-center px-6 pb-28">
        <div
          className="w-full max-w-4xl rounded-2xl overflow-hidden border border-violet-500/20"
          style={{ boxShadow: "0 0 100px rgba(139,92,246,0.15), 0 20px 60px rgba(0,0,0,0.6)" }}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0d10] border-b border-white/[0.05]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
            </div>
            <div className="flex-1 mx-4 h-6 rounded-md bg-white/[0.04] flex items-center px-3">
              <span className="text-gray-600 text-[11px]">🔒 studdia.vercel.app/cockpit</span>
            </div>
            <span className="text-[10px] text-green-400 font-black hidden sm:block">● EN SESIÓN</span>
          </div>
          {/* UI skeleton */}
          <div className="bg-[#08080b] p-5 grid grid-cols-3 gap-4 min-h-[260px]">
            {/* Timer */}
            <div
              className="col-span-1 flex flex-col items-center justify-center gap-4 p-5 rounded-xl"
              style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.15)" }}
            >
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="5" />
                  <circle
                    cx="40" cy="40" r="34" fill="none" stroke="#8b5cf6" strokeWidth="5"
                    strokeDasharray="213.6" strokeDashoffset="53" strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.8))" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white font-black text-lg tabular-nums">19:42</span>
                  <span className="text-violet-400 text-[8px] uppercase tracking-wider font-bold">Foco</span>
                </div>
              </div>
              <div
                className="w-full h-7 rounded-lg flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white"
                style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.3)" }}
              >
                ■ Pausa
              </div>
              <div className="flex gap-1 w-full justify-center">
                {["🥇 #1", "🔥8", "⚡ Élite"].map((b) => (
                  <span
                    key={b}
                    className="text-[9px] px-1.5 py-0.5 rounded-md font-bold"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            {/* Player */}
            <div
              className="col-span-2 flex flex-col gap-3 p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-full h-28 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.4)" }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(139,92,246,0.3)", border: "1px solid rgba(139,92,246,0.4)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#a78bfa">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-[9px] text-gray-500">Lo-fi Hip Hop Radio · sin anuncios</span>
                </div>
              </div>
              <div className="flex gap-2">
                {["Music 🎵", "Maths 📐", "+ Nueva"].map((t, i) => (
                  <div
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                    style={
                      i === 0
                        ? { background: "rgba(139,92,246,0.2)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }
                        : { background: "rgba(255,255,255,0.04)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.06)" }
                    }
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-green-500 mt-auto font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Anti-distracción activo · 0 anuncios · 0 recomendaciones · 0 shorts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PAIN — "¿Te suena esto?"
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 pb-28 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: "#f87171" }}>
            El problema
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">¿Te suena esto?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {PAINS.map((pain, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 rounded-2xl"
              style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}
            >
              <span className="text-2xl shrink-0">😬</span>
              <p className="text-gray-300 text-sm leading-relaxed font-medium">{pain}</p>
            </div>
          ))}
        </div>
        {/* Agitation stat */}
        <div
          className="p-7 rounded-2xl text-center"
          style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}
        >
          <p className="text-lg md:text-xl font-bold text-white leading-relaxed">
            La media de un estudiante de Bachillerato pierde{" "}
            <span style={{ color: "#a78bfa" }}>3 horas y 14 minutos al día</span> en distracciones
            digitales mientras &quot;estudia&quot;.
          </p>
          <p className="text-gray-500 text-base mt-3">
            Multiplícalo por 5 días. Son <strong className="text-white">16 horas a la semana</strong> que
            nunca vuelven.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Eso es 832 horas al año. Suficiente para aprender 4 idiomas. O para suspender selectividad.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 px-6 pb-28 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-violet-400 mb-3">
            3 pasos. 10 segundos.
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Así de simple.</h2>
          <p className="text-gray-600 text-base mt-3 max-w-md mx-auto">
            Sin onboarding. Sin tutorial. Sin excusas.
          </p>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-px rounded-3xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col p-8 group" style={{ background: "#08080b" }}>
              <span
                className="text-7xl font-black mb-6 leading-none select-none"
                style={{ color: "rgba(139,92,246,0.15)" }}
              >
                {s.n}
              </span>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d={s.icon} />
                </svg>
              </div>
              <h3 className="text-white font-black text-lg mb-3">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          VALUE STACK — Grand Slam Offer
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 pb-28 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-violet-400 mb-3">
            La oferta
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            Lo que pagas vs.{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#c4b5fd,#8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              lo que obtienes.
            </span>
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Studdia Pro reemplaza 4 suscripciones que necesitas pero probablemente no tienes.
          </p>
        </div>

        <div
          className="rounded-3xl overflow-hidden border border-white/[0.08]"
          style={{ background: "#0a0a0d" }}
        >
          {/* Header row */}
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">
              Qué incluye
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">
              Valor real
            </span>
          </div>

          {/* Items */}
          {VALUE_STACK.map((v, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6"
                  strokeWidth="2.5" className="shrink-0"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-sm text-gray-200 font-medium truncate">{v.item}</span>
                <span className="text-[10px] text-gray-600 hidden sm:inline shrink-0">({v.note})</span>
              </div>
              <span className="shrink-0 text-sm font-black ml-4" style={{ color: "#a78bfa" }}>
                {v.value}
              </span>
            </div>
          ))}

          {/* Total + CTA */}
          <div className="px-6 py-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">Valor total estimado:</span>
              <span className="text-gray-500 text-sm line-through font-black">€33+/mes</span>
            </div>
            <div className="flex items-center justify-between mb-7 pb-7 border-b border-white/[0.08]">
              <span className="text-white font-black text-xl">Tu precio hoy:</span>
              <div className="flex items-end gap-1.5">
                <span
                  className="font-black text-5xl"
                  style={{
                    background: "linear-gradient(135deg,#c4b5fd,#8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  €2,50
                </span>
                <span className="text-gray-500 text-sm mb-2">/mes</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.12em] transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                boxShadow: "0 0 40px rgba(139,92,246,0.35)",
                color: "white",
              }}
            >
              Asegurar mi plaza Pro — €2,50/mes →
            </button>
            <p className="text-center text-[11px] text-gray-600 mt-3">
              Sin permanencia · Sin tarjeta hasta que decidas · Cancela cuando quieras
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 pb-28 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-violet-400 mb-3">
            Lo que dicen
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Resultados reales.
            <br />
            Nada inventado.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="relative flex flex-col p-7 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Metric badge */}
              <div
                className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-5"
                style={{
                  background: `${t.color}15`,
                  color: t.color,
                  border: `1px solid ${t.color}30`,
                }}
              >
                ★ {t.metric}
              </div>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#8b5cf6">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                  style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}33` }}
                >
                  {t.initials}
                </div>
                <div>
                  <span className="text-white text-xs font-bold block">{t.name}</span>
                  <span className="text-gray-600 text-[10px]">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PRICING — GSO CARDS
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="relative z-10 px-6 pb-28 max-w-4xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-violet-400 mb-3">
            Precio sin trampa
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
            Menos de lo que gastas
            <br />
            en una tarde de estudio.
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Sin permanencia. Sin letra pequeña. Si no te gusta, cancelas en 30 segundos.
            Sin &ldquo;¿estás seguro?&rdquo; ni retención agresiva.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* FREE */}
          <div
            className="flex flex-col p-8 rounded-3xl"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              Free — Siempre gratis
            </span>
            <div className="flex items-end gap-1.5 mb-7">
              <span className="text-5xl font-black text-white">€0</span>
              <span className="text-gray-600 text-sm mb-1.5">para siempre</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280"
                    strokeWidth="2.5" className="shrink-0 mt-0.5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
              {FREE_MISSING.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151"
                    strokeWidth="2" className="shrink-0 mt-0.5"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  <span className="line-through">{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push("/cockpit")}
              className="w-full py-3.5 rounded-2xl font-black text-sm transition-all uppercase tracking-[0.1em]"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#9ca3af",
              }}
            >
              Empezar gratis
            </button>
          </div>

          {/* PRO */}
          <div
            className="relative flex flex-col p-8 rounded-3xl"
            style={{
              background: "radial-gradient(ellipse at top, rgba(139,92,246,0.14) 0%, rgba(8,8,11,0.97) 65%)",
              border: "1px solid rgba(139,92,246,0.4)",
              boxShadow: "0 0 60px rgba(139,92,246,0.18)",
            }}
          >
            <div
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                color: "white",
                boxShadow: "0 0 20px rgba(139,92,246,0.5)",
              }}
            >
              ⚡ Solo {spotsLeft} plazas al precio de lanzamiento
            </div>
            <span
              className="text-[12px] font-black uppercase tracking-[0.2em] mb-4"
              style={{
                background: "linear-gradient(135deg,#c4b5fd,#8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Pro — Ventaja Injusta
            </span>
            <div className="flex items-end gap-1.5 mb-7">
              <span className="text-5xl font-black text-white">€2,50</span>
              <span className="text-gray-500 text-sm mb-1.5">/ mes · sin permanencia</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {PRO_FEATURES.map((f, i) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-200">
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={i === 0 ? "#6b7280" : "#8b5cf6"} strokeWidth="2.5"
                    className="shrink-0 mt-0.5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.1em] transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                boxShadow: "0 0 30px rgba(139,92,246,0.4)",
                color: "white",
              }}
            >
              Obtener mi ventaja injusta →
            </button>
            <p className="text-center text-[10px] text-gray-600 mt-3">
              El precio sube cuando se llenen las plazas
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 pb-28 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-violet-400 mb-3">FAQ</p>
          <h2 className="text-4xl font-black tracking-tight">
            Preguntas directas.
            <br />
            Respuestas directas.
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background: openFaq === i ? "rgba(139,92,246,0.06)" : "rgba(255,255,255,0.025)",
                border:
                  openFaq === i
                    ? "1px solid rgba(139,92,246,0.2)"
                    : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-white text-sm font-bold">{f.q}</span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5"
                  className="shrink-0 text-violet-400 transition-transform duration-300"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pb-32">
        <div
          className="w-full max-w-3xl rounded-3xl p-12 md:p-16 relative overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.2) 0%, rgba(5,5,7,0.97) 65%)",
            border: "1px solid rgba(139,92,246,0.25)",
            boxShadow: "0 0 80px rgba(139,92,246,0.12)",
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at top, rgba(139,92,246,0.22) 0%, transparent 70%)",
            }}
          />
          <p className="relative text-[11px] font-black uppercase tracking-[0.25em] text-violet-400 mb-6">
            Última pregunta
          </p>
          <h2 className="relative text-4xl md:text-5xl font-black tracking-tight mb-5 leading-tight">
            ¿Cuántas horas más
            <br />
            vas a regalar?
          </h2>
          <p className="relative text-gray-400 text-base mb-2 max-w-md mx-auto leading-relaxed">
            Dentro de 10 segundos puedes estar en tu primera sesión de foco real.
          </p>
          <p className="relative text-gray-600 text-sm mb-10 max-w-sm mx-auto">
            Sin registro. Sin tarjeta. Sin excusas.
          </p>
          <div className="relative flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push("/cockpit")}
              className="px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.12em] transition-all active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                boxShadow: "0 0 60px rgba(139,92,246,0.5)",
                border: "1px solid rgba(168,85,247,0.4)",
              }}
            >
              Empezar ahora — es gratis →
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-8 py-5 rounded-2xl font-bold text-sm text-gray-400 hover:text-white transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Entrar con Google
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 border-t px-6 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="#6d28d9" />
          </svg>
          <span className="font-bold text-gray-500">Studdia</span>
          <span>· Sin anuncios · Sin trampa · Hecho por un estudiante.</span>
        </div>
        <div className="flex items-center gap-5 text-[11px] text-gray-600">
          <a
            href="https://github.com/jaden972972/Studdia"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            GitHub
          </a>
          <button onClick={() => router.push("/privacy")} className="hover:text-gray-400 transition-colors">
            Privacidad
          </button>
          <button onClick={() => router.push("/terms")} className="hover:text-gray-400 transition-colors">
            Términos
          </button>
          <button
            onClick={() => router.push("/cockpit")}
            className="hover:text-gray-400 transition-colors font-bold text-gray-500"
          >
            App →
          </button>
        </div>
      </footer>
    </div>
  );
}

