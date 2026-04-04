"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTimer, useTheme } from "@/app/providers";
import { addTask as addTaskAction } from "@/app/actions/tasks";
import { useSubscription } from "@/hooks/useSubscription";
import { PLAN_LIMITS } from "@/lib/subscription";
import ProModal from "@/app/components/ProModal";
import PremiumPlant from "@/app/components/PremiumPlant";

type Priority = "high" | "medium" | "low";
type Filter = "all" | "active" | "done";

interface Task {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
  createdAt: number;
}

const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  high:   { label: "Alta",   color: "#f87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.25)" },
  medium: { label: "Media",  color: "#fbbf24", bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.25)" },
  low:    { label: "Baja",   color: "#6b7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)" },
};

const PRIORITY_ORDER: Priority[] = ["high", "medium", "low"];

const GUIDE_STEPS = [
  { icon: "✍️", title: "Escribe una tarea", desc: "Elige prioridad (Alta / Media / Baja) y pulsa Añadir." },
  { icon: "✅", title: "Márcala como hecha", desc: "Toca el checkbox cuando termines. El progreso se actualiza solo." },
  { icon: "🎯", title: "Estudia con foco", desc: "Activa el timer en el cockpit y sigue tus sesiones de concentración." },
];

const ACCENT = "#8b5cf6";

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("studdia_tasks_v1");
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem("studdia_tasks_v1", JSON.stringify(tasks));
}

