import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Estado correcto: usuario + password
  const [form, setForm] = useState({ usuario: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // ⭐ Ahora login recibe un callback que navega SIN recargar la app
    login(form.usuario, form.password, () => navigate("/"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div
        className="
          bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-neutral-200 shadow-xl
          w-full max-w-md
        "
      >
        {/* LOGO DE LA EMPRESA */}
<div className="flex justify-center mb-4">
  <img
    src="/img/logo.jpg"
    alt="Logo empresa"
    className="h-20 w-auto rounded-xl shadow-md"
  />
</div>

{/* TÍTULO DE BIENVENIDA */}
<h2 className="text-2xl font-semibold text-center mb-2" style={{ color: "#1F3A5F" }}>
  Bienvenido a la Agenda Molsan
</h2>
       {/* TÍTULO DEL FORMULARIO */}
        <h1
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: "#6A7A8C" }}
        >
          Iniciar sesión
        </h1>

        {/* FORMULARIO */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Usuario */}
          <input
            type="text"
            name="usuario"
            placeholder="Usuario"
            value={form.usuario}
            onChange={handleChange}
            className="
              w-full px-4 py-3 bg-white border border-neutral-300
              rounded-xl text-[#1F3A5F] focus:border-[#2D6CDF] outline-none
              transition-all
            "
          />

          {/* Contraseña */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="
              w-full px-4 py-3 bg-white border border-neutral-300
              rounded-xl text-[#1F3A5F] focus:border-[#2D6CDF] outline-none
              transition-all
            "
          />

          <button
            className="
              w-full py-3 bg-[#2D6CDF] hover:bg-[#1F3A5F] text-white rounded-xl
              shadow-md hover:shadow-xl transition-all font-semibold
            "
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
