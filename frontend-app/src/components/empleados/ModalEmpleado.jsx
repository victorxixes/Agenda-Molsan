import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  subirFotoEmpleado,
  resetPasswordEmpleado,
} from "../../api/empleados";

import {
  useSeguridadStore,
} from "../../store/seguridadStore";


/**
 * ============================================================
 * MODAL EMPLEADO — MOLSAN ERP SAAS PREMIUM 2027
 * ============================================================
 *
 * PESTAÑAS:
 *
 * - Datos básicos
 * - Datos personales
 * - Datos laborales
 * - Accesos
 * - Seguridad
 * - Auditoría
 *
 * FUENTE DE SEGURIDAD:
 *
 * useSeguridadStore
 *
 * ============================================================
 */

export default function ModalEmpleado({
  open = false,
  empleadoId = null,
  onClose,
}) {
  /* ==========================================================
     STORE
  ========================================================== */

  const {
    ficha,
    permisos: permisosGlobales,
    cargarFicha,
    asignarModulos,
    asignarPermisos,
  } = useSeguridadStore();


  /* ==========================================================
     ESTADO
  ========================================================== */

  const [cargando, setCargando] =
    useState(false);

  const [guardando, setGuardando] =
    useState(false);

  const [subiendoFoto, setSubiendoFoto] =
    useState(false);

  const [resettingPassword, setResettingPassword] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [mensaje, setMensaje] =
    useState(null);

  const [pestana, setPestana] =
    useState("basicos");

  const [confirmReset, setConfirmReset] =
    useState(false);

  const [
    modulosVisibles,
    setModulosVisibles,
  ] = useState([]);

  const [
    permisosModulo,
    setPermisosModulo,
  ] = useState({});


  /* ==========================================================
     CARGAR FICHA
  ========================================================== */

  useEffect(() => {
    if (
      !open ||
      empleadoId === null ||
      empleadoId === undefined ||
      empleadoId === ""
    ) {
      return;
    }

    let activo = true;

    const cargar = async () => {
      try {
        setCargando(true);
        setError(null);
        setMensaje(null);

        await cargarFicha(
          empleadoId
        );

      } catch (err) {
        console.error(
          "MODAL EMPLEADO — ERROR CARGANDO FICHA:",
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

    cargar();

    return () => {
      activo = false;
    };
  }, [
    open,
    empleadoId,
    cargarFicha,
  ]);


  /* ==========================================================
     SINCRONIZAR FICHA
  ========================================================== */

  useEffect(() => {
    if (!ficha) {
      setModulosVisibles([]);
      setPermisosModulo({});
      return;
    }

    const modulos =
      Array.isArray(
        ficha.modulos_visibles
      )
        ? ficha.modulos_visibles
        : Array.isArray(
            ficha.modulos_visibles_list
          )
          ? ficha.modulos_visibles_list
          : [];

    setModulosVisibles(
      modulos.filter(
        (modulo) =>
          typeof modulo === "string"
      )
    );


    const permisos =
      ficha.permisos_modulo &&
      typeof ficha.permisos_modulo ===
        "object" &&
      !Array.isArray(
        ficha.permisos_modulo
      )
        ? ficha.permisos_modulo
        : ficha.permisos_modulo_dict &&
          typeof ficha.permisos_modulo_dict ===
            "object" &&
          !Array.isArray(
            ficha.permisos_modulo_dict
          )
          ? ficha.permisos_modulo_dict
          : {};

    setPermisosModulo(
      normalizarPermisos(
        permisos
      )
    );

  }, [ficha]);


  /* ==========================================================
     BLOQUEAR SCROLL
  ========================================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    const overflowOriginal =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        overflowOriginal;
    };
  }, [open]);


  /* ==========================================================
     ESC
  ========================================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
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
  }, [
    open,
    onClose,
  ]);


  /* ==========================================================
     EMPLEADO
  ========================================================== */

  const empleado =
    ficha?.empleado &&
    typeof ficha.empleado ===
      "object"
      ? ficha.empleado
      : ficha && typeof ficha === "object"
        ? ficha
        : null;


  /* ==========================================================
     NOMBRE
  ========================================================== */

  const nombreEmpleado =
    useMemo(() => {
      if (!empleado) {
        return "Empleado";
      }

      const nombre =
        [
          empleado.nombre,
          empleado.apellidos,
        ]
          .filter(Boolean)
          .join(" ")
          .trim();

      return (
        nombre ||
        empleado.nombre_completo ||
        ficha?.nombre_completo ||
        empleado.usuario ||
        "Empleado"
      );
    }, [
      empleado,
      ficha,
    ]);


  /* ==========================================================
     INICIALES
  ========================================================== */

  const iniciales =
    useMemo(() => {
      const partes =
        String(
          nombreEmpleado ||
            "Empleado"
        )
          .trim()
          .split(/\s+/)
          .filter(Boolean);

      if (!partes.length) {
        return "E";
      }

      if (partes.length === 1) {
        return partes[0]
          .substring(0, 2)
          .toUpperCase();
      }

      return (
        partes[0][0] +
        partes[
          partes.length - 1
        ][0]
      ).toUpperCase();

    }, [
      nombreEmpleado,
    ]);


  /* ==========================================================
     FOTO
  ========================================================== */

  const foto =
    empleado?.foto_url ||
    empleado?.fotoUrl ||
    empleado?.foto ||
    ficha?.foto_url ||
    ficha?.fotoUrl ||
    ficha?.foto ||
    null;


  /* ==========================================================
     ROL
  ========================================================== */

  const rol =
    empleado?.rol?.nombre ||
    empleado?.rol_nombre ||
    ficha?.rol?.nombre ||
    ficha?.rol_nombre ||
    "Empleado";


  /* ==========================================================
     NORMALIZAR PERMISOS
  ========================================================== */

  function normalizarPermisos(
    valor
  ) {
    if (
      !valor ||
      typeof valor !==
        "object" ||
      Array.isArray(valor)
    ) {
      return {};
    }

    const resultado = {};

    Object.entries(
      valor
    ).forEach(
      ([
        modulo,
        permisos,
      ]) => {
        if (
          typeof modulo !==
          "string"
        ) {
          return;
        }

        if (
          Array.isArray(
            permisos
          )
        ) {
          resultado[
            modulo
          ] = permisos.filter(
            (permiso) =>
              typeof permiso ===
              "string"
          );

          return;
        }

        if (
          permisos &&
          typeof permisos ===
            "object"
        ) {
          resultado[
            modulo
          ] = Object.entries(
            permisos
          )
            .filter(
              ([, activo]) =>
                Boolean(activo)
            )
            .map(
              ([permiso]) =>
                permiso
            );
        }
      }
    );

    return resultado;
  }


  /* ==========================================================
     PERMISOS DISPONIBLES
  ========================================================== */

  const permisosDisponibles =
    useMemo(() => {
      const resultado = {};

      if (
        !Array.isArray(
          permisosGlobales
        )
      ) {
        return resultado;
      }

      permisosGlobales.forEach(
        (permiso) => {
          if (
            !permiso ||
            typeof permiso !==
              "object"
          ) {
            return;
          }

          const modulo =
            typeof permiso.modulo ===
            "string"
              ? permiso.modulo.trim()
              : "";

          const nombrePermiso =
            typeof permiso.permiso ===
            "string"
              ? permiso.permiso.trim()
              : "";

          if (
            !modulo ||
            !nombrePermiso
          ) {
            return;
          }

          if (
            !resultado[
              modulo
            ]
          ) {
            resultado[
              modulo
            ] = [];
          }

          if (
            !resultado[
              modulo
            ].includes(
              nombrePermiso
            )
          ) {
            resultado[
              modulo
            ].push(
              nombrePermiso
            );
          }
        }
      );

      Object.keys(
        resultado
      ).forEach(
        (modulo) => {
          resultado[
            modulo
          ].sort(
            (a, b) =>
              a.localeCompare(
                b,
                "es",
                {
                  sensitivity:
                    "base",
                }
              )
          );
        }
      );

      return resultado;
    }, [
      permisosGlobales,
    ]);


  /* ==========================================================
     MÓDULOS DISPONIBLES
  ========================================================== */

  const modulosDisponibles =
    useMemo(() => {
      const conjunto =
        new Set();

      Object.keys(
        permisosDisponibles
      ).forEach(
        (modulo) => {
          conjunto.add(
            modulo
          );
        }
      );

      modulosVisibles.forEach(
        (modulo) => {
          if (
            typeof modulo ===
            "string"
          ) {
            conjunto.add(
              modulo
            );
          }
        }
      );

      return Array.from(
        conjunto
      ).sort(
        (a, b) =>
          a.localeCompare(
            b,
            "es",
            {
              sensitivity:
                "base",
            }
          )
      );
    }, [
      permisosDisponibles,
      modulosVisibles,
    ]);


  /* ==========================================================
     AUDITORÍA
  ========================================================== */

  const auditoria =
    useMemo(() => {
      if (
        Array.isArray(
          ficha?.auditoria
        )
      ) {
        return ficha.auditoria;
      }

      return [];
    }, [
      ficha,
    ]);


  /* ==========================================================
     HELPERS
  ========================================================== */

  const mostrarValor = (
    valor
  ) => {
    if (
      valor === null ||
      valor === undefined ||
      valor === ""
    ) {
      return "—";
    }

    if (
      typeof valor ===
      "boolean"
    ) {
      return valor
        ? "Sí"
        : "No";
    }

    return String(
      valor
    );
  };


  const capitalizar = (
    valor
  ) => {
    if (!valor) {
      return "";
    }

    return String(
      valor
    )
      .replace(
        /_/g,
        " "
      )
      .replace(
        /\b\w/g,
        (letra) =>
          letra.toUpperCase()
      );
  };


  /* ==========================================================
     OBTENER CAMPO
  ========================================================== */

  const obtenerCampo = (
    ...claves
  ) => {
    for (
      const clave of claves
    ) {
      const valor =
        empleado?.[clave] ??
        ficha?.[clave];

      if (
        valor !== null &&
        valor !== undefined &&
        valor !== ""
      ) {
        return valor;
      }
    }

    return null;
  };


  /* ==========================================================
     CAMPO VISUAL
  ========================================================== */

  const Campo = ({
    etiqueta,
    valor,
  }) => (
    <div
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
        {etiqueta}
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
        {mostrarValor(
          valor
        )}
      </p>
    </div>
  );


  /* ==========================================================
     TOGGLE MÓDULO
  ========================================================== */

  const toggleModulo = (
    modulo
  ) => {
    setModulosVisibles(
      (actuales) => {
        if (
          actuales.includes(
            modulo
          )
        ) {
          return actuales.filter(
            (item) =>
              item !== modulo
          );
        }

        return [
          ...actuales,
          modulo,
        ];
      }
    );
  };


  /* ==========================================================
     TOGGLE PERMISO
  ========================================================== */

  const togglePermiso = (
    modulo,
    permiso
  ) => {
    setPermisosModulo(
      (actuales) => {
        const actualesModulo =
          Array.isArray(
            actuales[
              modulo
            ]
          )
            ? actuales[
                modulo
              ]
            : [];

        const existe =
          actualesModulo.includes(
            permiso
          );

        return {
          ...actuales,

          [modulo]:
            existe
              ? actualesModulo.filter(
                  (item) =>
                    item !==
                    permiso
                )
              : [
                  ...actualesModulo,
                  permiso,
                ],
        };
      }
    );
  };


  /* ==========================================================
     GUARDAR CONFIGURACIÓN
  ========================================================== */

  const guardarConfiguracion =
    async () => {
      if (
        empleadoId === null ||
        empleadoId === undefined
      ) {
        return;
      }

      try {
        setGuardando(
          true
        );

        setError(
          null
        );

        setMensaje(
          null
        );

        await asignarModulos(
          empleadoId,
          modulosVisibles
        );

        await asignarPermisos(
          empleadoId,
          permisosModulo
        );

        await cargarFicha(
          empleadoId
        );

        setMensaje(
          "Configuración actualizada correctamente."
        );

      } catch (err) {
        console.error(
          "MODAL EMPLEADO — ERROR GUARDANDO CONFIGURACIÓN:",
          err
        );

        setError(
          "No se ha podido guardar la configuración."
        );
      } finally {
        setGuardando(
          false
        );
      }
    };


  /* ==========================================================
     RESET PASSWORD
  ========================================================== */

  const ejecutarResetPassword =
    async () => {
      if (
        !empleadoId
      ) {
        return;
      }

      try {
        setResettingPassword(
          true
        );

        setError(
          null
        );

        setMensaje(
          null
        );

        const respuesta =
          await resetPasswordEmpleado(
            empleadoId
          );

        const nuevaPassword =
          respuesta?.data?.password ||
          respuesta?.data?.nueva_password ||
          respuesta?.data?.temporary_password ||
          null;

        if (
          nuevaPassword
        ) {
          setMensaje(
            `Contraseña temporal: ${nuevaPassword}`
          );
        } else {
          setMensaje(
            "La contraseña se ha restablecido correctamente."
          );
        }

        setConfirmReset(
          false
        );

      } catch (err) {
        console.error(
          "MODAL EMPLEADO — ERROR RESETEANDO PASSWORD:",
          err
        );

        setError(
          "No se ha podido restablecer la contraseña."
        );
      } finally {
        setResettingPassword(
          false
        );
      }
    };


  /* ==========================================================
     SUBIR FOTO
  ========================================================== */

  const handleFoto = async (
    event
  ) => {
    const archivo =
      event.target.files?.[0];

    if (!archivo) {
      return;
    }

    try {
      setSubiendoFoto(
        true
      );

      setError(
        null
      );

      setMensaje(
        null
      );

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

      if (
        nuevaFoto
      ) {
        await cargarFicha(
          empleadoId
        );
      }

      setMensaje(
        "Fotografía actualizada correctamente."
      );

    } catch (err) {
      console.error(
        "MODAL EMPLEADO — ERROR SUBIENDO FOTO:",
        err
      );

      setError(
        "No se ha podido actualizar la fotografía."
      );
    } finally {
      setSubiendoFoto(
        false
      );

      event.target.value =
        "";
    }
  };


  /* ==========================================================
     NO RENDER
  ========================================================== */

  if (!open) {
    return null;
  }


  /* ==========================================================
     RENDER
  ========================================================== */

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

      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-slate-950/55
          backdrop-blur-md
        "
        onClick={
          onClose
        }
      />


      {/* =====================================================
          MODAL
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          w-full
          max-w-6xl
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
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
      >

        {/* =================================================
            CABECERA
        ================================================= */}

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

              <div
                className="
                  relative
                  shrink-0
                "
              >

                {foto ? (
                  <img
                    src={foto}
                    alt={
                      nombreEmpleado
                    }
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


              <div
                className="
                  min-w-0
                "
              >

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


            <button
              type="button"
              onClick={
                onClose
              }
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


        {/* =================================================
            PESTAÑAS
        ================================================= */}

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
              id: "basicos",
              label: "Datos básicos",
              icon: "👤",
            },
            {
              id: "personales",
              label: "Datos personales",
              icon: "🏠",
            },
            {
              id: "laborales",
              label: "Datos laborales",
              icon: "💼",
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
            {
              id: "auditoria",
              label: "Auditoría",
              icon: "📋",
            },
          ].map(
            (item) => (
              <button
                key={
                  item.id
                }
                type="button"
                onClick={() =>
                  setPestana(
                    item.id
                  )
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
                    pestana ===
                    item.id
                      ? "text-blue-700"
                      : "text-slate-500 hover:text-slate-800"
                  }
                `}
              >

                <span
                  className="
                    mr-2
                  "
                >
                  {item.icon}
                </span>

                {item.label}

                {pestana ===
                  item.id && (
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
            )
          )}

        </div>


        {/* =================================================
            CONTENIDO
        ================================================= */}

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

          {/* =================================================
              LOADING
          ================================================= */}

          {cargando && (
            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
              "
            >

              <div
                className="
                  text-center
                "
              >

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


          {/* =================================================
              ERROR
          ================================================= */}

          {!cargando &&
            error && (
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


          {/* =================================================
              MENSAJE
          ================================================= */}

          {!cargando &&
            mensaje && (
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


          {!cargando &&
            ficha &&
            empleado && (
              <>

                {/* =================================================
                    DATOS BÁSICOS
                ================================================= */}

                {pestana ===
                  "basicos" && (
                  <div
                    className="
                      space-y-5
                    "
                  >

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

                        <div
                          className="
                            shrink-0
                          "
                        >

                          {foto ? (
                            <img
                              src={foto}
                              alt={
                                nombreEmpleado
                              }
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


                        <div
                          className="
                            flex-1
                          "
                        >

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
                              onChange={
                                handleFoto
                              }
                              disabled={
                                subiendoFoto
                              }
                              className="hidden"
                            />

                          </label>

                        </div>

                      </div>

                    </section>


                    {/* IDENTIDAD */}

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
                        "
                      >

                        <h3
                          className="
                            text-base
                            font-bold
                            text-slate-900
                          "
                        >
                          Datos básicos
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-slate-500
                          "
                        >
                          Identificación principal
                          del empleado.
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

                        <Campo
                          etiqueta="ID"
                          valor={
                            obtenerCampo(
                              "id"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Usuario"
                          valor={
                            obtenerCampo(
                              "usuario",
                              "username"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Nombre"
                          valor={
                            obtenerCampo(
                              "nombre"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Apellidos"
                          valor={
                            obtenerCampo(
                              "apellidos"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Nombre completo"
                          valor={
                            obtenerCampo(
                              "nombre_completo",
                              "nombreCompleto"
                            ) ||
                            nombreEmpleado
                          }
                        />

                        <Campo
                          etiqueta="DNI"
                          valor={
                            obtenerCampo(
                              "dni",
                              "nif"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Rol"
                          valor={
                            rol
                          }
                        />

                        <Campo
                          etiqueta="Activo"
                          valor={
                            obtenerCampo(
                              "activo"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Fecha de alta"
                          valor={
                            obtenerCampo(
                              "fecha_alta"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Fecha de baja"
                          valor={
                            obtenerCampo(
                              "fecha_baja"
                            )
                          }
                        />

                      </div>

                    </section>

                  </div>
                )}


                {/* =================================================
                    DATOS PERSONALES
                ================================================= */}

                {pestana ===
                  "personales" && (
                  <div
                    className="
                      space-y-5
                    "
                  >

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
                        "
                      >

                        <h3
                          className="
                            text-base
                            font-bold
                            text-slate-900
                          "
                        >
                          Datos personales
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-slate-500
                          "
                        >
                          Información personal
                          y de contacto.
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

                        <Campo
                          etiqueta="Teléfono"
                          valor={
                            obtenerCampo(
                              "telefono",
                              "telefono_personal"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Email personal"
                          valor={
                            obtenerCampo(
                              "email_personal"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Fecha de nacimiento"
                          valor={
                            obtenerCampo(
                              "fecha_nacimiento"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Dirección"
                          valor={
                            obtenerCampo(
                              "direccion"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Código postal"
                          valor={
                            obtenerCampo(
                              "codigo_postal"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Población"
                          valor={
                            obtenerCampo(
                              "poblacion"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Provincia"
                          valor={
                            obtenerCampo(
                              "provincia"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Alergias"
                          valor={
                            obtenerCampo(
                              "alergias"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Persona de contacto"
                          valor={
                            obtenerCampo(
                              "persona_contacto"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Teléfono de contacto"
                          valor={
                            obtenerCampo(
                              "telefono_contacto"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Observaciones"
                          valor={
                            obtenerCampo(
                              "observaciones"
                            )
                          }
                        />

                      </div>

                    </section>

                  </div>
                )}


                {/* =================================================
                    DATOS LABORALES
                ================================================= */}

                {pestana ===
                  "laborales" && (
                  <div
                    className="
                      space-y-5
                    "
                  >

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
                        "
                      >

                        <h3
                          className="
                            text-base
                            font-bold
                            text-slate-900
                          "
                        >
                          Datos laborales
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-slate-500
                          "
                        >
                          Organización y situación
                          laboral del empleado.
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

                        <Campo
                          etiqueta="Departamento"
                          valor={
                            obtenerCampo(
                              "departamento_nombre"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Departamento ID"
                          valor={
                            obtenerCampo(
                              "departamento_id"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Sección"
                          valor={
                            obtenerCampo(
                              "seccion_nombre"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Sección ID"
                          valor={
                            obtenerCampo(
                              "seccion_id"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Cargo"
                          valor={
                            obtenerCampo(
                              "cargo_nombre"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Cargo ID"
                          valor={
                            obtenerCampo(
                              "cargo_id"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Email empresa"
                          valor={
                            obtenerCampo(
                              "email_empresa"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Extensión"
                          valor={
                            obtenerCampo(
                              "extension"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Usuario"
                          valor={
                            obtenerCampo(
                              "usuario"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Rol"
                          valor={
                            rol
                          }
                        />

                        <Campo
                          etiqueta="Rol ID"
                          valor={
                            obtenerCampo(
                              "rol_id"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Fecha de alta"
                          valor={
                            obtenerCampo(
                              "fecha_alta"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Fecha de baja"
                          valor={
                            obtenerCampo(
                              "fecha_baja"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Activo"
                          valor={
                            obtenerCampo(
                              "activo"
                            )
                          }
                        />

                      </div>

                    </section>


                    {/* RESUMEN */}

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

                      <h3
                        className="
                          text-base
                          font-bold
                          text-slate-900
                        "
                      >
                        Resumen laboral
                      </h3>

                      <div
                        className="
                          mt-4
                          grid
                          grid-cols-1
                          gap-4
                          sm:grid-cols-3
                        "
                      >

                        <div
                          className="
                            rounded-2xl
                            border
                            border-blue-100
                            bg-blue-50
                            p-4
                          "
                        >
                          <p
                            className="
                              text-xs
                              font-semibold
                              text-blue-500
                            "
                          >
                            Departamento
                          </p>

                          <p
                            className="
                              mt-1
                              text-sm
                              font-bold
                              text-blue-800
                            "
                          >
                            {mostrarValor(
                              obtenerCampo(
                                "departamento_nombre"
                              )
                            )}
                          </p>
                        </div>


                        <div
                          className="
                            rounded-2xl
                            border
                            border-cyan-100
                            bg-cyan-50
                            p-4
                          "
                        >
                          <p
                            className="
                              text-xs
                              font-semibold
                              text-cyan-600
                            "
                          >
                            Sección
                          </p>

                          <p
                            className="
                              mt-1
                              text-sm
                              font-bold
                              text-cyan-800
                            "
                          >
                            {mostrarValor(
                              obtenerCampo(
                                "seccion_nombre"
                              )
                            )}
                          </p>
                        </div>


                        <div
                          className="
                            rounded-2xl
                            border
                            border-violet-100
                            bg-violet-50
                            p-4
                          "
                        >
                          <p
                            className="
                              text-xs
                              font-semibold
                              text-violet-600
                            "
                          >
                            Cargo
                          </p>

                          <p
                            className="
                              mt-1
                              text-sm
                              font-bold
                              text-violet-800
                            "
                          >
                            {mostrarValor(
                              obtenerCampo(
                                "cargo_nombre"
                              )
                            )}
                          </p>
                        </div>

                      </div>

                    </section>

                  </div>
                )}


                {/* =================================================
                    ACCESOS
                ================================================= */}

                {pestana ===
                  "accesos" && (
                  <div
                    className="
                      space-y-5
                    "
                  >

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
                          {
                            modulosVisibles.length
                          } módulos
                        </span>

                      </div>


                      {modulosDisponibles.length >
                      0 ? (
                        <div
                          className="
                            grid
                            grid-cols-1
                            gap-2
                            sm:grid-cols-2
                            lg:grid-cols-3
                          "
                        >

                          {modulosDisponibles.map(
                            (
                              modulo
                            ) => {
                              const activo =
                                modulosVisibles.includes(
                                  modulo
                                );

                              return (
                                <label
                                  key={
                                    modulo
                                  }
                                  className={`
                                    flex
                                    cursor-pointer
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    px-4
                                    py-3
                                    transition
                                    ${
                                      activo
                                        ? "border-blue-200 bg-blue-50"
                                        : "border-slate-200 bg-white hover:bg-slate-50"
                                    }
                                  `}
                                >

                                  <input
                                    type="checkbox"
                                    checked={
                                      activo
                                    }
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
                                    className={`
                                      text-sm
                                      font-medium
                                      ${
                                        activo
                                          ? "text-blue-700"
                                          : "text-slate-700"
                                      }
                                    `}
                                  >
                                    {capitalizar(
                                      modulo
                                    )}
                                  </span>

                                </label>
                              );
                            }
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
                            disponibles.
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

                      <div
                        className="
                          mb-5
                        "
                      >

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


                      {modulosDisponibles.length >
                      0 ? (
                        <div
                          className="
                            space-y-3
                          "
                        >

                          {modulosDisponibles.map(
                            (
                              modulo
                            ) => {
                              const disponibles =
                                permisosDisponibles[
                                  modulo
                                ] || [];

                              const activos =
                                Array.isArray(
                                  permisosModulo[
                                    modulo
                                  ]
                                )
                                  ? permisosModulo[
                                      modulo
                                    ]
                                  : [];

                              return (
                                <div
                                  key={
                                    modulo
                                  }
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

                                    <span
                                      className="
                                        rounded-full
                                        bg-white
                                        px-2.5
                                        py-1
                                        text-[11px]
                                        font-semibold
                                        text-slate-500
                                      "
                                    >
                                      {
                                        activos.length
                                      } activos
                                    </span>

                                  </div>


                                  {disponibles.length >
                                  0 ? (
                                    <div
                                      className="
                                        flex
                                        flex-wrap
                                        gap-2
                                      "
                                    >

                                      {disponibles.map(
                                        (
                                          permiso
                                        ) => {
                                          const activo =
                                            activos.includes(
                                              permiso
                                            );

                                          return (
                                            <label
                                              key={
                                                permiso
                                              }
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
                                                checked={
                                                  activo
                                                }
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
                                          );
                                        }
                                      )}

                                    </div>
                                  ) : (
                                    <span
                                      className="
                                        text-xs
                                        text-slate-400
                                      "
                                    >
                                      Sin permisos
                                      definidos para
                                      este módulo.
                                    </span>
                                  )}

                                </div>
                              );
                            }
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
                            disponibles para
                            configurar permisos.
                          </p>
                        </div>
                      )}

                    </section>

                  </div>
                )}


                {/* =================================================
                    SEGURIDAD
                ================================================= */}

                {pestana ===
                  "seguridad" && (
                  <div
                    className="
                      space-y-5
                    "
                  >

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
                        "
                      >

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
                          y el acceso del empleado.
                        </p>

                      </div>


                      {/* RESET PASSWORD */}

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
                                  disabled:cursor-not-allowed
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


                      {/* ESTADO */}

                      <div
                        className="
                          mt-5
                          grid
                          grid-cols-1
                          gap-4
                          sm:grid-cols-2
                        "
                      >

                        <Campo
                          etiqueta="Usuario"
                          valor={
                            obtenerCampo(
                              "usuario"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Estado"
                          valor={
                            obtenerCampo(
                              "activo"
                            )
                            ? "Activo"
                            : "Inactivo"
                          }
                        />

                        <Campo
                          etiqueta="Fecha de alta"
                          valor={
                            obtenerCampo(
                              "fecha_alta"
                            )
                          }
                        />

                        <Campo
                          etiqueta="Fecha de baja"
                          valor={
                            obtenerCampo(
                              "fecha_baja"
                            )
                          }
                        />

                      </div>

                    </section>

                  </div>
                )}


                {/* =================================================
                    AUDITORÍA
                ================================================= */}

                {pestana ===
                  "auditoria" && (
                  <div
                    className="
                      space-y-5
                    "
                  >

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
                            Auditoría
                          </h3>

                          <p
                            className="
                              mt-1
                              text-sm
                              text-slate-500
                            "
                          >
                            Historial de actividad
                            relacionada con el empleado.
                          </p>

                        </div>

                        <span
                          className="
                            inline-flex
                            w-fit
                            rounded-full
                            bg-slate-100
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-slate-600
                          "
                        >
                          {
                            auditoria.length
                          } registros
                        </span>

                      </div>


                      {auditoria.length >
                      0 ? (
                        <div
                          className="
                            overflow-x-auto
                          "
                        >

                          <table
                            className="
                              min-w-full
                              text-left
                            "
                          >

                            <thead>

                              <tr
                                className="
                                  border-b
                                  border-slate-200
                                "
                              >

                                <th
                                  className="
                                    px-4
                                    py-3
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                  "
                                >
                                  Fecha
                                </th>

                                <th
                                  className="
                                    px-4
                                    py-3
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                  "
                                >
                                  Usuario
                                </th>

                                <th
                                  className="
                                    px-4
                                    py-3
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                  "
                                >
                                  Módulo
                                </th>

                                <th
                                  className="
                                    px-4
                                    py-3
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                  "
                                >
                                  Acción
                                </th>

                                <th
                                  className="
                                    px-4
                                    py-3
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                  "
                                >
                                  Descripción
                                </th>

                              </tr>

                            </thead>


                            <tbody>

                              {auditoria.map(
                                (
                                  registro,
                                  indice
                                ) => (
                                  <tr
                                    key={
                                      registro?.id ??
                                      indice
                                    }
                                    className="
                                      border-b
                                      border-slate-100
                                      last:border-0
                                    "
                                  >

                                    <td
                                      className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-600
                                      "
                                    >
                                      {mostrarValor(
                                        registro?.fecha
                                      )}
                                    </td>

                                    <td
                                      className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-slate-700
                                      "
                                    >
                                      {mostrarValor(
                                        registro?.usuario
                                      )}
                                    </td>

                                    <td
                                      className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-600
                                      "
                                    >
                                      {mostrarValor(
                                        registro?.modulo
                                      )}
                                    </td>

                                    <td
                                      className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                      "
                                    >
                                      {mostrarValor(
                                        registro?.accion
                                      )}
                                    </td>

                                    <td
                                      className="
                                        min-w-[280px]
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-600
                                      "
                                    >
                                      {mostrarValor(
                                        registro?.descripcion
                                      )}
                                    </td>

                                  </tr>
                                )
                              )}

                            </tbody>

                          </table>

                        </div>
                      ) : (
                        <div
                          className="
                            rounded-xl
                            border
                            border-dashed
                            border-slate-300
                            bg-slate-50
                            p-8
                            text-center
                          "
                        >

                          <div
                            className="
                              text-3xl
                            "
                          >
                            📋
                          </div>

                          <p
                            className="
                              mt-3
                              text-sm
                              font-semibold
                              text-slate-600
                            "
                          >
                            No hay registros
                            de auditoría.
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-400
                            "
                          >
                            La actividad aparecerá
                            aquí cuando exista.
                          </p>

                        </div>
                      )}

                    </section>

                  </div>
                )}

              </>
            )}

        </div>


        {/* =====================================================
            FOOTER
        ===================================================== */}

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

            {pestana ===
              "accesos" && (
              <button
                type="button"
                onClick={
                  guardarConfiguracion
                }
                disabled={
                  guardando ||
                  cargando ||
                  !empleado
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
              onClick={
                onClose
              }
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
