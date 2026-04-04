"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PomodoroSection from "@/app/components/PomodoroSection";

const WORDS = ["Ventaja.", "Injusta.", "Tuya."];

const FEATURES = [
  {
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
    title: "Pomodoro Timer",
    desc: "25‑minute focus blocks with auto‑reset and session tracking. Build deep‑work streaks.",
  },
  {
    icon: "M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z",
    title: "Custom Playlists",
    desc: "Build named playlists from YouTube. Loop, shuffle, save — your music, your rules.",
  },
  {
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
    title: "YouTube Music",
    desc: "Search millions of tracks directly inside the app. Embedded player, zero friction.",
  },
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    title: "Zero Ads",
    desc: "No pre‑rolls, no banners, no distractions. Just your timer and your music.",
  },
  {
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    title: "Google Sign In",
    desc: "One‑click auth. Your playlists sync across devices through your account.",
  },
  {
    icon: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
    title: "Minimalist UI",
    desc: "Dark, distraction‑free design engineered to keep you in the zone.",
  },
];

const STATS = [
  { value: "0",    label: "Anuncios" },
  { value: "10h",  label: "Ahorradas/semana" },
  { value: "25min",label: "Sesiones deep work" },
  { value: "€2.50",label: "Precio Pro/mes" },
];

const STEPS = [
  {
    n: "01",
    title: "Pick your mode",
    desc: "Choose Focus (25 min), Short Break (5 min) or Long Break (15 min). The timer adapts its colour so you always know where you are.",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
  },
  {
    n: "02",
    title: "Set your soundtrack",
    desc: "Search YouTube or pick from a curated subject playlist — lo‑fi, maths, history, physics and more. Hit play and forget the tab.",
    icon: "M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z",
  },
  {
    n: "03",
    title: "Lock in",
    desc: "Press start. The sidebar fades away, the timer counts down and your music plays. When the session ends, your streak ticks up.",
    icon: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  },
];

const TESTIMONIALS = [
  {
    quote: "I used to lose 40 minutes every session fighting with Spotify ads. Studdia just works — I open it and I'm in the zone immediately.",
    name: "Mia R.",
    role: "University student · Biology",
    initials: "MR",
    color: "#8b5cf6",
  },
  {
    quote: "The sidebar fade when the timer runs is such a small detail but it genuinely helps. Pure focus mode.",
    name: "Carlos D.",
    role: "High school · Physics & Maths",
    initials: "CD",
    color: "#06b6d4",
  },
  {
    quote: "I built custom playlists for each subject. Now my brain literally switches into study mode the second the music starts.",
    name: "Jade K.",
    role: "A‑Levels · Chemistry & History",
    initials: "JK",
    color: "#10b981",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    accent: "#6b7280",
    accentBg: "rgba(107,114,128,0.1)",
    accentBorder: "rgba(107,114,128,0.2)",
    cta: "Start for free",
    ctaRoute: "/cockpit",
    features: [
      "Pomodoro timer (Focus / Break / Long Break)",
      "9 curated subject playlists",
      "YouTube music search",
      "Up to 5 tasks",
      "1 custom playlist",
      "Sync across devices (Google Sign In)",
    ],
    missing: [
      "Unlimited tasks",
      "Unlimited custom playlists",
    ],
  },
  {
    name: "Pro",
    price: "€2.50",
    period: "/ mes",
    accent: "#8b5cf6",
    accentBg: "rgba(139,92,246,0.12)",
    accentBorder: "rgba(139,92,246,0.35)",
    cta: "Obtener mi Ventaja Injusta",
    ctaRoute: "/login",
    badge: "Solo primeros 100 usuarios",
    features: [
      "Todo lo del plan gratuito",
      "Tareas ilimitadas",
      "Playlists personalizadas ilimitadas",
      "Timer ajustable (5–120 min)",
      "Liga semanal — sube de posición",
      "Badge Pro en la app",
    ],
    missing: [],
  },
];

