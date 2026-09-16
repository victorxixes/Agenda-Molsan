import { useState, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

/**
 * LoginPage — SJ‑2026 Premium
 * - Glass‑UI
 * - Animaciones fade + slide
 * - Inputs premium
 * - Funciones estabilizadas
 */

export default function LoginPage() {
  const navigate = useNavigate();
  const iniciarSesion = useAuthStore((s) => s.iniciarSesion);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);

      const ok = await iniciarSesion(usuario, password);
      if (ok) navigate("/dashboard");
      else setError("Credenciales incorrectas");
    },
    [usuario, password, iniciarSesion, navigate]
  );

  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-4
        bg-gradient-to-br from-[#1F3A5F] via-[#2F4A6F] to-[#6A7A8C]
        animate-fadeIn
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-sm
          border border-white/20 animate-slideUp
        "
      >
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src="/img/logo.jpg"
            alt="Logo empresa"
            className="h-20 w-auto rounded-xl shadow-xl"
          />
        </div>

        {/* TÍTULO */}
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow">
          Agenda Molsan
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-300 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* USUARIO */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white/80">Usuario</label>
          <input
            type="text"
            className="
              w-full px-3 py-2 rounded-xl bg-white/20 text-white
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoFocus
          />
        </div>

        {/* CONTRASEÑA */}
        <div className="mb-6">
          <label className="block text-sm mb-1 text-white/80">Contraseña</label>

          <div className="relative">
            <input
              type={mostrarPass ? "text" : "password"}
              className="
                w-full px-3 py-2 rounded-xl bg-white/20 text-white pr-10
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="
                absolute right-3 top-2.5 cursor-pointer text-white/70
                hover:text-white transition
              "
              onClick={() => setMostrarPass((v) => !v)}
            >
              {mostrarPass ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          className="
            w-full py-2 rounded-xl text-white font-semibold
            bg-blue-600 hover:bg-blue-700
            shadow-[0_0_15px_rgba(255,255,255,0.3)]
            hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]
            transition-all active:scale-[0.98]
          "
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
