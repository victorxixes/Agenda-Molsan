import { useState, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

/**
 * LOGIN — MOLSAN ERP SAAS PREMIUM 2027
 *
 * - Mantiene la autenticación actual con Zustand
 * - Mantiene iniciarSesion()
 * - Mantiene navegación a /dashboard
 * - Diseño Glass Luxe / Premium
 * - Responsive
 * - Animaciones suaves
 * - Sin dependencias adicionales
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

        bg-slate-950

        animate-fadeIn
      "
    >

      {/* =====================================================
          FONDO DECORATIVO
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
        "
      >

        <div
          className="
            absolute
            -top-40
            -left-40
            w-96
            h-96
            rounded-full
            bg-blue-500/20
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -right-40
            w-96
            h-96
            rounded-full
            bg-cyan-400/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            top-1/2
            left-1/2
            w-[600px]
            h-[600px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-indigo-500/5
            blur-3xl
          "
        />

      </div>


      {/* =====================================================
          CONTENEDOR LOGIN
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
            TARJETA GLASS
        =================================================== */}

        <div
          className="
            relative
            overflow-hidden

            rounded-3xl

            border
            border-white/15

            bg-white/[0.08]

            backdrop-blur-2xl

            shadow-[0_30px_90px_rgba(0,0,0,0.45)]

            p-7
            sm:p-9
          "
        >

          {/* Línea superior decorativa */}

          <div
            className="
              absolute
              top-0
              left-0
              right-0
              h-px

              bg-gradient-to-r
              from-transparent
              via-white/50
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

            {/* LOGO */}

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
                  p-1.5

                  rounded-2xl

                  bg-white/10

                  border
                  border-white/20

                  shadow-xl
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

                    shadow-lg
                  "
                />

              </div>

            </div>


            {/* TÍTULO */}

            <h1
              className="
                text-3xl
                sm:text-4xl

                font-bold

                tracking-tight

                text-white
              "
            >
              Molsan ERP
            </h1>


            <p
              className="
                mt-2

                text-sm
                sm:text-base

                text-white/55
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
                border-red-400/20

                bg-red-500/10

                px-4
                py-3

                text-center

                animate-fadeIn
              "
            >

              <p
                className="
                  text-sm
                  text-red-200
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

                  text-white/75
                "
              >
                Usuario
              </label>


              <div
                className="
                  relative
                "
              >

                <span
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2

                    text-white/35

                    pointer-events-none
                  "
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
                    border-white/10

                    bg-white/[0.07]

                    px-4
                    py-3
                    pl-11

                    text-white

                    placeholder:text-white/30

                    outline-none

                    transition-all
                    duration-200

                    focus:border-blue-400/50

                    focus:bg-white/[0.10]

                    focus:ring-2
                    focus:ring-blue-400/10

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

                  text-white/75
                "
              >
                Contraseña
              </label>


              <div
                className="
                  relative
                "
              >

                <span
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2

                    text-white/35

                    pointer-events-none
                  "
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
                    border-white/10

                    bg-white/[0.07]

                    px-4
                    py-3
                    pl-11
                    pr-12

                    text-white

                    placeholder:text-white/30

                    outline-none

                    transition-all
                    duration-200

                    focus:border-blue-400/50

                    focus:bg-white/[0.10]

                    focus:ring-2
                    focus:ring-blue-400/10

                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                />


                {/* MOSTRAR PASSWORD */}

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

                    text-white/45

                    hover:text-white

                    hover:bg-white/10

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
                border-blue-300/20

                bg-gradient-to-r
                from-blue-600
                to-cyan-600

                py-3.5

                text-sm
                font-semibold

                text-white

                shadow-[0_10px_30px_rgba(37,99,235,0.25)]

                transition-all
                duration-200

                hover:from-blue-500
                hover:to-cyan-500

                hover:shadow-[0_15px_40px_rgba(37,99,235,0.35)]

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
              border-white/10

              text-center
            "
          >

            <p
              className="
                text-xs
                text-white/30
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

                text-white/20
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
