import { useEffect, useMemo, useState } from "react";

import {
  obtenerFichaCompleta,
  actualizarModulosVisibles,
  actualizarPermisosModulo,
  resetPasswordEmpleado,
  subirFotoEmpleado,
} from "../../api/empleados";

/**
 * ============================================================
 * MODAL EMPLEADO — MOLSAN ERP SAAS PREMIUM 2027
 * ============================================================
 *
 * Compatible con:
 *
 * <ModalEmpleado
 *   open={true}
 *   empleadoId={id}
 *   onClose={onClose}
 * />
 *
 * Funcionalidades:
 * - Cargar ficha completa
 * - Mostrar datos del empleado
 * - Foto
 * - Módulos visibles
 * - Permisos por módulo
 * - Reset de contraseña
 * - Diseño Glass Luxe Premium
 * - Responsive
 * - Sin dependencias adicionales
 * ============================================================
 */

export default function ModalEmpleado({
  open = false,
  empleadoId = null,
  onClose,
}) {
  const [ficha, setFicha] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const [modulosVisibles, setModulosVisibles] = useState([]);
  const [permisosModulo, setPermisosModulo] = useState({});

  const [pestana, setPestana] = useState("datos");

  const [confirmReset, setConfirmReset] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // ============================================================
  // CARGAR FICHA
  // ============================================================

  useEffect(() => {
    if (!open || !empleadoId) {
      return;
    }

    let activo = true;

    const cargarFicha = async () => {
      try {
        setCargando(true);
        setError(null);
        setMensaje(null);
        setFicha(null);

        const respuesta =
          await obtenerFichaCompleta(empleadoId);

        if (!activo) {
          return;
        }

        const datos =
          respuesta?.data ?? respuesta ?? null;

        setFicha(datos);

        // ------------------------------------------------------
        // MÓDULOS
        // ------------------------------------------------------

        const modulos =
          datos?.modulos_visibles_list ??
          datos?.modulos_visibles ??
          datos?.modulos ??
          [];

        if (Array.isArray(modulos)) {
          setModulosVisibles(modulos);
        } else {
          setModulosVisibles([]);
        }

        // ------------------------------------------------------
        // PERMISOS
        // ------------------------------------------------------

        const permisos =
          datos?.permisos_modulo_dict ??
          datos?.permisos_modulo ??
          datos?.permisos ??
          {};

        if (
          permisos &&
          typeof permisos === "object" &&
          !Array.isArray(permisos)
        ) {
          setPermisosModulo(permisos);
        } else {
          setPermisosModulo({});
        }
      } catch (err) {
        console.error(
          "ERROR CARGANDO FICHA EMPLEADO:",
          err
        );

        if (activo) {
          setError(
            "No se ha podido cargar la ficha del empleado."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarFicha();

    return () => {
      activo = false;
    };
  }, [open, empleadoId]);

  // ============================================================
  // BLOQUEAR SCROLL
  // ============================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const overflowOriginal =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        overflowOriginal;
    };
  }, [open]);

  // ============================================================
  // ESC
  // ============================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  // ============================================================
  // DATOS DERIVADOS
  // ============================================================

  const nombreEmpleado = useMemo(() => {
    if (!ficha) {
      return "Empleado";
    }

    return (
      ficha.nombre_completo ||
      ficha.nombreCompleto ||
      ficha.nombre ||
      ficha.nombre_titular ||
      ficha.usuario ||
      ficha.username ||
      "Empleado"
    );
  }, [ficha]);

  const iniciales = useMemo(() => {
    const texto =
      String(nombreEmpleado || "E")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!texto.length) {
      return "E";
    }

    if (texto.length === 1) {
      return texto[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      texto[0][0] +
      texto[texto.length - 1][0]
    ).toUpperCase();
  }, [nombreEmpleado]);

  const foto = useMemo(() => {
    if (!ficha) {
      return null;
    }

    return (
      ficha.foto_url ||
      ficha.fotoUrl ||
      ficha.foto ||
      ficha.avatar_url ||
      ficha.avatar ||
      null
    );
  }, [ficha]);

  const rol = useMemo(() => {
    if (!ficha) {
      return "Empleado";
    }

    if (typeof ficha.rol === "string") {
      return ficha.rol;
    }

    return (
      ficha.rol?.nombre ||
      ficha.rol_nombre ||
      ficha.nombre_rol ||
      "Empleado"
    );
  }, [ficha]);

  // ============================================================
  // HELPERS
  // ============================================================

  const mostrarValor = (valor) => {
    if (
      valor === null ||
      valor === undefined ||
      valor === ""
    ) {
      return "—";
    }

    if (typeof valor === "boolean") {
      return valor ? "Sí" : "No";
    }

    return String(valor);
  };

  const capitalizar = (valor) => {
    if (!valor) {
      return "";
    }

    return String(valor)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letra) =>
        letra.toUpperCase()
      );
  };

  // ============================================================
  // TOGGLE MÓDULO
  // ============================================================

  const toggleModulo = (modulo) => {
    setModulosVisibles((actuales) => {
      if (actuales.includes(modulo)) {
        return actuales.filter(
          (item) => item !== modulo
        );
      }

      return [
        ...actuales,
        modulo,
      ];
    });
  };

  // ============================================================
  // CAMBIAR PERMISO
  // ============================================================

  const togglePermiso = (
    modulo,
    permiso
  ) => {
    setPermisosModulo((actuales) => {
      const moduloActual =
        actuales[modulo] || {};

      const valorActual =
        Boolean(moduloActual[permiso]);

      return {
        ...actuales,
        [modulo]: {
          ...moduloActual,
          [permiso]: !valorActual,
        },
      };
    });
  };

  // ============================================================
  // GUARDAR MÓDULOS / PERMISOS
  // ============================================================

  const guardarConfiguracion = async () => {
    try {
      setGuardando(true);
      setError(null);
      setMensaje(null);

      await actualizarModulosVisibles(
        empleadoId,
        modulosVisibles
      );

      await actualizarPermisosModulo(
        empleadoId,
        permisosModulo
      );

      setMensaje(
        "Configuración actualizada correctamente."
      );
    } catch (err) {
      console.error(
        "ERROR GUARDANDO CONFIGURACIÓN:",
        err
      );

      setError(
        "No se ha podido guardar la configuración."
      );
    } finally {
      setGuardando(false);
    }
  };

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  const ejecutarResetPassword = async () => {
    try {
      setResettingPassword(true);
      setError(null);
      setMensaje(null);

      const respuesta =
        await resetPasswordEmpleado(
          empleadoId
        );

      const nuevaPassword =
        respuesta?.data?.password ||
        respuesta?.data?.nueva_password ||
        respuesta?.data?.temporary_password ||
        null;

      if (nuevaPassword) {
        setMensaje(
          `Contraseña temporal: ${nuevaPassword}`
        );
      } else {
        setMensaje(
          "La contraseña se ha restablecido correctamente."
        );
      }

      setConfirmReset(false);
    } catch (err) {
      console.error(
        "ERROR RESETEANDO PASSWORD:",
        err
      );

      setError(
        "No se ha podido restablecer la contraseña."
      );
    } finally {
      setResettingPassword(false);
    }
  };

  // ============================================================
  // SUBIR FOTO
  // ============================================================

  const handleFoto = async (event) => {
    const archivo =
      event.target.files?.[0];

    if (!archivo) {
      return;
    }

    try {
      setSubiendoFoto(true);
      setError(null);
      setMensaje(null);

      const respuesta =
        await subirFotoEmpleado(
          empleadoId,
          archivo
        );

      const nuevaFoto =
        respuesta?.data?.foto_url ||
        respuesta?.data?.fotoUrl ||
        respuesta?.data?.foto ||
        null;

      if (nuevaFoto) {
        setFicha((actual) => ({
          ...(actual || {}),
          foto_url: nuevaFoto,
          fotoUrl: nuevaFoto,
        }));
      }

      setMensaje(
        "Fotografía actualizada correctamente."
      );
    } catch (err) {
      console.error(
        "ERROR SUBIENDO FOTO:",
        err
      );

      setError(
        "No se ha podido actualizar la fotografía."
      );
    } finally {
      setSubiendoFoto(false);

      event.target.value = "";
    }
  };

  // ============================================================
  // NO RENDER
  // ============================================================

  if (!open) {
    return null;
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        p-3
        sm:p-6
      "
    >

      {/* ======================================================
          BACKDROP
      ====================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-slate-950/55
          backdrop-blur-md
        "
        onClick={onClose}
      />

      {/* ======================================================
          MODAL
      ====================================================== */}

      <div
        className="
          relative
          z-10

          flex
          w-full
          max-w-5xl

          max-h-[94vh]

          flex-col

          overflow-hidden

          rounded-[28px]

          border
          border-slate-200/80

          bg-white

          shadow-[0_30px_100px_rgba(15,23,42,0.30)]

          animate-slideUp
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ====================================================
            CABECERA
        ==================================================== */}

        <div
          className="
            relative
            shrink-0

            overflow-hidden

            border-b
            border-slate-200

            bg-gradient-to-br
            from-slate-50
            via-white
            to-blue-50/60

            px-5
            py-5

            sm:px-7
          "
        >

          {/* brillo */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-56
              w-56
              rounded-full
              bg-blue-400/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-4
              "
            >

              {/* FOTO */}

              <div className="relative shrink-0">

                {foto ? (
                  <img
                    src={foto}
                    alt={nombreEmpleado}
                    className="
                      h-16
                      w-16

                      rounded-2xl

                      border
                      border-white

                      object-cover

                      shadow-lg
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-16
                      w-16

                      items-center
                      justify-center

                      rounded-2xl

                      bg-gradient-to-br
                      from-blue-600
                      to-cyan-500

                      text-xl
                      font-bold
                      text-white

                      shadow-lg
                    "
                  >
                    {iniciales}
                  </div>
                )}

              </div>

              {/* NOMBRE */}

              <div className="min-w-0">

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >

                  <h2
                    className="
                      truncate
                      text-xl
                      font-bold
                      tracking-tight
                      text-slate-900
                      sm:text-2xl
                    "
                  >
                    {nombreEmpleado}
                  </h2>

                  <span
                    className="
                      rounded-full
                      border
                      border-blue-200
                      bg-blue-50
                      px-2.5
                      py-1
                      text-[11px]
                      font-semibold
                      text-blue-700
                    "
                  >
                    {rol}
                  </span>

                </div>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Ficha de empleado
                  {empleadoId
                    ? ` · ID ${empleadoId}`
                    : ""}
                </p>

              </div>

            </div>

            {/* CERRAR */}

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-xl

                border
                border-slate-200

                bg-white

                text-xl
                text-slate-400

                shadow-sm

                transition

                hover:border-slate-300
                hover:bg-slate-50
                hover:text-slate-700
              "
              aria-label="Cerrar"
            >
              ×
            </button>

          </div>

        </div>


        {/* ====================================================
            PESTAÑAS
        ==================================================== */}

        <div
          className="
            flex
            shrink-0
            gap-1

            overflow-x-auto

            border-b
            border-slate-200

            bg-white

            px-4
            sm:px-6
          "
        >

          {[
            {
              id: "datos",
              label: "Datos",
              icon: "👤",
            },
            {
              id: "accesos",
              label: "Accesos",
              icon: "🔐",
            },
            {
              id: "seguridad",
              label: "Seguridad",
              icon: "🛡️",
            },
          ].map((item) => (

            <button
              key={item.id}
              type="button"
              onClick={() =>
                setPestana(item.id)
              }
              className={`
                relative
                shrink-0

                px-4
                py-3.5

                text-sm
                font-semibold

                transition

                ${
                  pestana === item.id
                    ? "text-blue-700"
                    : "text-slate-500 hover:text-slate-800"
                }
              `}
            >

              <span className="mr-2">
                {item.icon}
              </span>

              {item.label}

              {pestana === item.id && (
                <span
                  className="
                    absolute
                    bottom-0
                    left-3
                    right-3
                    h-0.5

                    rounded-full

                    bg-blue-600
                  "
                />
              )}

            </button>

          ))}

        </div>


        {/* ====================================================
            CONTENIDO
        ==================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            bg-slate-50/60
            p-4
            sm:p-6
          "
        >

          {/* LOADING */}

          {cargando && (
            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
              "
            >

              <div className="text-center">

                <div
                  className="
                    mx-auto
                    h-10
                    w-10

                    animate-spin

                    rounded-full

                    border-4
                    border-blue-100
                    border-t-blue-600
                  "
                />

                <p
                  className="
                    mt-4
                    text-sm
                    font-medium
                    text-slate-500
                  "
                >
                  Cargando ficha...
                </p>

              </div>

            </div>
          )}


          {/* ERROR */}

          {!cargando && error && (
            <div
              className="
                mb-5
                rounded-2xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
              "
            >
              {error}
            </div>
          )}


          {/* MENSAJE */}

          {!cargando && mensaje && (
            <div
              className="
                mb-5
                rounded-2xl
                border
                border-emerald-200
                bg-emerald-50
                px-4
                py-3
                text-sm
                font-medium
                text-emerald-700
              "
            >
              {mensaje}
            </div>
          )}


          {!cargando && ficha && (
            <>

              {/* ==================================================
                  DATOS
              ================================================== */}

              {pestana === "datos" && (
                <div className="space-y-5">

                  {/* FOTO */}

                  <section
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-5
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-center
                      "
                    >

                      <div className="shrink-0">

                        {foto ? (
                          <img
                            src={foto}
                            alt={nombreEmpleado}
                            className="
                              h-28
                              w-28
                              rounded-3xl
                              border
                              border-slate-200
                              object-cover
                              shadow-md
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-28
                              w-28
                              items-center
                              justify-center
                              rounded-3xl
                              bg-gradient-to-br
                              from-blue-600
                              to-cyan-500
                              text-3xl
                              font-bold
                              text-white
                              shadow-md
                            "
                          >
                            {iniciales}
                          </div>
                        )}

                      </div>

                      <div className="flex-1">

                        <h3
                          className="
                            text-base
                            font-bold
                            text-slate-900
                          "
                        >
                          Fotografía
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-slate-500
                          "
                        >
                          Actualiza la fotografía
                          del empleado.
                        </p>

                        <label
                          className="
                            mt-4
                            inline-flex
                            cursor-pointer
                            items-center
                            gap-2

                            rounded-xl

                            border
                            border-slate-200

                            bg-white

                            px-4
                            py-2.5

                            text-sm
                            font-semibold
                            text-slate-700

                            shadow-sm

                            transition

                            hover:border-blue-200
                            hover:bg-blue-50
                            hover:text-blue-700
                          "
                        >

                          {subiendoFoto
                            ? "Subiendo..."
                            : "Cambiar fotografía"}

                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFoto}
                            disabled={subiendoFoto}
                            className="hidden"
                          />

                        </label>

                      </div>

                    </div>

                  </section>


                  {/* DATOS PRINCIPALES */}

                  <section
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-5
                      shadow-sm
                    "
                  >

                    <div className="mb-5">

                      <h3
                        className="
                          text-base
                          font-bold
                          text-slate-900
                        "
                      >
                        Información del empleado
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        Información disponible
                        en el sistema.
                      </p>

                    </div>


                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                        lg:grid-cols-3
                      "
                    >

                      {Object.entries(ficha)
                        .filter(
                          ([clave]) =>
                            ![
                              "foto",
                              "foto_url",
                              "fotoUrl",
                              "avatar",
                              "avatar_url",
                              "modulos",
                              "modulos_visibles",
                              "modulos_visibles_list",
                              "permisos",
                              "permisos_modulo",
                              "permisos_modulo_dict",
                            ].includes(clave)
                        )
                        .slice(0, 30)
                        .map(
                          ([clave, valor]) => (

                            <div
                              key={clave}
                              className="
                                rounded-xl
                                border
                                border-slate-100
                                bg-slate-50/70
                                px-4
                                py-3
                              "
                            >

                              <p
                                className="
                                  text-[11px]
                                  font-semibold
                                  uppercase
                                  tracking-wide
                                  text-slate-400
                                "
                              >
                                {capitalizar(clave)}
                              </p>

                              <p
                                className="
                                  mt-1
                                  break-words
                                  text-sm
                                  font-medium
                                  text-slate-800
                                "
                              >
                                {mostrarValor(valor)}
                              </p>

                            </div>

                          )
                        )}

                    </div>

                  </section>

                </div>
              )}


              {/* ==================================================
                  ACCESOS
              ================================================== */}

              {pestana === "accesos" && (
                <div className="space-y-5">

                  {/* MÓDULOS */}

                  <section
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-5
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        mb-5
                        flex
                        flex-col
                        gap-2
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      <div>

                        <h3
                          className="
                            text-base
                            font-bold
                            text-slate-900
                          "
                        >
                          Módulos visibles
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-slate-500
                          "
                        >
                          Selecciona los módulos
                          que puede visualizar.
                        </p>

                      </div>

                      <span
                        className="
                          inline-flex
                          w-fit
                          rounded-full
                          bg-blue-50
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          text-blue-700
                        "
                      >
                        {modulosVisibles.length} módulos
                      </span>

                    </div>


                    {modulosVisibles.length > 0 ? (
                      <div
                        className="
                          grid
                          grid-cols-1
                          gap-2
                          sm:grid-cols-2
                          lg:grid-cols-3
                        "
                      >

                        {modulosVisibles.map(
                          (modulo) => (
                            <label
                              key={modulo}
                              className="
                                flex
                                cursor-pointer
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-blue-100
                                bg-blue-50/50
                                px-4
                                py-3
                                transition
                                hover:bg-blue-50
                              "
                            >

                              <input
                                type="checkbox"
                                checked
                                onChange={() =>
                                  toggleModulo(
                                    modulo
                                  )
                                }
                                className="
                                  h-4
                                  w-4
                                  accent-blue-600
                                "
                              />

                              <span
                                className="
                                  text-sm
                                  font-medium
                                  text-slate-700
                                "
                              >
                                {capitalizar(
                                  modulo
                                )}
                              </span>

                            </label>
                          )
                        )}

                      </div>
                    ) : (
                      <div
                        className="
                          rounded-xl
                          border
                          border-dashed
                          border-slate-300
                          bg-slate-50
                          p-6
                          text-center
                        "
                      >
                        <p
                          className="
                            text-sm
                            text-slate-500
                          "
                        >
                          No hay módulos
                          configurados.
                        </p>
                      </div>
                    )}

                  </section>


                  {/* PERMISOS */}

                  <section
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-5
                      shadow-sm
                    "
                  >

                    <div className="mb-5">

                      <h3
                        className="
                          text-base
                          font-bold
                          text-slate-900
                        "
                      >
                        Permisos por módulo
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        Configura las operaciones
                        permitidas para cada módulo.
                      </p>

                    </div>


                    {Object.keys(
                      permisosModulo
                    ).length > 0 ? (
                      <div className="space-y-3">

                        {Object.entries(
                          permisosModulo
                        ).map(
                          ([
                            modulo,
                            permisos,
                          ]) => (

                            <div
                              key={modulo}
                              className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-slate-50/60
                                p-4
                              "
                            >

                              <div
                                className="
                                  mb-3
                                  flex
                                  items-center
                                  justify-between
                                  gap-3
                                "
                              >

                                <span
                                  className="
                                    text-sm
                                    font-bold
                                    text-slate-800
                                  "
                                >
                                  {capitalizar(
                                    modulo
                                  )}
                                </span>

                              </div>


                              <div
                                className="
                                  flex
                                  flex-wrap
                                  gap-2
                                "
                              >

                                {permisos &&
                                typeof permisos ===
                                  "object" ? (
                                  Object.entries(
                                    permisos
                                  ).map(
                                    ([
                                      permiso,
                                      activo,
                                    ]) => (

                                      <label
                                        key={permiso}
                                        className={`
                                          flex
                                          cursor-pointer
                                          items-center
                                          gap-2
                                          rounded-xl
                                          border
                                          px-3
                                          py-2
                                          text-xs
                                          font-semibold
                                          transition
                                          ${
                                            activo
                                              ? "border-blue-200 bg-blue-50 text-blue-700"
                                              : "border-slate-200 bg-white text-slate-500"
                                          }
                                        `}
                                      >

                                        <input
                                          type="checkbox"
                                          checked={Boolean(
                                            activo
                                          )}
                                          onChange={() =>
                                            togglePermiso(
                                              modulo,
                                              permiso
                                            )
                                          }
                                          className="
                                            h-3.5
                                            w-3.5
                                            accent-blue-600
                                          "
                                        />

                                        {capitalizar(
                                          permiso
                                        )}

                                      </label>

                                    )
                                  )
                                ) : (
                                  <span
                                    className="
                                      text-xs
                                      text-slate-400
                                    "
                                  >
                                    Sin permisos
                                  </span>
                                )}

                              </div>

                            </div>

                          )
                        )}

                      </div>
                    ) : (
                      <div
                        className="
                          rounded-xl
                          border
                          border-dashed
                          border-slate-300
                          bg-slate-50
                          p-6
                          text-center
                        "
                      >
                        <p
                          className="
                            text-sm
                            text-slate-500
                          "
                        >
                          No hay permisos
                          configurados.
                        </p>
                      </div>
                    )}

                  </section>

                </div>
              )}


              {/* ==================================================
                  SEGURIDAD
              ================================================== */}

              {pestana === "seguridad" && (
                <div className="space-y-5">

                  <section
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-5
                      shadow-sm
                    "
                  >

                    <div className="mb-5">

                      <h3
                        className="
                          text-base
                          font-bold
                          text-slate-900
                        "
                      >
                        Seguridad
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        Gestiona las credenciales
                        del empleado.
                      </p>

                    </div>


                    <div
                      className="
                        rounded-2xl
                        border
                        border-amber-200
                        bg-amber-50
                        p-5
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          gap-4
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >

                        <div>

                          <h4
                            className="
                              font-bold
                              text-slate-800
                            "
                          >
                            Restablecer contraseña
                          </h4>

                          <p
                            className="
                              mt-1
                              text-sm
                              text-slate-600
                            "
                          >
                            Genera una nueva
                            contraseña para este
                            empleado.
                          </p>

                        </div>

                        {!confirmReset ? (
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmReset(
                                true
                              )
                            }
                            className="
                              rounded-xl
                              bg-amber-500
                              px-4
                              py-2.5
                              text-sm
                              font-semibold
                              text-white
                              shadow-sm
                              transition
                              hover:bg-amber-600
                            "
                          >
                            Restablecer
                          </button>
                        ) : (
                          <div
                            className="
                              flex
                              flex-wrap
                              gap-2
                            "
                          >

                            <button
                              type="button"
                              onClick={() =>
                                setConfirmReset(
                                  false
                                )
                              }
                              disabled={
                                resettingPassword
                              }
                              className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-600
                                transition
                                hover:bg-slate-50
                              "
                            >
                              Cancelar
                            </button>

                            <button
                              type="button"
                              onClick={
                                ejecutarResetPassword
                              }
                              disabled={
                                resettingPassword
                              }
                              className="
                                rounded-xl
                                bg-red-600
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-red-700
                                disabled:opacity-50
                              "
                            >
                              {resettingPassword
                                ? "Restableciendo..."
                                : "Sí, restablecer"}
                            </button>

                          </div>
                        )}

                      </div>

                    </div>

                  </section>

                </div>
              )}

            </>
          )}

        </div>


        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div
          className="
            flex
            shrink-0
            flex-col
            gap-3

            border-t
            border-slate-200

            bg-white

            px-5
            py-4

            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
        >

          <p
            className="
              text-xs
              text-slate-400
            "
          >
            Molsan ERP · Perfil de empleado
          </p>


          <div
            className="
              flex
              items-center
              justify-end
              gap-2
            "
          >

            {pestana === "accesos" && (
              <button
                type="button"
                onClick={
                  guardarConfiguracion
                }
                disabled={
                  guardando ||
                  cargando
                }
                className="
                  rounded-xl

                  border
                  border-blue-200

                  bg-blue-50

                  px-4
                  py-2.5

                  text-sm
                  font-semibold

                  text-blue-700

                  transition

                  hover:bg-blue-100

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {guardando
                  ? "Guardando..."
                  : "Guardar cambios"}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl

                bg-slate-900

                px-5
                py-2.5

                text-sm
                font-semibold

                text-white

                shadow-sm

                transition

                hover:bg-slate-800
              "
            >
              Cerrar
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
