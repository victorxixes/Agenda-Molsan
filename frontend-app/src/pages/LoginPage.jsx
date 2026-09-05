import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  // ÚNICA función correcta del store
  const iniciarSesion = useAuthStore((s) => s.iniciarSesion);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const ok = await iniciarSesion(usuario, password);

    if (ok) {
      navigate("/panel/empleados");
    } else {
      setError("Credenciales incorrectas");
    }
  };

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
          border border-[#1F3A5F]/40 animate-slideUp
        "
      >
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img
            src="/img/logo.jpg"
            alt="Logo empresa"
            className="h-20 w-auto rounded-xl shadow-md"
          />
        </div>

        {/* TÍTULO */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-white">
          Bienvenido a la Agenda Molsan
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-300 text-sm mb-3 text-center">{error}</p>
        )}

        {/* USUARIO */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-white/80">Usuario</label>
          <input
            type="text"
            className="
              w-full px-3 py-2 rounded bg-white/20 text-white
              focus:outline-none focus:ring-2 focus:ring-[#6A7A8C]
            "
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoFocus
          />
        </div>

        {/* CONTRASEÑA + OJO */}
        <div className="mb-6">
          <label className="block text-sm mb-1 text-white/80">Contraseña</label>

          <div className="relative">
            <input
              type={mostrarPass ? "text" : "password"}
              className="
                w-full px-3 py-2 rounded bg-white/20 text-white pr-10
                focus:outline-none focus:ring-2 focus:ring-[#6A7A8C]
              "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* ICONO OJO */}
            <span
              className="
                absolute right-3 top-2.5 cursor-pointer text-white/70
                hover:text-white transition
              "
              onClick={() => setMostrarPass(!mostrarPass)}
            >
              {mostrarPass ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          className="
            w-full py-2 rounded text-white font-semibold
            bg-[#1F3A5F] hover:bg-[#2F4A6F]
            shadow-[0_0_10px_rgba(31,58,95,0.6)]
            hover:shadow-[0_0_15px_rgba(31,58,95,0.9)]
            transition-all
          "
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
