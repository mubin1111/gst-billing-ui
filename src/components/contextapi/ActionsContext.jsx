// src/components/contextapi/ActionsContext.jsx
import React, { createContext, useContext, useCallback } from "react";
import { useToast } from "./ToastContext"; // yahi wala jo tumne banaya hai

const ActionsContext = createContext(null);

export const ActionProvider = ({ children }) => {
  const { pushToast } = useToast();

  // Generic view handler
  const onView = useCallback((entityName, data) => {
    console.log("VIEW ->", entityName, data);
    pushToast("info", `${entityName} view triggered (console me check karo).`);
  }, [pushToast]);

  // Generic edit handler
  const onEdit = useCallback((entityName, id, navigateFn) => {
    console.log("EDIT ->", entityName, id);
    if (typeof navigateFn === "function") {
      navigateFn();
    }
    pushToast("info", `${entityName} edit open hua (id: ${id}).`);
  }, [pushToast]);

  // Generic delete handler
  const onDelete = useCallback((entityName, id) => {
    console.log("DELETE ->", entityName, id);
    // Yahan baad me modal laga sakte ho
    pushToast(
      "error",
      `${entityName} (id: ${id}) delete simulate ho raha hai. Real app me yahan API + modal aayega.`
    );
  }, [pushToast]);

  const value = {
    onView,
    onEdit,
    onDelete,
  };

  return (
    <ActionsContext.Provider value={value}>
      {children}
    </ActionsContext.Provider>
  );
};

export const useActions = () => {
  const ctx = useContext(ActionsContext);
  if (!ctx) {
    throw new Error("useActions must be used inside <ActionProvider />");
  }
  return ctx;
};
