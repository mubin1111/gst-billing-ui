import React, { useState, useEffect } from "react";
import { FiCheck, FiSave, FiLayers } from "react-icons/fi";

const STORAGE_KEY = "app-settings";

const PRESETS = [
  {
    key: "midnight-cobalt",
    name: "Midnight Cobalt",
    themeColor: "#2563EB",
    navbarColor: "#020617",
    drawerColor: "#FFFFFF",
    navbarUseGradient: true,
    navbarGradientStart: "#020617",
    navbarGradientEnd: "#1E3A8A",
    note: "High-Authority Corporate"
  },
  {
    key: "emerald-executive",
    name: "Emerald Executive",
    themeColor: "#1d805f",
    navbarColor: "#064E3B",
    drawerColor: "#F9FAFB",
    navbarUseGradient: true,
    navbarGradientStart: "#0c2c23",
    navbarGradientEnd: "#065F46",
    note: "Financial Growth & Stability"
  },
  {
    key: "royal-amethyst",
    name: "Royal Amethyst",
    themeColor: "#4700ee",
    navbarColor: "#2E1065",
    drawerColor: "#FFFFFF",
    navbarUseGradient: true,
    navbarGradientStart: "#0e0223",
    navbarGradientEnd: "#4C1D95",
    note: "Modern Luxury & Creative"
  },
  {
    key: "obsidian-rose",
    name: "Obsidian Rose",
    themeColor: "#E11D48",
    navbarColor: "#0F172A",
    drawerColor: "#FFF1F2",
    navbarUseGradient: true,
    navbarGradientStart: "#0F172A",
    navbarGradientEnd: "#44403C",
    note: "Bold, Dynamic & Urgent"
  },
  {
    key: "sky-frost",
    name: "Sky Frost",
    themeColor: "#0EA5E9",
    navbarColor: "#0369A1",
    drawerColor: "#F0F9FF",
    navbarUseGradient: true,
    navbarGradientStart: "#041c2a",
    navbarGradientEnd: "#0EA5E9",
    note: "Clean, Airy & Modern"
  },
  {
    key: "sunset-peach",
    name: "Sunset Peach",
    themeColor: "#71a600",
    navbarColor: "#4C1D95",
    drawerColor: "#ffffff",
    navbarUseGradient: true,
    navbarGradientStart: "#0c011c",
    navbarGradientEnd: "#69c400",
    note: "Friendly & Creative"
  }
];

export default function ThemeControls({ className }) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [savedKey, setSavedKey] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      setSavedKey(s?.themeName || "midnight-cobalt");
      const initial = PRESETS.find(p => p.key === s.themeName) || PRESETS[0];
      setSelectedPreset(initial);
    } else {
      setSavedKey("midnight-cobalt");
      setSelectedPreset(PRESETS[0]);
    }
  }, []);

  const broadcastTheme = (p) => {
    const payload = { ...p, themeName: p.key };
    window.dispatchEvent(new CustomEvent("app-theme-updated", { detail: payload }));
  };

  const handlePreview = (p) => {
    setSelectedPreset(p);
    broadcastTheme(p);
  };

  const handleSave = () => {
    if (!selectedPreset) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...selectedPreset, themeName: selectedPreset.key }));
    setSavedKey(selectedPreset.key);
  };

  const handleReset = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    let themeToRestore = PRESETS[0];
    if (raw) {
      const s = JSON.parse(raw);
      themeToRestore = PRESETS.find(p => p.key === s.themeName) || PRESETS[0];
    }
    setSelectedPreset(themeToRestore);
    broadcastTheme(themeToRestore);
  };

  return (
    <div className={`${className} max-w-5xl mx-auto p-4`}>
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden">

        {/* Header Block */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2 justify-center md:justify-start">
              <FiLayers className="text-blue-600" /> Interface Style
            </h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Select a high-performance theme for your dashboard.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={handleReset} className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={selectedPreset?.key === savedKey}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-black text-sm transition-all ${selectedPreset?.key === savedKey
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95"
                }`}
            >
              <FiSave /> Save Changes
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRESETS.map((p) => {
              const isSelected = selectedPreset?.key === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => handlePreview(p)}
                  className={`group relative flex flex-col p-2 rounded-[1.8rem] transition-all duration-300 ${isSelected ? "ring-4 ring-blue-500/20 translate-y-[-4px]" : "hover:bg-slate-50"
                    }`}
                >
                  {/* Visual Preview */}
                  <div className={`w-full h-40 rounded-[1.5rem] overflow-hidden border-2 transition-all ${isSelected ? "border-blue-500 shadow-xl" : "border-slate-100"
                    }`}>
                    <div className="h-full flex flex-col">
                      <div className="h-1/3 flex items-center px-4" style={{ background: p.navbarUseGradient ? `linear-gradient(90deg, ${p.navbarGradientStart}, ${p.navbarGradientEnd})` : p.navbarColor }}>
                        <div className="w-10 h-2 bg-white/20 rounded-full" />
                      </div>
                      <div className="flex flex-1">
                        <div className="w-1/4 h-full border-r border-slate-100 p-2" style={{ background: p.drawerColor }}>
                          <div className="w-full h-1 bg-slate-200 rounded-full mb-1" />
                          <div className="w-2/3 h-1 bg-slate-200 rounded-full" />
                        </div>
                        <div className="flex-1 bg-white p-4 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="w-full h-1.5 bg-slate-100 rounded-full" />
                            <div className="w-1/2 h-1.5 bg-slate-100 rounded-full" />
                          </div>
                          <div className="w-12 h-6 rounded-md shadow-sm self-end" style={{ background: p.themeColor }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Label */}
                  <div className="mt-4 px-2 flex justify-between items-center">
                    <div>
                      <span className="block font-black text-slate-800 tracking-tight">{p.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.note}</span>
                    </div>
                    {isSelected && <div className="bg-blue-500 text-white p-1 rounded-full"><FiCheck size={14} /></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}