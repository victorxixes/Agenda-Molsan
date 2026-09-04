import { useState } from "react";
import axios from "../api/axios";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("/auth/login", {
        usuario,
        password,
      });

      if (res.data.status === "ok") {
        localStorage.setItem("empleado", JSON.stringify(res.data.empleado));
        window.location.href = "/panel/empleados";
      } else {
        setError("Credenciales incorrectas");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="border border-gray-200 rounded-xl shadow-sm p-8 w-96">
        <h1 className="text-2xl font-bold text-[#1F3A5F] mb-6">
          Iniciar sesión
        </h1>

        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}

        <input
          className="border border-gray-300 rounded-lg p-2 w-full mb-3"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type="password"
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full px-4 py-2 bg-[#1F3A5F] text-white rounded-lg hover:bg-[#6A7A8C] transition"
        >
          Entrar
        </button>
      </div>
    </div>
  );
} 