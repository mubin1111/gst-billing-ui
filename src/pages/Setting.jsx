// src/components/ThemeControls.jsx
import React, { useState, useEffect } from "react";

/**
 * ThemeControls - preset-only (6 options)
 * - Clicking a preset applies it immediately (localStorage + event)
 * - Writes into localStorage "app-settings" keys:
 *   themeName, themeColor, navbarColor, drawerColor,
 *   navbarUseGradient, navbarGradientStart, navbarGradientEnd, darkTheme
 *
 * NOTE: 'screenshot-default' was added to match the screenshot you shared.
 */

const PRESETS = [
  // <-- screenshot-based default (sampled from your screenshot)
  {
    key: "screenshot-default",
    name: "Screenshot (Default)",
    themeColor: "#0A6E8A",            // accent (kept GST-blue for accents)
    navbarColor: "#252F1C",           // sampled start (dark greenish)
    drawerColor: "#EEF1F5",           // sampled light drawer background
    navbarUseGradient: true,
    navbarGradientStart: "#252F1C",   // left/top gradient color (sample)
    navbarGradientEnd: "#192411",     // right/bottom gradient color (sample)
    darkTheme: false,
    note: "Default look from your screenshot (light drawer, dark gradient header)",
  },

  // original GST blue
  {
    key: "gst-blue",
    name: "GST Blue",
    themeColor: "#0A6E8A",
    navbarColor: "#0B3D91",
    drawerColor: "#072A2E",
    navbarUseGradient: true,
    navbarGradientStart: "#0B3D91",
    navbarGradientEnd: "#0A6E8A",
    darkTheme: false,
    note: "Classic GST blue (gradient navbar)",
  },

  {
    key: "mint-green",
    name: "Mint Green",
    themeColor: "#0FBF9A",
    navbarColor: "#047857",
    drawerColor: "#04493B",
    navbarUseGradient: false,
    darkTheme: false,
    note: "Fresh mint accent",
  },

  {
    key: "indigo-pro",
    name: "Indigo Pro",
    themeColor: "#5B21B6",
    navbarColor: "#3B0D9E",
    drawerColor: "#1F0B3A",
    navbarUseGradient: true,
    navbarGradientStart: "#3B0D9E",
    navbarGradientEnd: "#5B21B6",
    darkTheme: false,
    note: "Professional indigo",
  },

  {
    key: "sunset",
    name: "Sunset",
    themeColor: "#FF8A00",
    navbarColor: "#C05621",
    drawerColor: "#3C1F00",
    navbarUseGradient: true,
    navbarGradientStart: "#C05621",
    navbarGradientEnd: "#FF8A00",
    darkTheme: false,
    note: "Warm sunset accent",
  },

  {
    key: "midnight",
    name: "Midnight",
    themeColor: "#06B6D4",
    navbarColor: "#071022",
    drawerColor: "#061219",
    navbarUseGradient: false,
    darkTheme: true,
    note: "Dark focused UI",
  },
  {
  key: "screenshot-navbar",
  name: "Screenshot Navbar",
  themeColor: "#0A6E8A",        // accent color (same as GST default)
  navbarUseGradient: true,
  navbarGradientStart: "#004B6B",
  navbarGradientMid1: "#24448B",
  navbarGradientMid2: "#2E2C7E",
  navbarGradientEnd: "#0D1A33",
  navbarColor: "#004B6B",       // fallback
  drawerColor: "#FFFFFF",       // pure white drawer
  darkTheme: false,
  note: "Exact teal → blue → indigo → navy gradient (your screenshot)"
}

];

const STORAGE_KEY = "app-settings";

export default function ThemeControls({ className }) {
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setActiveKey(s?.themeName ?? PRESETS[0].key);
      } else {
        setActiveKey(PRESETS[0].key);
      }
    } catch (e) {
      setActiveKey(PRESETS[0].key);
    }
  }, []);

  const applyPreset = (p) => {
    if (!p) return;
    const payload = {
      themeName: p.key,
      themeColor: p.themeColor,
      navbarColor: p.navbarColor,
      drawerColor: p.drawerColor,
      navbarUseGradient: !!p.navbarUseGradient,
      navbarGradientStart: p.navbarGradientStart || null,
      navbarGradientEnd: p.navbarGradientEnd || null,
      darkTheme: !!p.darkTheme,
    };

    try {
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      const merged = { ...existing, ...payload };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn("Failed to write theme to localStorage", e);
    }

    // notify app (custom + storage event)
    try { window.dispatchEvent(new CustomEvent("app-theme-updated", { detail: payload })); } catch(e) {}
    try {
      // may throw in some envs; ignore failure
      window.dispatchEvent(new StorageEvent("storage", {
        key: STORAGE_KEY,
        newValue: JSON.stringify(payload),
      }));
    } catch (e) {}

    setActiveKey(p.key);
  };

  return (
    <div className={className}>
      <div className="bg-white/95 p-4 rounded-2xl border border-slate-100 shadow-sm w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Theme Presets</div>
            <div className="text-sm text-slate-500">Click a preset to apply instantly (navbar + drawer + accent + dark).</div>
          </div>
          <div className="text-xs text-slate-400">Live • 6 options</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPreset(p)}
              type="button"
              className={`relative group text-left rounded-lg p-3 border transition flex flex-col gap-2 items-start ${activeKey === p.key ? "ring-2 ring-offset-1" : "hover:shadow-md"}`}
              style={{ borderColor: activeKey === p.key ? p.themeColor : "transparent", background: p.darkTheme ? "#061220" : "#fff" }}
              title={p.note}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow" style={{ background: p.navbarUseGradient ? `linear-gradient(90deg, ${p.navbarGradientStart}, ${p.navbarGradientEnd})` : p.navbarColor }}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: p.darkTheme ? "#E6EEF8" : "#0f172a" }}>{p.name}</div>
                    <div className="text-xs text-slate-400">{p.note}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">{p.darkTheme ? "Dark" : "Light"}</div>
              </div>

              <div className="w-full mt-2 rounded-md overflow-hidden border" style={{ borderColor: "rgba(15,23,42,0.04)" }}>
                <div className="p-2 text-xs font-semibold" style={{ background: p.navbarUseGradient ? `linear-gradient(90deg, ${p.navbarGradientStart}, ${p.navbarGradientEnd})` : p.navbarColor, color: "#fff" }}>
                  Navbar
                </div>
                <div className="flex">
                  <div className="w-24 p-2 text-xs" style={{ background: p.drawerColor, color: "#111" }}>
                    Drawer
                  </div>
                  <div className="flex-1 p-3 bg-white text-xs">
                    <div className="mb-1">Invoice Preview</div>
                    <div className="rounded px-2 py-1 inline-block text-white font-semibold" style={{ background: p.themeColor }}>{p.themeColor}</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Tip: Presets override previous manual colors. If you later want manual control, tell me and I’ll add an Advanced section.
        </div>
      </div>
    </div>
  );
}
