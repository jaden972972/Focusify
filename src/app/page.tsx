"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [videoId, setVideoId] = useState("jfKfPfyJRdk"); 
  const [input, setInput] = useState(""); 
  const [nombreInput, setNombreInput] = useState(""); 
  const [favoritos, setFavoritos] = useState<{id: string, nombre: string}[]>([]);

  // --- MEMORIA INFINITA ---
  useEffect(() => {
    const guardados = localStorage.getItem("focusify_favs");
    if (guardados) {
      try {
        setFavoritos(JSON.parse(guardados));
      } catch (e) {
        console.error("Error al cargar favoritos");
      }
    }
  }, []);

  useEffect(() => {
    if (favoritos.length > 0) {
      localStorage.setItem("focusify_favs", JSON.stringify(favoritos));
    }
  }, [favoritos]);

  const cargarVideo = (url: string) => {
    const id = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url;
    if (id) {
      setVideoId(id);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#030303] text-white p-4 md:p-10 font-sans relative overflow-x-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5"></div>
      <div className="absolute -top-40 -left-40 w-60 md:w-80 h-60 md:h-80 bg-red-900/30 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-7xl flex flex-col items-center z-10">
        
        {/* 1. CABECERA - Ajustada para móviles */}
        <div className="text-center mb-10 md:mb-16 mt-6 md:mt-0 relative">
          <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tighter mb-2 italic">
            FOCUSIFY<span className="text-red-600">.</span>
          </h1>
          <p className="text-gray-500 font-medium tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs backdrop-blur-sm bg-black/20 px-4 py-1 rounded-full border border-white/5 inline-block">
            No Ads • <span className="text-gray-400">Study In Peace</span>
          </p>
        </div>

        {/* 2. PANEL DE CONTROL - Responsive Grid/Flex */}
        <div className="mb-10 w-full max-w-3xl flex flex-col gap-4 p-4 md:p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-lg shadow-2xl">
          
          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Pega el link aquí..." 
              value={input}
              className="bg-white/[0.03] border border-white/5 px-5 py-4 rounded-xl w-full md:flex-[2] focus:border-red-600/50 outline-none text-white placeholder:text-gray-700 font-mono text-sm"
              onChange={(e) => setInput(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Nombre..." 
              value={nombreInput}
              className="bg-white/[0.03] border border-white/5 px-5 py-4 rounded-xl w-full md:flex-1 focus:border-green-600/50 outline-none text-white placeholder:text-gray-700 text-sm"
              onChange={(e) => setNombreInput(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button 
              onClick={() => cargarVideo(input)}
              className="bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-bold transition-all active:scale-95 text-xs uppercase tracking-widest"
            >
              REPRODUCIR
            </button>

            <button 
              onClick={() => {
                const id = input.includes("v=") ? input.split("v=")[1].split("&")[0] : (input || videoId);
                if (id && nombreInput) {
                  setFavoritos([...favoritos, { id, nombre: nombreInput }]);
                  setNombreInput(""); 
                  setInput("");
                } else {
                  alert("Ponle un nombre.");
                }
              }}
              className="bg-gray-800 hover:bg-gray-700 border border-white/5 py-4 rounded-2xl font-bold transition-all active:scale-95 text-xs uppercase tracking-widest text-green-400"
            >
              ⭐ GUARDAR
            </button>

            <button 
              onClick={() => {
                if (favoritos.length > 0) {
                  const random = favoritos[Math.floor(Math.random() * favoritos.length)];
                  setVideoId(random.id);
                  setInput(""); setNombreInput("");
                }
              }}
              className="bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl font-bold transition-all active:scale-95 text-xs uppercase tracking-widest text-gray-400"
            >
              🔀 Shuffle
            </button>
          </div>
        </div>
        
        {/* 3. REPRODUCTOR - Aspect Ratio automático */}
        <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border-2 md:border-4 border-[#090909] shadow-2xl bg-black relative">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
            title="Focus Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* 4. COLECCIÓN - Grid adaptable */}
        <div className="mt-12 w-full max-w-5xl px-2">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-[0.4em] text-center mb-8">
            Tu Biblioteca
          </h2>
          
          {favoritos.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl text-gray-800">
              <p className="text-sm font-bold italic">Sin música guardada</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {favoritos.map((fav, index) => (
                <button 
                  key={index}
                  onClick={() => { setVideoId(fav.id); setInput(""); setNombreInput(""); }}
                  className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:border-red-600/30 transition-all text-left group"
                >
                  <p className="font-bold text-sm text-gray-400 group-hover:text-white truncate uppercase">
                    {fav.nombre}
                  </p>
                  <p className="text-[10px] text-gray-800 mt-1">{fav.id}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. PRESETS - Flex wrap para que no se corten */}
        <div className="mt-16 mb-10 flex flex-wrap justify-center gap-6 md:gap-8 py-6 border-t border-white/5 w-full max-w-3xl opacity-40">
          <button onClick={() => setVideoId("jfKfPfyJRdk")} className="hover:text-red-500 text-[10px] font-bold uppercase tracking-widest">Lofi Girl</button>
          <button onClick={() => setVideoId("5qap5aO4i9A")} className="hover:text-blue-400 text-[10px] font-bold uppercase tracking-widest">Rainfall</button>
          <button onClick={() => setVideoId("DWcJFNfaw9c")} className="hover:text-orange-400 text-[10px] font-bold uppercase tracking-widest">Fireplace</button>
        </div>

      </div>
    </main>
  );
}