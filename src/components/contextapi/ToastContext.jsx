// src/context/ToastContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { X } from "lucide-react";

// ---------------- Toast UI Component ----------------
function Toasts({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`max-w-sm w-full px-4 py-3 rounded-xl shadow-xl border flex items-start gap-3 transition-opacity duration-300 pointer-events-auto ${
            t.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : t.type === "error"
              ? "bg-rose-50 border-rose-300 text-rose-800"
              : t.type === "warning"
              ? "bg-amber-50 border-amber-300 text-amber-800"
              : "bg-sky-50 border-sky-300 text-sky-800"
          }`}
        >
          <div className="flex-1 text-sm font-medium">{t.message}</div>
          <button
            onClick={() => remove(t.id)}
            className="text-sm opacity-80 hover:opacity-100 transition-opacity p-1 -m-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------------- Context Setup ----------------
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider />");
  }
  return ctx;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((type, message, ttl = 3500) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 7);
    const toast = { id, type, message };

    setToasts((prev) => [...prev, toast]);

    if (ttl > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, ttl);
    }

    return id;
  }, []);

  // Helper short functions: toast.success(), toast.error(), ...
  const api = useMemo(
    () => ({
      pushToast,
      removeToast,
      success: (msg, ttl) => pushToast("success", msg, ttl),
      error: (msg, ttl) => pushToast("error", msg, ttl),
      info: (msg, ttl) => pushToast("info", msg, ttl),
      warning: (msg, ttl) => pushToast("warning", msg, ttl),
      clearAll: () => setToasts([]),
    }),
    [pushToast, removeToast]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Global toast renderer */}
      <Toasts toasts={toasts} remove={removeToast} />
    </ToastContext.Provider>
  );
}
