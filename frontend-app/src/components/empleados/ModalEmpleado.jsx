import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { API_BASE } from "../../api/config";

import {
  obtenerFichaCompleta,
  actualizarModulosVisibles,
  actualizarPermisosModulo,
  subirFotoEmpleado,
  editarEmpleado,
  resetPasswordEmpleado,
} from "../../api/empleados";

import { getMaestros } from "../../api/maestros";

import SelectSJ from "../ui/SelectSJ";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const MODULOS_SJ2026 = [
  "dashboard",
  "agenda",
  "empleados",
  "ctn",
  "intranet",
  "mensajes",
  "noticias",
  "documentos",
  "auditoria",
  "logs",
  "seguridad",
  "utilidades",
  "maestros",
  "realtime",
  "herramientas",
  "panel-tecnico",
  "notificaciones",
  "expedientes",
];

const PERMISOS_SJ2026 = [
  "ver",
  "crear",
  "editar",
  "eliminar",
];

const TABS = [
  ["basicos", "Datos básicos"],
  ["personales", "Datos personales"],
  ["laborales", "Datos laborales"],
  ["seguridad", "Seguridad"],
  ["auditoria", "Auditoría"],
];


/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

export default function ModalEmpleado({
  open,
  empleadoId,
  onClose,
  onOverlayClick,
}) {
  const idNum = Number(empleadoId);

  const idValido =
    Number.isFinite(idNum) &&
    idNum > 0;


  /* =======================================================
     ESTADO
  ======================================================= */

  const [loading, setLoading] =
    useState(false);

  const [empleado, setEmpleado] =
    useState({});

  const [modulos, setModulos] =
    useState([]);

  const [permisos, setPermisos] =
    useState({});

  const [auditoria, setAuditoria] =
    useState([]);

  const [departamentos, setDepartamentos] =
    useState([]);

  const [secciones, setSecciones] =
    useState([]);

  const [cargos, setCargos] =
    useState([]);

  const [roles, setRoles] =
    useState([]);

  const [tab, setTab] =
    useState("basicos");

  const [seguridadTab, setSeguridadTab] =
    useState("modulos");

  const [toast, setToast] =
    useState(null);

  const [error, setError] =
    useState("");


  /* =======================================================
     TOAST
  ======================================================= */

  const mostrarToast = useCallback(
    (tipo, mensaje) => {
      setToast({
        tipo,
        mensaje,
      });

      setTimeout(() => {
        setToast(null);
      }, 3000);
    },
    []
  );


  /* =======================================================
     ESCAPE
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleEsc
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEsc
      );
    };
  }, [
    open,
    onClose,
  ]);


  /* =======================================================
     CARGAR FICHA
  ======================================================= */

  const cargarFicha = useCallback(
    async () => {
      if (
        !open ||
        !idValido
      ) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res =
          await obtenerFichaCompleta(
            idNum
          );

        const data =
          res.data || {};

        const empleadoData =
          data.empleado || {};

        setEmpleado(
          empleadoData
        );

        setModulos(
          Array.isArray(
            data.modulos_visibles
          )
            ? data.modulos_visibles
            : Array.isArray(
                empleadoData.modulos_visibles_list
              )
              ? empleadoData.modulos_visibles_list
              : []
        );

        setPermisos(
          data.permisos_modulo ||
          empleadoData.permisos_modulo_dict ||
          {}
        );

        setAuditoria(
          Array.isArray(
            data.auditoria
          )
            ? data.auditoria
            : []
        );


        /* ---------------------------------------------------
           MAESTROS
        --------------------------------------------------- */

        const [
          depRes,
          secRes,
          carRes,
          rolesRes,
        ] = await Promise.all([
          getMaestros(
            "departamentos"
          ),

          getMaestros(
            "secciones"
          ),

          getMaestros(
            "cargos"
          ),

          axios.get(
            `${API_BASE}/seguridad/roles`
          ),
        ]);

        setDepartamentos(
          Array.isArray(
            depRes.data
          )
            ? depRes.data
            : []
        );

        setSecciones(
          Array.isArray(
            secRes.data
          )
            ? secRes.data
            : []
        );

        setCargos(
          Array.isArray(
            carRes.data
          )
            ? carRes.data
            : []
        );

        setRoles(
          Array.isArray(
            rolesRes.data
          )
            ? rolesRes.data
            : []
        );

      } catch (err) {
        console.error(
          "Error cargando ficha de empleado:",
          err
        );

        setError(
          err?.response?.data?.detail ||
          err?.message ||
          "No se ha podido cargar la ficha del empleado."
        );

      } finally {
        setLoading(false);
      }
    },
    [
      open,
      idNum,
      idValido,
    ]
  );


  useEffect(() => {
    cargarFicha();
  }, [
    cargarFicha,
  ]);


  /* =======================================================
     CAMBIOS EMPLEADO
  ======================================================= */

  const handleEmpleadoChange = (
    campo,
    valor
  ) => {
    setEmpleado(
      (actual) => ({
        ...actual,
        [campo]: valor,
      })
    );
  };


  /* =======================================================
     GUARDAR EMPLEADO
  ======================================================= */

  const guardarEmpleado = async () => {
    if (!empleado?.id) {
      return;
    }

    try {
      await editarEmpleado(
        empleado.id,
        empleado
      );

      await cargarFicha();

      mostrarToast(
        "ok",
        "Datos del empleado guardados"
      );

    } catch (err) {
      console.error(err);

      mostrarToast(
        "error",
        err?.response?.data?.detail ||
        "No se han podido guardar los datos"
      );
    }
  };


  /* =======================================================
     FOTO
  ======================================================= */

  const handleFoto = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (
      !file ||
      !empleado?.id
    ) {
      return;
    }

    try {
      await subirFotoEmpleado(
        empleado.id,
        file
      );

      await cargarFicha();

      mostrarToast(
        "ok",
        "Foto actualizada"
      );

    } catch (err) {
      console.error(err);

      mostrarToast(
        "error",
        err?.response?.data?.detail ||
        "No se ha podido actualizar la foto"
      );
    }
  };


  /* =======================================================
     MÓDULOS
  ======================================================= */

  const guardarModulos = async () => {
    if (!empleado?.id) {
      return;
    }

    try {
      await actualizarModulosVisibles(
        empleado.id,
        modulos
      );

      mostrarToast(
        "ok",
        "Módulos visibles guardados"
      );

    } catch (err) {
      console.error(err);

      mostrarToast(
        "error",
        err?.response?.data?.detail ||
        "No se han podido guardar los módulos"
      );
    }
  };


  /* =======================================================
     PERMISOS
  ======================================================= */

  const guardarPermisos = async () => {
    if (!empleado?.id) {
      return;
    }

    try {
      await actualizarPermisosModulo(
        empleado.id,
        permisos
      );

      mostrarToast(
        "ok",
        "Permisos guardados"
      );

    } catch (err) {
      console.error(err);

      mostrarToast(
        "error",
        err?.response?.data?.detail ||
        "No se han podido guardar los permisos"
      );
    }
  };


  /* =======================================================
     ROL
  ======================================================= */

  const guardarRol = async () => {
    if (
      !empleado?.id ||
      !empleado?.rol_id
    ) {
      mostrarToast(
        "error",
        "Selecciona un rol antes de guardar"
      );

      return;
    }

    try {
      await axios.post(
        `${API_BASE}/seguridad/asignar/empleado/${empleado.id}/rol/${empleado.rol_id}`
      );

      await cargarFicha();

      mostrarToast(
        "ok",
        "Rol actualizado"
      );

    } catch (err) {
      console.error(err);

      mostrarToast(
        "error",
        err?.response?.data?.detail ||
        "No se ha podido actualizar el rol"
      );
    }
  };


  /* =======================================================
     BLOQUEAR
  ======================================================= */

  const bloquearEmpleado = async () => {
    if (!empleado?.id) {
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/seguridad/asignar/empleado/${empleado.id}/bloquear`
      );

      await cargarFicha();

      mostrarToast(
        "ok",
        "Empleado bloqueado"
      );

    } catch (err) {
      console.error(err);

      mostrarToast(
        "error",
        err?.response?.data?.detail ||
        "No se ha podido bloquear el empleado"
      );
    }
  };


  /* =======================================================
     DESBLOQUEAR
  ======================================================= */

  const desbloquearEmpleado =
    async () => {
      if (!empleado?.id) {
        return;
      }

      try {
        await axios.post(
          `${API_BASE}/seguridad/asignar/empleado/${empleado.id}/desbloquear`
        );

        await cargarFicha();

        mostrarToast(
          "ok",
          "Empleado desbloqueado"
        );

      } catch (err) {
        console.error(err);

        mostrarToast(
          "error",
          err?.response?.data?.detail ||
          "No se ha podido desbloquear el empleado"
        );
      }
    };


  /* =======================================================
     RESET PASSWORD
  ======================================================= */

  const resetPassword =
    async () => {
      if (!empleado?.id) {
        return;
      }

      try {
        const res =
          await resetPasswordEmpleado(
            empleado.id
          );

        const temporal =
          res.data?.password_temporal;

        mostrarToast(
          "ok",
          temporal
            ? `Contraseña temporal: ${temporal}`
            : "Contraseña reseteada"
        );

      } catch (err) {
        console.error(err);

        mostrarToast(
          "error",
          err?.response?.data?.detail ||
          "No se ha podido resetear la contraseña"
        );
      }
    };


  /* =======================================================
     NO MOSTRAR
  ======================================================= */

  if (
    !open ||
    !idValido
  ) {
    return null;
  }


  /* =======================================================
     OVERLAY
  ======================================================= */

  const handleOverlay =
    (event) => {
      if (
        event.target ===
        event.currentTarget
      ) {
        if (onOverlayClick) {
          onOverlayClick(event);
        } else {
          onClose?.();
        }
      }
    };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        fixed
        inset-0
        z-[60]
        bg-black/50
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
      onClick={handleOverlay}
    >

      {/* ===================================================
          MODAL
      =================================================== */}

      <div
        className="
          w-full
          max-w-[1250px]
          max-h-[94vh]
          overflow-hidden
          rounded-2xl
          border
          border-[var(--erp-border)]
          bg-[var(--erp-surface)]
          text-[var(--erp-text)]
          shadow-2xl
          flex
          flex-col
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ================================================
            CABECERA
        ================================================= */}

        <div
          className="
            shrink-0
            px-6
            py-5
            border-b
            border-[var(--erp-border)]
            bg-[var(--erp-surface-soft)]
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-5
            "
          >

            {/* IDENTIDAD */}

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  h-14
                  w-14
                  shrink-0
                  rounded-2xl
                  overflow-hidden
                  border
                  border-[var(--erp-border)]
                  bg-[var(--erp-primary-soft)]
                  flex
                  items-center
                  justify-center
                  text-[var(--erp-primary)]
                  font-bold
                  text-lg
                "
              >

                {empleado?.foto ? (
                  <img
                    src={empleado.foto}
                    alt={
                      empleado?.nombre ||
                      "Empleado"
                    }
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />
                ) : (
                  (
                    empleado?.nombre?.[0] ||
                    "E"
                  ).toUpperCase()
                )}

              </div>


              <div>

                <div
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-[var(--erp-text-soft)]
                    mb-1
                  "
                >
                  Ficha de empleado
                </div>

                <h2
                  className="
                    text-xl
                    lg:text-2xl
                    font-semibold
                    text-[var(--erp-text)]
                  "
                >
                  {empleado?.nombre ||
                    "Empleado"}{" "}
                  {empleado?.apellidos ||
                    ""}
                </h2>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    mt-1
                  "
                >

                  {empleado?.usuario && (
                    <span
                      className="
                        text-sm
                        text-[var(--erp-text-soft)]
                      "
                    >
                      @{empleado.usuario}
                    </span>
                  )}

                  <span
                    className="
                      text-[var(--erp-text-soft)]
                    "
                  >
                    ·
                  </span>

                  <span
                    className="
                      text-sm
                      text-[var(--erp-text-soft)]
                    "
                  >
                    ID #{empleado?.id}
                  </span>

                  <span
                    className={`
                      inline-flex
                      items-center
                      px-2.5
                      py-1
                      rounded-lg
                      text-xs
                      font-semibold
                      ${
                        empleado?.activo
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }
                    `}
                  >
                    {empleado?.activo
                      ? "Activo"
                      : "Bloqueado"}
                  </span>

                </div>

              </div>

            </div>


            {/* ACCIONES */}

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <button
                type="button"
                onClick={onClose}
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  border-[var(--erp-border)]
                  bg-[var(--erp-surface)]
                  text-[var(--erp-text)]
                  text-sm
                  font-medium
                  hover:bg-[var(--erp-primary-soft)]
                  transition
                "
              >
                Cerrar
              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            TABS
        ================================================== */}

        <div
          className="
            shrink-0
            px-5
            lg:px-6
            py-2
            border-b
            border-[var(--erp-border)]
            bg-[var(--erp-surface)]
            overflow-x-auto
          "
        >

          <div
            className="
              flex
              items-center
              gap-1
              min-w-max
            "
          >

            {TABS.map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setTab(key)
                  }
                  className={`
                    relative
                    px-4
                    py-3
                    rounded-lg
                    text-sm
                    font-medium
                    transition
                    ${
                      tab === key
                        ? `
                          bg-[var(--erp-primary-soft)]
                          text-[var(--erp-primary)]
                        `
                        : `
                          text-[var(--erp-text-soft)]
                          hover:text-[var(--erp-text)]
                          hover:bg-[var(--erp-surface-soft)]
                        `
                    }
                  `}
                >
                  {label}

                  {tab === key && (
                    <span
                      className="
                        absolute
                        left-3
                        right-3
                        bottom-0
                        h-0.5
                        rounded-full
                        bg-[var(--erp-primary)]
                      "
                    />
                  )}

                </button>
              )
            )}

          </div>

        </div>


        {/* =================================================
            CONTENIDO
        ================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-5
            lg:px-6
            py-6
            bg-[var(--erp-background)]
          "
        >

          {/* LOADING */}

          {loading && (
            <div
              className="
                min-h-[350px]
                flex
                flex-col
                items-center
                justify-center
                text-[var(--erp-text-soft)]
              "
            >

              <div
                className="
                  h-9
                  w-9
                  rounded-full
                  border-2
                  border-[var(--erp-border)]
                  border-t-[var(--erp-primary)]
                  animate-spin
                  mb-4
                "
              />

              <span
                className="
                  text-sm
                "
              >
                Cargando ficha del empleado…
              </span>

            </div>
          )}


          {/* ERROR */}

          {error && !loading && (
            <div
              className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-4
                text-sm
                text-red-700
              "
            >
              {error}
            </div>
          )}


          {/* =================================================
              DATOS BÁSICOS
          ================================================== */}

          {!loading &&
            !error &&
            tab === "basicos" && (

              <section className="erp-card p-6">

                <SectionHeader
                  title="Datos básicos"
                  description="Información principal y datos de contacto corporativos."
                />

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-5
                  "
                >

                  <Campo label="Estado">
                    <SelectSJ
                      value={
                        empleado.activo
                          ? 1
                          : 0
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "activo",
                          Number(value) === 1
                        )
                      }
                      options={[
                        {
                          value: 1,
                          label: "Activo",
                        },
                        {
                          value: 0,
                          label: "Baja / bloqueado",
                        },
                      ]}
                    />
                  </Campo>


                  <Campo label="Nombre">
                    <Input
                      value={
                        empleado.nombre
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "nombre",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Apellidos">
                    <Input
                      value={
                        empleado.apellidos
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "apellidos",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="DNI">
                    <Input
                      value={
                        empleado.dni
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "dni",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Teléfono">
                    <Input
                      value={
                        empleado.telefono
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "telefono",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Email empresa">
                    <Input
                      value={
                        empleado.email_empresa
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "email_empresa",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Extensión">
                    <Input
                      value={
                        empleado.extension
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "extension",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Usuario">
                    <Input
                      value={
                        empleado.usuario
                      }
                      readOnly
                    />
                  </Campo>

                </div>


                <Guardar
                  onClick={
                    guardarEmpleado
                  }
                />

              </section>
            )}


          {/* =================================================
              DATOS PERSONALES
          ================================================== */}

          {!loading &&
            !error &&
            tab === "personales" && (

              <section className="erp-card p-6">

                <SectionHeader
                  title="Datos personales"
                  description="Información personal, contacto de emergencia y fotografía."
                />


                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-5
                  "
                >

                  <Campo label="Dirección">
                    <Input
                      value={
                        empleado.direccion
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "direccion",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Código postal">
                    <Input
                      value={
                        empleado.codigo_postal
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "codigo_postal",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Población">
                    <Input
                      value={
                        empleado.poblacion
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "poblacion",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Provincia">
                    <Input
                      value={
                        empleado.provincia
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "provincia",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Fecha nacimiento">
                    <Input
                      type="date"
                      value={
                        empleado.fecha_nacimiento
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "fecha_nacimiento",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Alergias">
                    <Input
                      value={
                        empleado.alergias
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "alergias",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Persona de contacto">
                    <Input
                      value={
                        empleado.persona_contacto
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "persona_contacto",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Teléfono de contacto">
                    <Input
                      value={
                        empleado.telefono_contacto
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "telefono_contacto",
                          value
                        )
                      }
                    />
                  </Campo>


                  <Campo label="Fotografía">

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          h-12
                          w-12
                          rounded-xl
                          overflow-hidden
                          shrink-0
                          border
                          border-[var(--erp-border)]
                          bg-[var(--erp-surface-soft)]
                          flex
                          items-center
                          justify-center
                          text-[var(--erp-text-soft)]
                        "
                      >

                        {empleado?.foto ? (
                          <img
                            src={empleado.foto}
                            alt="Foto empleado"
                            className="
                              w-full
                              h-full
                              object-cover
                            "
                          />
                        ) : (
                          "—"
                        )}

                      </div>


                      <label
                        className="
                          inline-flex
                          items-center
                          justify-center
                          px-3
                          py-2
                          rounded-xl
                          border
                          border-[var(--erp-border)]
                          bg-[var(--erp-surface)]
                          text-sm
                          font-medium
                          cursor-pointer
                          hover:bg-[var(--erp-primary-soft)]
                          transition
                        "
                      >
                        Cambiar foto

                        <input
                          type="file"
                          accept="
                            image/jpeg,
                            image/png,
                            image/webp
                          "
                          onChange={
                            handleFoto
                          }
                          className="hidden"
                        />

                      </label>

                    </div>

                  </Campo>

                </div>


                <div className="mt-5">

                  <Campo label="Observaciones">

                    <textarea
                      rows={5}
                      value={
                        empleado.observaciones ||
                        ""
                      }
                      onChange={(event) =>
                        handleEmpleadoChange(
                          "observaciones",
                          event.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--erp-border)]
                        bg-[var(--erp-surface)]
                        text-[var(--erp-text)]
                        px-3
                        py-2.5
                        outline-none
                        resize-y
                        focus:border-[var(--erp-primary)]
                      "
                    />

                  </Campo>

                </div>


                <Guardar
                  onClick={
                    guardarEmpleado
                  }
                />

              </section>
            )}


          {/* =================================================
              DATOS LABORALES
          ================================================== */}

          {!loading &&
            !error &&
            tab === "laborales" && (

              <section className="erp-card p-6">

                <SectionHeader
                  title="Datos laborales"
                  description="Organización, puesto y fechas laborales del empleado."
                />


                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                  "
                >

                  <Campo label="Departamento">

                    <SelectSJ
                      value={
                        empleado.departamento_id ||
                        ""
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "departamento_id",
                          value
                            ? Number(value)
                            : null
                        )
                      }
                      options={[
                        {
                          value: "",
                          label:
                            "Sin departamento",
                        },
                        ...departamentos.map(
                          (item) => ({
                            value: item.id,
                            label:
                              item.nombre,
                          })
                        ),
                      ]}
                    />

                  </Campo>


                  <Campo label="Sección">

                    <SelectSJ
                      value={
                        empleado.seccion_id ||
                        ""
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "seccion_id",
                          value
                            ? Number(value)
                            : null
                        )
                      }
                      options={[
                        {
                          value: "",
                          label:
                            "Sin sección",
                        },
                        ...secciones.map(
                          (item) => ({
                            value: item.id,
                            label:
                              item.nombre,
                          })
                        ),
                      ]}
                    />

                  </Campo>


                  <Campo label="Cargo">

                    <SelectSJ
                      value={
                        empleado.cargo_id ||
                        ""
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "cargo_id",
                          value
                            ? Number(value)
                            : null
                        )
                      }
                      options={[
                        {
                          value: "",
                          label:
                            "Sin cargo",
                        },
                        ...cargos.map(
                          (item) => ({
                            value: item.id,
                            label:
                              item.nombre,
                          })
                        ),
                      ]}
                    />

                  </Campo>


                  <Campo label="Fecha alta">

                    <Input
                      type="date"
                      value={
                        empleado.fecha_alta
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "fecha_alta",
                          value
                        )
                      }
                    />

                  </Campo>


                  <Campo label="Fecha baja">

                    <Input
                      type="date"
                      value={
                        empleado.fecha_baja
                      }
                      onChange={(value) =>
                        handleEmpleadoChange(
                          "fecha_baja",
                          value
                        )
                      }
                    />

                  </Campo>

                </div>


                <Guardar
                  onClick={
                    guardarEmpleado
                  }
                />

              </section>
            )}


          {/* =================================================
              SEGURIDAD
          ================================================== */}

          {!loading &&
            !error &&
            tab === "seguridad" && (

              <section
                className="
                  space-y-5
                "
              >

                {/* -----------------------------------------
                    CUENTA
                ----------------------------------------- */}

                <section className="erp-card p-6">

                  <SectionHeader
                    title="Seguridad y acceso"
                    description="Estado de la cuenta, contraseña y operaciones de seguridad."
                  />


                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-5
                    "
                  >

                    <Campo label="Usuario">

                      <Input
                        value={
                          empleado.usuario
                        }
                        readOnly
                      />

                    </Campo>


                    <Campo label="Contraseña">

                      <Input
                        value="••••••••••••"
                        readOnly
                      />

                    </Campo>

                  </div>


                  <div
                    className="
                      mt-5
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >

                    <span
                      className="
                        text-sm
                        text-[var(--erp-text-soft)]
                      "
                    >
                      Estado de acceso
                    </span>


                    <span
                      className={`
                        inline-flex
                        items-center
                        px-3
                        py-1.5
                        rounded-lg
                        text-sm
                        font-semibold
                        ${
                          empleado.activo
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }
                      `}
                    >
                      {empleado.activo
                        ? "Activo"
                        : "Bloqueado"}
                    </span>

                  </div>


                  <div
                    className="
                      flex
                      flex-wrap
                      gap-3
                      mt-5
                    "
                  >

                    {empleado.activo ? (

                      <button
                        type="button"
                        onClick={
                          bloquearEmpleado
                        }
                        className="
                          px-4
                          py-2.5
                          rounded-xl
                          bg-red-600
                          hover:bg-red-700
                          text-white
                          text-sm
                          font-medium
                          transition
                        "
                      >
                        Bloquear empleado
                      </button>

                    ) : (

                      <button
                        type="button"
                        onClick={
                          desbloquearEmpleado
                        }
                        className="
                          px-4
                          py-2.5
                          rounded-xl
                          bg-green-600
                          hover:bg-green-700
                          text-white
                          text-sm
                          font-medium
                          transition
                        "
                      >
                        Desbloquear empleado
                      </button>

                    )}


                    <button
                      type="button"
                      onClick={
                        resetPassword
                      }
                      className="
                        px-4
                        py-2.5
                        rounded-xl
                        bg-orange-500
                        hover:bg-orange-600
                        text-white
                        text-sm
                        font-medium
                        transition
                      "
                    >
                      Reset contraseña
                    </button>

                  </div>

                </section>


                {/* -----------------------------------------
                    ROL
                ----------------------------------------- */}

                <section className="erp-card p-6">

                  <SectionHeader
                    title="Rol del empleado"
                    description="Define el rol de seguridad asignado a esta cuenta."
                  />


                  <div
                    className="
                      max-w-xl
                    "
                  >

                    <Campo label="Rol">

                      <SelectSJ
                        value={
                          empleado?.rol_id ||
                          ""
                        }
                        onChange={(value) => {

                          const id =
                            Number(value);

                          const rol =
                            roles.find(
                              (item) =>
                                item.id === id
                            ) || null;

                          handleEmpleadoChange(
                            "rol",
                            rol
                          );

                          handleEmpleadoChange(
                            "rol_id",
                            rol?.id ||
                            null
                          );

                        }}
                        options={[
                          {
                            value: "",
                            label:
                              "Sin rol",
                          },
                          ...roles.map(
                            (rol) => ({
                              value: rol.id,
                              label:
                                rol.nombre,
                            })
                          ),
                        ]}
                      />

                    </Campo>


                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        mt-4
                      "
                    >

                      <button
                        type="button"
                        onClick={
                          guardarRol
                        }
                        className="
                          px-4
                          py-2.5
                          rounded-xl
                          bg-[var(--erp-primary)]
                          hover:bg-[var(--erp-primary-dark)]
                          text-white
                          text-sm
                          font-medium
                          transition
                        "
                      >
                        Guardar rol
                      </button>

                      <span
                        className="
                          text-sm
                          text-[var(--erp-text-soft)]
                        "
                      >
                        Actual:{" "}
                        <strong
                          className="
                            text-[var(--erp-text)]
                          "
                        >
                          {empleado?.rol?.nombre ||
                            "Sin rol"}
                        </strong>
                      </span>

                    </div>

                  </div>

                </section>


                {/* -----------------------------------------
                    MÓDULOS Y PERMISOS
                ----------------------------------------- */}

                <section className="erp-card p-6">

                  <div
                    className="
                      flex
                      flex-col
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                      gap-4
                      mb-5
                    "
                  >

                    <div>

                      <h3
                        className="
                          text-lg
                          font-semibold
                        "
                      >
                        Permisos de acceso
                      </h3>

                      <p
                        className="
                          text-sm
                          text-[var(--erp-text-soft)]
                          mt-1
                        "
                      >
                        Configura módulos visibles y permisos específicos.
                      </p>

                    </div>


                    <div
                      className="
                        flex
                        gap-1
                        rounded-xl
                        bg-[var(--erp-surface-soft)]
                        p-1
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setSeguridadTab(
                            "modulos"
                          )
                        }
                        className={`
                          px-4
                          py-2
                          rounded-lg
                          text-sm
                          font-medium
                          transition
                          ${
                            seguridadTab ===
                            "modulos"
                              ? "bg-[var(--erp-surface)] text-[var(--erp-primary)] shadow-sm"
                              : "text-[var(--erp-text-soft)] hover:text-[var(--erp-text)]"
                          }
                        `}
                      >
                        Módulos
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          setSeguridadTab(
                            "permisos"
                          )
                        }
                        className={`
                          px-4
                          py-2
                          rounded-lg
                          text-sm
                          font-medium
                          transition
                          ${
                            seguridadTab ===
                            "permisos"
                              ? "bg-[var(--erp-surface)] text-[var(--erp-primary)] shadow-sm"
                              : "text-[var(--erp-text-soft)] hover:text-[var(--erp-text)]"
                          }
                        `}
                      >
                        Permisos
                      </button>

                    </div>

                  </div>


                  {/* ---------------------------------------
                      MÓDULOS
                  --------------------------------------- */}

                  {seguridadTab ===
                    "modulos" && (

                    <div>

                      <div
                        className="
                          grid
                          grid-cols-1
                          md:grid-cols-2
                          xl:grid-cols-3
                          gap-2
                        "
                      >

                        {MODULOS_SJ2026.map(
                          (modulo) => {

                            const activo =
                              modulos.includes(
                                modulo
                              );

                            return (
                              <label
                                key={modulo}
                                className={`
                                  flex
                                  items-center
                                  gap-3
                                  rounded-xl
                                  border
                                  px-3
                                  py-3
                                  cursor-pointer
                                  transition
                                  ${
                                    activo
                                      ? "border-[var(--erp-primary)] bg-[var(--erp-primary-soft)]"
                                      : "border-[var(--erp-border)] bg-[var(--erp-surface)] hover:bg-[var(--erp-surface-soft)]"
                                  }
                                `}
                              >

                                <input
                                  type="checkbox"
                                  checked={activo}
                                  onChange={(event) => {

                                    if (
                                      event.target.checked
                                    ) {
                                      setModulos(
                                        (actual) =>
                                          actual.includes(
                                            modulo
                                          )
                                            ? actual
                                            : [
                                                ...actual,
                                                modulo,
                                              ]
                                      );
                                    } else {
                                      setModulos(
                                        (actual) =>
                                          actual.filter(
                                            (item) =>
                                              item !==
                                              modulo
                                          )
                                      );
                                    }

                                  }}
                                  className="
                                    h-4
                                    w-4
                                    accent-[var(--erp-primary)]
                                  "
                                />

                                <span
                                  className="
                                    text-sm
                                    font-medium
                                  "
                                >
                                  {modulo}
                                </span>

                              </label>
                            );
                          }
                        )}

                      </div>


                      <div
                        className="
                          flex
                          flex-wrap
                          gap-3
                          mt-5
                        "
                      >

                        <button
                          type="button"
                          onClick={
                            guardarModulos
                          }
                          className="
                            px-4
                            py-2.5
                            rounded-xl
                            bg-[var(--erp-primary)]
                            hover:bg-[var(--erp-primary-dark)]
                            text-white
                            text-sm
                            font-medium
                            transition
                          "
                        >
                          Guardar módulos
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            setModulos([])
                          }
                          className="
                            px-4
                            py-2.5
                            rounded-xl
                            border
                            border-[var(--erp-border)]
                            bg-[var(--erp-surface)]
                            text-[var(--erp-text)]
                            text-sm
                            font-medium
                            hover:bg-[var(--erp-surface-soft)]
                            transition
                          "
                        >
                          Limpiar selección
                        </button>

                      </div>

                    </div>
                  )}


                  {/* ---------------------------------------
                      PERMISOS
                  --------------------------------------- */}

                  {seguridadTab ===
                    "permisos" && (

                    <div>

                      {Object.keys(
                        permisos
                      ).length === 0 ? (

                        <div
                          className="
                            py-12
                            text-center
                            text-sm
                            text-[var(--erp-text-soft)]
                          "
                        >
                          No hay permisos configurados.
                        </div>

                      ) : (

                        <div
                          className="
                            grid
                            grid-cols-1
                            xl:grid-cols-2
                            gap-4
                          "
                        >

                          {Object.keys(
                            permisos
                          ).map(
                            (modulo) => {

                              const actual =
                                permisos[
                                  modulo
                                ] || [];

                              return (
                                <div
                                  key={modulo}
                                  className="
                                    rounded-xl
                                    border
                                    border-[var(--erp-border)]
                                    bg-[var(--erp-surface)]
                                    p-4
                                  "
                                >

                                  <div
                                    className="
                                      flex
                                      items-center
                                      justify-between
                                      gap-3
                                      mb-4
                                    "
                                  >

                                    <span
                                      className="
                                        font-semibold
                                        text-[var(--erp-text)]
                                      "
                                    >
                                      {modulo}
                                    </span>

                                    <span
                                      className="
                                        text-xs
                                        text-[var(--erp-text-soft)]
                                      "
                                    >
                                      {actual.length} permisos
                                    </span>

                                  </div>


                                  <div
                                    className="
                                      grid
                                      grid-cols-2
                                      md:grid-cols-4
                                      gap-2
                                    "
                                  >

                                    {PERMISOS_SJ2026.map(
                                      (permiso) => {

                                        const checked =
                                          actual.includes(
                                            permiso
                                          );

                                        return (
                                          <label
                                            key={permiso}
                                            className={`
                                              flex
                                              items-center
                                              gap-2
                                              rounded-lg
                                              border
                                              px-3
                                              py-2
                                              cursor-pointer
                                              text-sm
                                              transition
                                              ${
                                                checked
                                                  ? "border-[var(--erp-primary)] bg-[var(--erp-primary-soft)]"
                                                  : "border-[var(--erp-border)]"
                                              }
                                            `}
                                          >

                                            <input
                                              type="checkbox"
                                              checked={checked}
                                              onChange={(event) => {

                                                const nuevo =
                                                  event.target.checked
                                                    ? [
                                                        ...actual,
                                                        permiso,
                                                      ]
                                                    : actual.filter(
                                                        (
                                                          item
                                                        ) =>
                                                          item !==
                                                          permiso
                                                      );

                                                setPermisos(
                                                  (
                                                    anterior
                                                  ) => ({
                                                    ...anterior,
                                                    [modulo]:
                                                      nuevo,
                                                  })
                                                );

                                              }}
                                              className="
                                                h-4
                                                w-4
                                                accent-[var(--erp-primary)]
                                              "
                                            />

                                            {permiso}

                                          </label>
                                        );
                                      }
                                    )}

                                  </div>

                                </div>
                              );
                            }
                          )}

                        </div>

                      )}


                      <div className="mt-5">

                        <button
                          type="button"
                          onClick={
                            guardarPermisos
                          }
                          className="
                            px-4
                            py-2.5
                            rounded-xl
                            bg-[var(--erp-primary)]
                            hover:bg-[var(--erp-primary-dark)]
                            text-white
                            text-sm
                            font-medium
                            transition
                          "
                        >
                          Guardar permisos
                        </button>

                      </div>

                    </div>
                  )}

                </section>

              </section>
            )}


          {/* =================================================
              AUDITORÍA
          ================================================== */}

          {!loading &&
            !error &&
            tab === "auditoria" && (

              <section className="erp-card p-6">

                <SectionHeader
                  title="Auditoría del empleado"
                  description="Histórico de acciones registradas para esta cuenta."
                />


                {auditoria.length === 0 ? (

                  <div
                    className="
                      py-14
                      text-center
                      text-sm
                      text-[var(--erp-text-soft)]
                    "
                  >
                    No hay registros de auditoría.
                  </div>

                ) : (

                  <div
                    className="
                      overflow-x-auto
                      rounded-xl
                      border
                      border-[var(--erp-border)]
                    "
                  >

                    <table
                      className="
                        w-full
                        text-sm
                      "
                    >

                      <thead>

                        <tr
                          className="
                            bg-[var(--erp-primary-soft)]
                            text-[var(--erp-text)]
                            text-left
                          "
                        >

                          <th className="px-4 py-3 font-semibold">
                            Fecha
                          </th>

                          <th className="px-4 py-3 font-semibold">
                            Módulo
                          </th>

                          <th className="px-4 py-3 font-semibold">
                            Acción
                          </th>

                          <th className="px-4 py-3 font-semibold">
                            Descripción
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {auditoria.map(
                          (registro) => (

                            <tr
                              key={
                                registro.id
                              }
                              className="
                                border-t
                                border-[var(--erp-border)]
                                hover:bg-[var(--erp-surface-soft)]
                                transition
                              "
                            >

                              <td
                                className="
                                  px-4
                                  py-3
                                  whitespace-nowrap
                                  text-[var(--erp-text-soft)]
                                "
                              >
                                {registro.fecha
                                  ? new Date(
                                      registro.fecha
                                    ).toLocaleString(
                                      "es-ES"
                                    )
                                  : "—"}
                              </td>


                              <td className="px-4 py-3">

                                <span
                                  className="
                                    inline-flex
                                    px-2.5
                                    py-1
                                    rounded-lg
                                    bg-[var(--erp-surface-soft)]
                                    text-xs
                                    font-medium
                                  "
                                >
                                  {registro.modulo ||
                                    "—"}
                                </span>

                              </td>


                              <td className="px-4 py-3">

                                <span
                                  className="
                                    inline-flex
                                    px-2.5
                                    py-1
                                    rounded-lg
                                    bg-[var(--erp-primary-soft)]
                                    text-[var(--erp-primary)]
                                    text-xs
                                    font-semibold
                                  "
                                >
                                  {registro.accion ||
                                    "—"}
                                </span>

                              </td>


                              <td
                                className="
                                  px-4
                                  py-3
                                  text-[var(--erp-text)]
                                "
                              >
                                {registro.descripcion ||
                                  "—"}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </section>
            )}

        </div>

      </div>


      {/* ===================================================
          TOAST
      =================================================== */}

      {toast && (

        <div
          className={`
            fixed
            top-5
            right-5
            z-[100]
            max-w-sm
            px-4
            py-3
            rounded-xl
            shadow-xl
            border
            text-sm
            font-medium
            ${
              toast.tipo === "ok"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }
          `}
        >
          {toast.mensaje}
        </div>

      )}

    </div>
  );
}


/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  description,
}) {
  return (
    <div className="mb-6">

      <h3
        className="
          text-lg
          font-semibold
          text-[var(--erp-text)]
        "
      >
        {title}
      </h3>

      {description && (
        <p
          className="
            mt-1
            text-sm
            text-[var(--erp-text-soft)]
          "
        >
          {description}
        </p>
      )}

    </div>
  );
}


/* =========================================================
   CAMPO
========================================================= */

function Campo({
  label,
  children,
}) {
  return (
    <div>

      <label
        className="
          block
          text-sm
          font-medium
          text-[var(--erp-text)]
          mb-1.5
        "
      >
        {label}
      </label>

      {children}

    </div>
  );
}


/* =========================================================
   INPUT
========================================================= */

function Input({
  value,
  onChange,
  type = "text",
  readOnly = false,
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      readOnly={readOnly}
      onChange={(event) =>
        onChange?.(
          event.target.value
        )
      }
      className={`
        w-full
        rounded-xl
        border
        border-[var(--erp-border)]
        bg-[var(--erp-surface)]
        text-[var(--erp-text)]
        px-3
        py-2.5
        outline-none
        transition
        ${
          readOnly
            ? `
              bg-[var(--erp-surface-soft)]
              cursor-not-allowed
            `
            : `
              focus:border-[var(--erp-primary)]
              focus:ring-2
              focus:ring-[var(--erp-primary)]/10
            `
        }
      `}
    />
  );
}


/* =========================================================
   BOTÓN GUARDAR
========================================================= */

function Guardar({
  onClick,
}) {
  return (
    <div
      className="
        flex
        justify-end
        mt-6
        pt-5
        border-t
        border-[var(--erp-border)]
      "
    >

      <button
        type="button"
        onClick={onClick}
        className="
          px-5
          py-2.5
          rounded-xl
          bg-[var(--erp-primary)]
          hover:bg-[var(--erp-primary-dark)]
          text-white
          text-sm
          font-semibold
          transition
          shadow-sm
        "
      >
        Guardar cambios
      </button>

    </div>
  );
}
