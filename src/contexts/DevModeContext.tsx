import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface DevModeContextType {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}

const DevModeContext = createContext<DevModeContextType>({ enabled: false, setEnabled: () => {} });

const KEY = "dev-mode";

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(() => {
    try { return localStorage.getItem(KEY) === "true"; } catch { return false; }
  });

  const setEnabled = (v: boolean) => {
    setEnabledState(v);
    localStorage.setItem(KEY, String(v));
  };

  // Listen for changes from other tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === KEY) setEnabledState(e.newValue === "true");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <DevModeContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode(): [boolean, (v: boolean) => void] {
  const ctx = useContext(DevModeContext);
  return [ctx.enabled, ctx.setEnabled];
}