export default function TasksPage() {
  const { data: session } = useSession();
  const { isActive, seconds, formatTime } = useTimer();
  const { theme, toggleTheme } = useTheme();
  const { isPro, limits, loading: subLoading } = useSubscription();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [showDone, setShowDone] = useState(true);
  const [showProModal, setShowProModal] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showPriorityPopup, setShowPriorityPopup] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);
  const sessionRef = useRef(session);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { sessionRef.current = session; }, [session]);

  // Theme-derived colours
  const isDark = theme === "dark";
  const pageBg = isDark
    ? (isPro ? "radial-gradient(ellipse at 50% 0%, #0e0a1a 0%, #080808 50%, #000 100%)" : "#080808")
    : (isPro ? "radial-gradient(ellipse at 50% 0%, #ede9f8 0%, #f5f4f0 50%, #fff 100%)" : "#f5f4f0");
  const headerBg = isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.85)";
  const headerBorder = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const cardBg = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const inputBg = isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)";
  const textPrimary = isDark ? "#ffffff" : "#0f0f0f";
  const textMuted = isDark ? "#6b7280" : "#6b7280";
  const textFaint = isDark ? "#3f3f46" : "#a1a1aa";
  const statCardBg = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)";
  const statCardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const filterPillBg = isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.05)";
  const filterPillBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  // Show guide on first visit
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("studdia_guide_ok")) {
      setShowGuide(true);
    }
  }, []);

  // Load: Supabase if logged in, localStorage otherwise
  useEffect(() => {
    if (session === undefined) return;
    initialized.current = false;
    setTasksLoading(true);

    const load = async () => {
      let loaded = false;

      if (session?.user) {
        try {
          const res = await fetch("/api/tasks");
          const data = await res.json();
          if (Array.isArray(data.tasks)) {
            setTasks(data.tasks);
            loaded = true;
          }
        } catch (e) {
          console.error("Error loading tasks from Supabase:", e);
        }
      }

      if (!loaded) {
        setTasks(loadTasks());
      }

      setTasksLoading(false);
      setTimeout(() => { initialized.current = true; }, 0);
    };

    load();
  }, [session]);

  // Save toggle/delete changes: localStorage always + Supabase debounced when logged in
  useEffect(() => {
    if (!initialized.current) return;
    saveTasks(tasks);
    if (sessionRef.current?.user) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks }),
        }).catch(e => console.error("Error saving tasks:", e));
      }, 1500);
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [tasks]);

  const add = async () => {
    const text = input.trim();
    if (!text || addingTask) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text,
      done: false,
      priority,
      createdAt: Date.now(),
    };

    if (session?.user) {
      // Server Action path: limit enforced server-side
      setAddingTask(true);
      try {
        const result = await addTaskAction(newTask);
        if ("error" in result) {
          if (result.error === "LIMIT_REACHED") {
            setShowProModal(true);
            return;
          }
          // UNAUTHORIZED / DB_ERROR → fall back to local add
          setTasks((prev) => [newTask, ...prev]);
        } else {
          setTasks(result.tasks);
          saveTasks(result.tasks);
        }
      } catch {
        // Network/server error → fall back to local add
        setTasks((prev) => [newTask, ...prev]);
      } finally {
        setAddingTask(false);
      }
    } else {
      // Guest path: enforce limit locally
      const localLimit = PLAN_LIMITS.free.maxTasks!;
      if (tasks.length >= localLimit) {
        setShowProModal(true);
        return;
      }
      setTasks((prev) => [newTask, ...prev]);
    }

    setInput("");
    inputRef.current?.focus();
  };

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const clearDone = () =>
    setTasks((prev) => prev.filter((t) => !t.done));

  // Stats
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const active = total - done;
  const highPending = tasks.filter((t) => !t.done && t.priority === "high").length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  const maxTasks = limits.maxTasks;
  const atLimit = !isPro && maxTasks !== null && tasks.length >= maxTasks;

  // Filtered list
  const visible = tasks.filter((t) => {
    const matchFilter =
      filter === "all" ? true : filter === "active" ? !t.done : t.done;
    const matchSearch = t.text.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const activeTasks = visible.filter((t) => !t.done);
  const doneTasks   = visible.filter((t) => t.done);

  // Priority popup: all tasks sorted by priority (high→medium→low), then done
  const popupTasks = [
    ...PRIORITY_ORDER.flatMap((p) => tasks.filter((t) => !t.done && t.priority === p)),
    ...tasks.filter((t) => t.done),
  ];

  return (
    <main className="min-h-screen font-sans flex flex-col transition-colors duration-300"
      style={{ background: pageBg, color: textPrimary }}>
      <ProModal open={showProModal} onClose={() => setShowProModal(false)} />

      {/* ── PRIORITY POPUP OVERLAY ── */}
      {showPriorityPopup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowPriorityPopup(false)}>
          <div className="w-full max-w-sm rounded-3xl border p-5 flex flex-col gap-3 max-h-[70vh]"
            style={{ background: isDark ? "#111113" : "#fff", borderColor: cardBorder, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: textMuted }}>Tareas por hacer</span>
              <button onClick={() => setShowPriorityPopup(false)} style={{ color: textFaint }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="overflow-y-auto flex flex-col gap-1.5 [scrollbar-width:none]">
              {popupTasks.length === 0 && (
                <p className="text-center py-6 text-sm" style={{ color: textFaint }}>Sin tareas aún.</p>
              )}
              {popupTasks.map((t) => {
                const pm = PRIORITY_META[t.priority];
                return (
                  <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: t.done ? "transparent" : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"), opacity: t.done ? 0.5 : 1 }}>
                    <button onClick={() => toggle(t.id)}
                      className="w-4 h-4 rounded shrink-0 flex items-center justify-center border-2 transition-all"
                      style={t.done ? { background: "#10b981", borderColor: "#10b981" } : { background: "transparent", borderColor: pm.color }}>
                      {t.done && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><path d="M20 6L9 17l-5-5"/></svg>}
                    </button>
                    <span className="flex-1 text-sm truncate" style={{ color: t.done ? textFaint : textPrimary, textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                    {!t.done && <span className="text-[9px] font-black uppercase shrink-0" style={{ color: pm.color }}>{pm.label}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="shrink-0 flex items-center justify-between px-6 md:px-10 py-4 border-b backdrop-blur-sm"
        style={{ background: headerBg, borderColor: headerBorder }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <span className="font-black text-sm tracking-tight">Studdia</span>
            <span className="text-xs ml-2" style={{ color: textMuted }}>/ Tareas</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Priority popup button */}
          <button
            onClick={() => setShowPriorityPopup(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all border"
            style={{ background: isDark ? "rgba(248,113,113,0.08)" : "rgba(248,113,113,0.07)", borderColor: "rgba(248,113,113,0.25)", color: "#f87171" }}
            title="Ver tareas por prioridad"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            {tasks.filter(t => !t.done).length > 0 && <span>{tasks.filter(t => !t.done).length}</span>}
          </button>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl border transition-all"
            style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)", color: textMuted }}
            title={isDark ? "Modo claro" : "Modo oscuro"}
          >
            {isDark
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            }
          </button>
          <Link
            href="/cockpit"
            className="flex items-center gap-1.5 text-[11px] transition-colors"
            style={{ color: textMuted }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Cockpit
          </Link>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: session?.user ? "#10b981" : "#4b5563" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {session?.user
              ? <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>
              : <path d="M4 4h16v16H4zM8 4V2M16 4V2"/>}
          </svg>
          {session?.user ? "Sincronizado" : "Local"}
        </div>
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 flex flex-col gap-6">

        {/* ── PAGE TITLE ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Panel de Tareas</h1>
            <p className="text-sm mt-0.5" style={{ color: textMuted }}>Disciplina total. Una tarea a la vez.</p>
          </div>
          <div className="flex items-center gap-2">
            {isPro && !subLoading && (
              <>
                <PremiumPlant />
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border pro-badge-anim"
                  style={{ background: "rgba(139,92,246,0.1)", borderColor: "rgba(139,92,246,0.4)" }}
                >
                  Pro
                </span>
              </>
            )}
            {!isPro && !subLoading && (
              <button
                onClick={() => setShowProModal(true)}
                className="text-[10px] font-bold hover:text-violet-400 transition-colors px-2.5 py-1 rounded-lg border hover:border-violet-500/30"
                style={{ color: textMuted, borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}
              >
                Mejorar →
              </button>
            )}
          </div>
        </div>

        {/* ── 3-STEP GUIDE ── */}
        {showGuide && (
          <div className="rounded-2xl border p-4 flex flex-col gap-3"
            style={{ background: isDark ? "rgba(139,92,246,0.06)" : "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#8b5cf6" }}>Guía rápida · 3 pasos</span>
              <button onClick={() => { setShowGuide(false); localStorage.setItem("studdia_guide_ok", "1"); }}
                className="text-[10px] font-bold hover:text-violet-400 transition-colors" style={{ color: textFaint }}>
                Cerrar ×
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {GUIDE_STEPS.map((step, i) => (
                <div key={i} className="flex flex-col gap-1.5 p-3 rounded-xl"
                  style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
                  <span className="text-xl">{step.icon}</span>
                  <span className="text-[11px] font-black" style={{ color: textPrimary }}>{step.title}</span>
                  <span className="text-[10px] leading-relaxed" style={{ color: textMuted }}>{step.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STATS ROW ── */}
        {tasksLoading ? (
          <div className="grid grid-cols-4 gap-3">
            {[0,1,2,3].map((i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
          </div>
        ) : (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total",    value: total,       color: ACCENT },
            { label: "Activas",  value: active,      color: "#e879f9" },
            { label: "Hechas",   value: done,        color: "#10b981" },
            { label: "Urgentes", value: highPending, color: "#f87171" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center py-3.5 px-2 rounded-2xl border"
              style={{ background: statCardBg, borderColor: statCardBorder }}
            >
              <span className="text-xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</span>
              <span className="text-[10px] mt-0.5 tracking-wide" style={{ color: textMuted }}>{s.label}</span>
            </div>
          ))}
        </div>
        )}

        {/* ── PROGRESS BAR ── */}
        {!tasksLoading && total > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: textMuted }}>Progreso</span>
              <span className="text-[10px] font-black tabular-nums" style={{ color: progress === 100 ? "#10b981" : ACCENT }}>
                {progress}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: progress === 100
                    ? "#10b981"
                    : `linear-gradient(90deg, #8b5cf6, #a78bfa)`,
                }}
              />
            </div>
          </div>
        )}

        {/* ── ADD TASK FORM ── */}
        <div className="flex flex-col gap-2 p-4 rounded-2xl border" style={{ background: cardBg, borderColor: cardBorder }}>
          {/* Limit bar for free users */}
          {!isPro && maxTasks !== null && (
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px]" style={{ color: textMuted }}>
                {tasks.length} / {maxTasks} tareas
                {atLimit && (
                  <span className="ml-2 text-red-400 font-bold">· Límite alcanzado</span>
                )}
              </span>
              {atLimit && (
                <button
                  onClick={() => setShowProModal(true)}
                  className="text-[10px] font-black text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Ser Pro →
                </button>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={atLimit ? "Mejora a Pro para tareas ilimitadas..." : "Nueva tarea..."}
              disabled={atLimit}
              className="flex-1 rounded-xl px-3 py-2.5 text-sm placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-violet-500/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border"
              style={{ background: inputBg, borderColor: cardBorder, color: textPrimary }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <button
              onClick={atLimit ? () => setShowProModal(true) : add}
              disabled={(!atLimit && !input.trim()) || addingTask}
              className="px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 disabled:opacity-30 shrink-0"
              style={{ background: atLimit ? "rgba(139,92,246,0.3)" : ACCENT, color: "white" }}
            >
              {addingTask ? "···" : atLimit ? "🔒" : "Añadir"}
            </button>
          </div>
          {/* Priority selector */}
          <div className="flex gap-1.5">
            {(["high", "medium", "low"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                disabled={atLimit}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border disabled:opacity-30"
                style={
                  priority === p
                    ? { background: PRIORITY_META[p].bg, color: PRIORITY_META[p].color, borderColor: PRIORITY_META[p].border }
                    : { color: textFaint, borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)", background: "transparent" }
                }
              >
                {PRIORITY_META[p].label}
              </button>
            ))}
          </div>
        </div>

        {/* ── FILTERS + SEARCH ── */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
          {/* Status tabs */}
          <div className="flex gap-1 p-1 rounded-xl border" style={{ background: filterPillBg, borderColor: filterPillBorder }}>
            {(["all", "active", "done"] as Filter[]).map((f) => {
              const labels: Record<Filter, string> = { all: "Todas", active: "Activas", done: "Hechas" };
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                  style={filter === f ? { background: ACCENT, color: "white" } : { color: textFaint }}
                >
                  {labels[f]}
                </button>
              );
            })}
          </div>
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: textFaint }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              className="rounded-xl pl-8 pr-3 py-1.5 text-xs border outline-none focus:ring-1 focus:ring-violet-500/30 transition-colors w-44"
              style={{ background: inputBg, borderColor: cardBorder, color: textPrimary }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── TASK LIST ── */}
        <div className="flex flex-col gap-1.5">
          {/* Skeleton while loading */}
          {tasksLoading && (
            <>
              {[0,1,2,3].map((i) => <div key={i} className="skeleton h-12 rounded-2xl" />)}
            </>
          )}

          {!tasksLoading && (
            <>
              {/* Active tasks */}
              {activeTasks.length === 0 && filter !== "done" && (
                <div className="text-center py-10">
                  <p className="text-sm" style={{ color: textFaint }}>
                    {search ? "Sin tareas que coincidan." : "Sin tareas activas. Añade una arriba."}
                  </p>
                </div>
              )}
              {activeTasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggle} onRemove={remove} isPro={isPro} isDark={isDark} textPrimary={textPrimary} textFaint={textFaint} />
              ))}

              {/* Done section */}
              {doneTasks.length > 0 && filter !== "active" && (
                <>
                  <div className="flex items-center justify-between mt-4 mb-1">
                    <button
                      onClick={() => setShowDone((v) => !v)}
                      className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors"
                      style={{ color: textMuted }}
                    >
                      <svg
                        width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        style={{ transform: showDone ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      Completadas ({doneTasks.length})
                    </button>
                    <button
                      onClick={clearDone}
                      className="text-[10px] hover:text-red-400 transition-colors"
                      style={{ color: textFaint }}
                    >
                      Borrar todo
                    </button>
                  </div>
                  {showDone && doneTasks.map((task) => (
                    <TaskRow key={task.id} task={task} onToggle={toggle} onRemove={remove} isPro={isPro} isDark={isDark} textPrimary={textPrimary} textFaint={textFaint} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── FLOATING TIMER PILL ── */}
      {isActive && (
        <Link
          href="/cockpit"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-full font-black text-sm text-white"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 0 30px rgba(139,92,246,0.5)" }}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          {formatTime(seconds)} · Volver al cockpit
        </Link>
      )}
    </main>
  );
}

function TaskRow({
  task,
  onToggle,
  onRemove,
  isPro,
  isDark = true,
  textPrimary = "#fff",
  textFaint = "#3f3f46",
}: {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  isPro?: boolean;
  isDark?: boolean;
  textPrimary?: string;
  textFaint?: string;
}) {
  const p = PRIORITY_META[task.priority];
  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200${isPro && !task.done ? " hover:shadow-[0_0_12px_rgba(139,92,246,0.35)]" : ""}`}
      style={{
        background: task.done
          ? (isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)")
          : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"),
        borderColor: task.done
          ? (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)")
          : isPro ? "rgba(139,92,246,0.18)" : (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"),
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center border-2 transition-all duration-200"
        style={
          task.done
            ? { background: "#10b981", borderColor: "#10b981" }
            : { background: "transparent", borderColor: isDark ? "#3f3f46" : "#d4d4d8" }
        }
      >
        {task.done && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </button>

      {/* Text */}
      <span
        className="flex-1 text-sm leading-relaxed transition-colors duration-200"
        style={{
          color: task.done ? textFaint : textPrimary,
          textDecoration: task.done ? "line-through" : "none",
        }}
      >
        {task.text}
      </span>

      {/* Priority badge */}
      {!task.done && (
        <span
          className="shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border"
          style={{ color: p.color, background: p.bg, borderColor: p.border }}
        >
          {p.label}
        </span>
      )}

      {/* Delete */}
      <button
        onClick={() => onRemove(task.id)}
        className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all shrink-0 p-1"
        style={{ color: textFaint }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