const PAINS = [
  {
    emoji: "🕳️",
    pain: "YouTube es un agujero negro",
    solution: "Reproductor integrado sin recomendaciones, sin Shorts, sin feeds. Solo el vídeo que tú pones.",
    accent: "#f87171",
  },
  {
    emoji: "😴",
    pain: "Estudiar solo es aburrido",
    solution: "Sistema de Ligas semanal: compite contra otros estudiantes, sube de posición y gana estatus real.",
    accent: "#fbbf24",
  },
  {
    emoji: "📋",
    pain: "Las tareas se acumulan sin control",
    solution: "Task Dashboard con prioridades y barra de progreso. Ver el avance engancha más que el scroll infinito.",
    accent: "#8b5cf6",
  },
  {
    emoji: "⏰",
    pain: "'Solo 5 minutos más' = 2 horas perdidas",
    solution: "Pomodoro con cuenta atrás visual y chime al terminar. Tu cerebro aprende que el tiempo es real.",
    accent: "#10b981",
  },
];

const FAQS = [
  {
    q: "Is Studdia completely free?",
    a: "Studdia has a free plan with no ads. A Pro plan at €2.50/month unlocks unlimited tasks, unlimited custom playlists, and future Pro features.",
  },
  {
    q: "Do I need to create an account?",
    a: "No sign‑up is required. You can open the app and start a session immediately. Sign in with Google only if you want your playlists to sync across devices.",
  },
  {
    q: "Where does the music come from?",
    a: "All music is streamed directly from YouTube via the official IFrame API. Any video you can find on YouTube can be added to a playlist inside Studdia.",
  },
  {
    q: "Will ads play during music?",
    a: "No ads play inside the embedded player. Studdia is engineered specifically so you never hear an ad mid‑session.",
  },
  {
    q: "Can I use Studdia on mobile?",
    a: "Studdia is fully responsive. The sidebar collapses on small screens so the timer and player stay centred. Works great on any modern browser.",
  },
  {
    q: "How does playlist sync work?",
    a: "When you sign in with Google, your playlists are saved to a Supabase database. When you log in on another device, they're loaded automatically.",
  },
];

