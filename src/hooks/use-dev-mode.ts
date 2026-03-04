import { useState, useEffect } from "react";

const KEY = "dev-mode";

export function useDevMode() {
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem(KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, String(enabled));
  }, [enabled]);

  return [enabled, setEnabled] as const;
}
