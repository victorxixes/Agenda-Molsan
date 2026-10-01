import { useState, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

/**
 * LOGIN — MOLSAN ERP SAAS PREMIUM 2027
 *
 * Diseño:
 * - Premium / Glass Luxe
 * - Fondo claro corporativo
 * - Coherente con el resto del ERP
 * - Responsive
 * - Sin dependencias adicionales
 *
 * Lógica:
 * - Mantiene Zustand
 * - Mantiene iniciarSesion()
 * - Mantiene navegación a /dashboard
 * - Mantiene validaciones
 * - Mantiene estado de carga
 */

export default function LoginPage() {
  const navigate = useNavigate();

  const iniciarSesion = useAuthStore(
    (state) => state.iniciarSesion
  );

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (cargando) {
        return;
      }

      setError(null);

      if (!usuario.trim()) {
        setError("Introduce tu usuario.");
        return;
      }

      if (!password) {
        setError("Introduce tu contraseña.");
        return;
      }

      try {
        setCargando(true);

        const ok = await iniciarSesion(
          usuario.trim(),
          password
        );

        if (ok) {
          navigate("/dashboard");
          return;
        }

        setError(
          "Usuario o contraseña incorrectos."
        );
      } catch (err) {
        console.error(
          "ERROR LOGIN:",
          err
        );

        setError(
          "No se ha podido iniciar sesión."
        );
      } finally {
        setCargando(false);
      }
    },
    [
      usuario,
      password,
      cargando,
      iniciarSesion,
      navigate
    ]
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        min-h-screen
        relative
        flex
        items-center
        justify-center
        overflow-hidden

        px-4
        py-8

        bg-slate-100

        animate-fadeIn
      "
    >

      {/* =====================================================
          FONDO PREMIUM
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          overflow-hidden
        "
      >

        {/* Luz superior izquierda */}

        <div
          className="
            absolute
            -top-48
            -left-48

            w-[520px]
            h-[520px]

            rounded-full

            bg-blue-400/10

            blur-3xl
          "
        />

        {/* Luz inferior derecha */}

        <div
          className="
            absolute
            -bottom-48
            -right-48

            w-[520px]
            h-[520px]

            rounded-full

            bg-cyan-300/10

            blur-3xl
          "
        />

        {/* Luz central */}

        <div
          className="
            absolute
            top-1/2
            left-1/2

            w-[700px]
            h-[700px]

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-white/70

            blur-3xl
          "
        />

        {/* Capa sutil */}

        <div
          className="
            absolute
            inset-0

            bg-gradient-to-br
            from-white/70
            via-transparent
            to-blue-50/70
          "
        />

      </div>


      {/* =====================================================
          CONTENEDOR
      ===================================================== */}

      <div
        className="
          relative
          z-10

          w-full
          max-w-md

          animate-slideUp
        "
      >

        {/* ===================================================
            TARJETA LOGIN
        =================================================== */}

        <div
          className="
            relative
            overflow-hidden

            rounded-[28px]

            border
            border-white/80

            bg-white/75

            backdrop-blur-2xl

            shadow-[0_25px_80px_rgba(15,23,42,0.12)]

            p-7
            sm:p-9
          "
        >

          {/* =================================================
              BRILLO SUPERIOR
          ================================================= */}

          <div
            className="
              absolute
              top-0
              left-0
              right-0

              h-px

              bg-gradient-to-r
              from-transparent
              via-blue-400/50
              to-transparent
            "
          />

          {/* =================================================
              CABECERA
          ================================================= */}

          <div
            className="
              text-center
              mb-8
            "
          >

            {/* =================================================
                LOGO
            ================================================= */}

            <div
              className="
                flex
                justify-center

                mb-6
              "
            >

              <div
                className="
                  relative

                  p-2

                  rounded-2xl

                  bg-white

                  border
                  border-slate-200/80

                  shadow-[0_12px_30px_rgba(15,23,42,0.10)]
                "
              >

                <img
                  src="/img/logo.jpg"
                  alt="Molsan"
                  className="
                    h-20
                    sm:h-24

                    w-auto

                    rounded-xl

                    object-contain
                  "
                />

              </div>

            </div>


            {/* =================================================
                TÍTULO
            ================================================= */}

            <h1
              className="
                text-3xl
                sm:text-4xl

                font-bold

                tracking-tight

                text-slate-800
              "
            >
              Molsan ERP
            </h1>


            <p
              className="
                mt-2

                text-sm
                sm:text-base

                text-slate-500
              "
            >
              Plataforma de gestión empresarial
            </p>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div
              className="
                mb-5

                rounded-xl

                border
                border-red-200

                bg-red-50

                px-4
                py-3

                text-center

                shadow-sm

                animate-fadeIn
              "
            >

              <p
                className="
                  text-sm

                  font-medium

                  text-red-600
                "
              >
                {error}
              </p>

            </div>
          )}


          {/* =================================================
              FORMULARIO
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================================
                USUARIO
            ================================================= */}

            <div>

              <label
                htmlFor="usuario"
                className="
                  block

                  mb-2

                  text-sm

                  font-medium

                  text-slate-700
                "
              >
                Usuario
              </label>


              <div
                className="
                  relative
                "
              >

                {/* Icono */}

                <span
                  className="
                    absolute

                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-slate-400

                    pointer-events-none
                  "
                  aria-hidden="true"
                >
                  👤
                </span>


                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) =>
                    setUsuario(e.target.value)
                  }
                  autoFocus
                  autoComplete="username"
                  disabled={cargando}
                  placeholder="Introduce tu usuario"

                  className="
                    w-full

                    rounded-xl

                    border
                    border-slate-200

                    bg-white/80

                    px-4
                    py-3
                    pl-11

                    text-slate-800

                    placeholder:text-slate-400

                    outline-none

                    transition-all
                    duration-200

                    shadow-sm

                    focus:border-blue-400

                    focus:bg-white

                    focus:ring-4
                    focus:ring-blue-500/10

                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                />

              </div>

            </div>


            {/* =================================================
                CONTRASEÑA
            ================================================= */}

            <div>

              <label
                htmlFor="password"
                className="
                  block

                  mb-2

                  text-sm

                  font-medium

                  text-slate-700
                "
              >
                Contraseña
              </label>


              <div
                className="
                  relative
                "
              >

                {/* Icono */}

                <span
                  className="
                    absolute

                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-slate-400

                    pointer-events-none
                  "
                  aria-hidden="true"
                >
                  🔒
                </span>


                <input
                  id="password"
                  type={
                    mostrarPass
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  disabled={cargando}
                  placeholder="Introduce tu contraseña"

                  className="
                    w-full

                    rounded-xl

                    border
                    border-slate-200

                    bg-white/80

                    px-4
                    py-3
                    pl-11
                    pr-12

                    text-slate-800

                    placeholder:text-slate-400

                    outline-none

                    transition-all
                    duration-200

                    shadow-sm

                    focus:border-blue-400

                    focus:bg-white

                    focus:ring-4
                    focus:ring-blue-500/10

                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                />


                {/* =================================================
                    MOSTRAR PASSWORD
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    setMostrarPass(
                      (valor) => !valor
                    )
                  }
                  disabled={cargando}

                  aria-label={
                    mostrarPass
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }

                  className="
                    absolute

                    right-3
                    top-1/2

                    -translate-y-1/2

                    flex
                    items-center
                    justify-center

                    w-8
                    h-8

                    rounded-lg

                    text-slate-400

                    hover:text-slate-700

                    hover:bg-slate-100

                    transition-all

                    disabled:opacity-30
                  "
                >
                  {mostrarPass
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* =================================================
                BOTÓN LOGIN
            ================================================= */}

            <button
              type="submit"
              disabled={cargando}

              className="
                relative

                w-full

                overflow-hidden

                rounded-xl

                border
                border-blue-500/20

                bg-gradient-to-r
                from-blue-600
                to-blue-500

                py-3.5

                text-sm
                font-semibold

                text-white

                shadow-[0_10px_25px_rgba(37,99,235,0.20)]

                transition-all
                duration-200

                hover:from-blue-500
                hover:to-blue-400

                hover:shadow-[0_14px_35px_rgba(37,99,235,0.28)]

                active:scale-[0.98]

                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:active:scale-100
              "
            >

              {cargando ? (
                <span
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  <span
                    className="
                      h-4
                      w-4

                      rounded-full

                      border-2
                      border-white/30
                      border-t-white

                      animate-spin
                    "
                  />

                  Accediendo...

                </span>
              ) : (
                "Entrar en Molsan ERP"
              )}

            </button>

          </form>


          {/* =================================================
              PIE
          ================================================= */}

          <div
            className="
              mt-8

              pt-5

              border-t
              border-slate-200/80

              text-center
            "
          >

            <p
              className="
                text-xs

                text-slate-400
              "
            >
              Molsan ERP · Plataforma empresarial
            </p>

            <p
              className="
                mt-1

                text-[10px]

                uppercase
                tracking-[0.2em]

                text-slate-300
              "
            >
              Premium 2027
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