export default function Landing() {
  const router = useRouter();
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 350);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.05,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#060608] text-white font-sans overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* ── SCARCITY BANNER ── */}
      <div className="relative z-30 w-full flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-4 py-2 text-[11px] font-bold text-center"
        style={{ background: "linear-gradient(90deg,#4c1d95,#6d28d9,#4c1d95)", backgroundSize: "200% 100%", animation: "pro-badge 5s linear infinite" }}>
        <span className="text-yellow-300">⚡ Oferta de lanzamiento:</span>
        <span className="text-white">Studdia Pro a solo 2,50€ para los primeros 100 usuarios</span>
        <span className="text-white/60 hidden sm:inline">— después subirá de precio.</span>
        <a href="#pricing" className="text-yellow-300 underline hover:no-underline font-black ml-1">Ver oferta →</a>
      </div>

      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none z-0 opacity-40"
        style={{ background: "radial-gradient(ellipse at top, rgba(139,92,246,0.15) 0%, transparent 70%)" }}
      />

      {/* ── NAVBAR ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-16 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight">Studdia</span>
          <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-400 border border-violet-500/25 tracking-widest uppercase">
            beta
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
          >
            Sign in
          </button>
          <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors px-2 py-2 hidden sm:block">Pricing</a>
          <button
            onClick={() => router.push("/cockpit")}
            className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", boxShadow: "0 0 24px rgba(139,92,246,0.3)" }}
          >
            Open App →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold tracking-wide mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Sin anuncios · Sin distracciones · Abierto en segundos
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] mb-6">
          Saca las notas que esperan
          <br className="hidden sm:block" />
          {" "}sin sacrificar tus tardes de{" "}
          <span style={{ background: "linear-gradient(135deg, #a78bfa, #8b5cf6, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            basket o videojuegos.
          </span>
        </h1>

        {/* Cycling word */}
        <div className="h-12 flex items-center justify-center mb-5">
          <span
            className="text-3xl md:text-4xl font-black tracking-tight transition-all duration-300"
            style={{
              color: "#8b5cf6",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0px)" : "translateY(10px)",
            }}
          >
            {WORDS[wordIdx]}
          </span>
        </div>

        <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-3 max-w-2xl">
          Studdia Pro: el único Cockpit que elimina el 99% de las distracciones de YouTube
          y te{" "}<strong className="text-white">obliga a ser productivo mediante competición real.</strong>
        </p>
        <p className="text-gray-600 text-base mb-10 max-w-xl">
          No es una herramienta. Es tu ventaja injusta estudiando.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          <button
            onClick={() => router.push("/cockpit")}
            className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all duration-200 active:scale-95"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", boxShadow: "0 0 50px rgba(139,92,246,0.45)", border: "1px solid rgba(168,85,247,0.4)" }}
          >
            Obtener mi Ventaja Injusta →
          </button>
          <a href="#pricing"
            className="px-6 py-4 rounded-2xl font-bold text-sm text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200">
            Ver precios
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center py-5 px-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
            >
              <span className="text-3xl font-black" style={{ color: "#8b5cf6" }}>{s.value}</span>
              <span className="text-gray-500 text-xs mt-1 tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── APP PREVIEW MOCKUP ── */}
      <section className="relative z-10 flex justify-center px-6 pb-24">
        <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl" style={{ boxShadow: "0 0 80px rgba(139,92,246,0.12)" }}>
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#111113] border-b border-white/[0.06]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 mx-4 h-6 rounded-md bg-white/[0.04] flex items-center px-3">
              <span className="text-gray-600 text-xs">studdia.vercel.app/cockpit</span>
            </div>
          </div>
          {/* UI skeleton */}
          <div className="bg-[#0a0a0d] p-6 grid grid-cols-3 gap-4 min-h-[280px]">
            {/* Left panel - timer */}
            <div className="col-span-1 flex flex-col items-center justify-center gap-4 p-6 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6"/>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeDasharray="213.6" strokeDashoffset="80" strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white font-black text-lg">18:24</span>
                  <span className="text-gray-600 text-[9px] uppercase tracking-wider">focus</span>
                </div>
              </div>
              <div className="w-full h-7 rounded-lg bg-violet-600/30 border border-violet-500/20" />
              <div className="w-3/4 h-2 rounded-full bg-white/[0.04]" />
            </div>
            {/* Center / right - player */}
            <div className="col-span-2 flex flex-col gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="w-full h-32 rounded-lg bg-white/[0.03] border border-white/[0.04] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-violet-600/20 border border-violet-500/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="#8b5cf6"/>
                  </svg>
                </div>
              </div>
              <div className="flex gap-2">
                {[70, 50, 85].map((w, i) => (
                  <div key={i} className="h-2 rounded-full bg-white/[0.06]" style={{ width: `${w}%` }} />
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                {["Playlist 1", "Lo-fi", "+ New"].map((t) => (
                  <div key={t} className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] text-gray-600">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Three steps to deep work.</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">No onboarding. No tutorial. You already know what to do.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative flex flex-col p-7 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-violet-500/30 transition-all duration-300 group">
              {/* connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-3 w-6 h-[1px] bg-white/[0.08] z-10" />
              )}
              <span className="text-[11px] font-black tracking-[0.2em] mb-5 transition-colors duration-300"
                style={{ color: "rgba(139,92,246,0.5)" }}>{s.n}</span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300"
                style={{ background: "rgba(139,92,246,0.15)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </div>
              <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POMODORO SECTION ── */}
      <PomodoroSection />

      {/* ── DOLORES VS SOLUCIONES ── */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-3">Por qué Studdia funciona</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Tu problema ya tiene solución.</h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">Cada excusa para no estudiar tiene una respuesta concreta dentro de la app.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAINS.map((item) => (
            <div key={item.pain} className="flex gap-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.025] hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300 group">
              <div className="text-3xl shrink-0 mt-0.5">{item.emoji}</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.accent }} />
                  <p className="text-sm font-black text-gray-300 line-through decoration-2" style={{ textDecorationColor: item.accent }}>{item.pain}</p>
                </div>
                <div className="flex items-start gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" className="shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Everything you need. Nothing you don&apos;t.</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">Six features. Zero bloat. Built to keep you locked in.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(139,92,246,0.15)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={f.icon} />
                </svg>
              </div>
              <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-3">Students love it</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Real words from real students.</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">No paid reviews. Just people who actually study with Studdia.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name}
              className="flex flex-col justify-between p-7 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-violet-500/20 transition-all duration-300">
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#8b5cf6"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                  style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}33` }}>
                  {t.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xs font-bold">{t.name}</span>
                  <span className="text-gray-600 text-[10px]">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 px-6 pb-24 max-w-3xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Got questions?</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">Answers to the things people ask before they try it.</p>
        </div>
        <div className="flex flex-col gap-2">
          {FAQS.map((f, i) => (
            <div key={i}
              className="rounded-2xl bg-white/[0.025] border border-white/[0.06] overflow-hidden transition-all duration-200 hover:border-violet-500/20">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="text-white text-sm font-bold">{f.q}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="shrink-0 text-gray-500 transition-transform duration-300"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M6 9l6 6 6-6"/>
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

      {/* ── FINAL CTA ── */}
      <section id="pricing" className="relative z-10 px-6 pb-24 max-w-4xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-3">Precio sin-excusas</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
            Por menos que un Red Bull.<br />
            <span style={{ background: "linear-gradient(135deg,#a78bfa,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>10 horas de productividad a la semana.</span>
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">2,50€/mes. Sin permanencia. Sin letra pequeña. Y si no te gusta, cancelas en un clic.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col p-8 rounded-3xl border transition-all duration-300"
              style={{
                background: plan.name === "Pro" ? "radial-gradient(ellipse at top, rgba(139,92,246,0.1) 0%, rgba(10,10,13,0.9) 70%)" : "rgba(255,255,255,0.025)",
                borderColor: plan.accentBorder,
                boxShadow: plan.name === "Pro" ? "0 0 40px rgba(139,92,246,0.12)" : "none",
              }}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "white" }}>
                  {plan.badge}
                </div>
              )}
              {/* Header */}
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3 block" style={{ color: plan.accent }}>{plan.name}</span>
                <div className="flex items-end gap-1.5">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-500 text-sm mb-1.5">{plan.period}</span>
                </div>
              </div>
              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.accent} strokeWidth="2.5" className="shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" className="shrink-0 mt-0.5">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              {/* CTA */}
              <button
                onClick={() => router.push(plan.ctaRoute)}
                className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-[0.12em] transition-all duration-200 active:scale-95"
                style={plan.name === "Pro"
                  ? { background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 0 24px rgba(139,92,246,0.35)", color: "white" }
                  : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#d1d5db" }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pb-32">
        <div
          className="w-full max-w-3xl rounded-3xl p-12 md:p-16 border border-violet-500/20 relative overflow-hidden"
          style={{ background: "radial-gradient(ellipse at top, rgba(139,92,246,0.12) 0%, rgba(6,6,8,0.8) 70%)" }}>
          {/* glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top, rgba(139,92,246,0.18) 0%, transparent 70%)" }} />
          <p className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-5">¿Sigues aquí?</p>
          <h2 className="relative text-4xl md:text-5xl font-black tracking-tight mb-5 leading-tight">
            Deja de planear estudiar.<br />
            <span style={{ background: "linear-gradient(135deg, #a78bfa, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Empieza ahora.
            </span>
          </h2>
          <p className="relative text-gray-400 text-base mb-2 max-w-md mx-auto leading-relaxed">
            Sin registro. Abierto en menos de 10 segundos.
          </p>
          <p className="relative text-gray-600 text-sm mb-10 max-w-sm mx-auto">
            Los estudiantes que usan Studdia completan sus sesiones. Los que no, siguen mirando el móvil.
          </p>
          <div className="relative flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => router.push("/cockpit")}
              className="px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all duration-200 active:scale-95"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", boxShadow: "0 0 50px rgba(139,92,246,0.45)", border: "1px solid rgba(168,85,247,0.4)" }}>
              Obtener mi Ventaja Injusta →
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-8 py-4 rounded-2xl font-bold text-sm text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200">
              Entrar con Google
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.05] px-6 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="#6d28d9" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-gray-500">Studdia</span>
          <span>· No ads · Study In Peace.</span>
        </div>
        <div className="flex items-center gap-5 text-[11px] text-gray-600">
          <a href="https://github.com/jaden972972/Studdia" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">GitHub</a>
          <button onClick={() => router.push("/cockpit")} className="hover:text-gray-400 transition-colors">App</button>
          <button onClick={() => router.push("/login")} className="hover:text-gray-400 transition-colors">Sign in</button>
        </div>
      </footer>
    </div>
  );
}

