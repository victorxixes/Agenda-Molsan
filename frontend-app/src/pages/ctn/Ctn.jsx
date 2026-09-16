import { useCallback } from "react";
import CtnListadoPage from "./CtnListadoPage";

/**
 * CTN — SJ‑2026 Premium
 * - Wrapper limpio
 * - Glass‑UI
 */

export default function Ctn() {
  const title = useCallback(() => "CTN — Notarías", []);

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4 text-white drop-shadow">
        {title()}
      </h1>
      <CtnListadoPage />
    </div>
  );
}
