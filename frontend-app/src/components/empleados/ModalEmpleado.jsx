import axios from "axios";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  API_BASE,
} from "../../api/config";

import {
  obtenerFichaCompleta,
  actualizarModulosVisibles,
  actualizarPermisosModulo,
  subirFotoEmpleado,
  editarEmpleado,
  resetPasswordEmpleado,
} from "../../api/empleados";

import {
  getMaestros,
} from "../../api/maestros";

import SelectSJ from "../ui/SelectSJ";


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


export default function ModalEmpleado({
  open,
  onClose,
}) {

  const empleadoId =
    arguments[0]?.empleadoId;


  const onOverlayClick =
    arguments[0]?.onOverlayClick;


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


  const mostrarToast = useCallback(
    (tipo, mensaje) => {

      setToast({
        tipo,
        mensaje,
      });

      setTimeout(
        () => setToast(null),
        3000
      );

    },
    []
  );


  const cargarFicha = useCallback(
    async () => {

      if (
        !open ||
        !empleadoId
      ) {
        return;
      }

      setLoading(true);
      setError("");

      try {

        const res =
          await obtenerFichaCompleta(
            empleadoId
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
          depRes.data || []
        );

        setSecciones(
          secRes.data || []
        );

        setCargos(
          carRes.data || []
        );

        setRoles(
          rolesRes.data || []
        );

      } catch (err) {

        console.error(
          "Error cargando ficha:",
          err
        );

        setError(
          err?.response?.data?.detail ||
          err?.message ||
          "No se ha podido cargar la ficha."
        );

      } finally {

        setLoading(false);
      }

    },
    [
      open,
      empleadoId,
    ]
  );


  useEffect(() => {

    cargarFicha();

  }, [
    cargarFicha,
  ]);


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
        "No se han podido guardar los datos"
      );
    }
  };


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
        "No se ha podido actualizar la foto"
      );
    }
  };


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
        "No se han podido guardar los módulos"
      );
    }
  };


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
        "No se han podido guardar los permisos"
      );
    }
  };


  const guardarRol = async () => {

    if (
      !empleado?.id ||
      !empleado?.rol?.id
    ) {
      return;
    }

    try {

      await axios.post(
        `${API_BASE}/seguridad/asignar/empleado/${empleado.id}/rol/${empleado.rol.id}`
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
        "No se ha podido actualizar el rol"
      );
    }
  };


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
        "No se ha podido bloquear el empleado"
      );
    }
  };


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
          "No se ha podido desbloquear el empleado"
        );
      }
    };


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

        mostrarToast(
          "ok",
          res.data?.password_temporal
            ? `Contraseña temporal: ${res.data.password_temporal}`
            : "Contraseña reseteada"
        );

      } catch (err) {

        console.error(err);

        mostrarToast(
          "error",
          "No se ha podido resetear la contraseña"
        );
      }
    };


  if (!open) {
    return null;
  }


  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/40
        flex
        items-center
        justify-center
        p-4
      "
      onClick={
        onOverlayClick
      }
    >

      {/* =================================================
          MODAL PRINCIPAL
      ================================================= */}

      <div
        className="
          bg-[var(--erp-surface)]
          border
          border-[var(--erp-border)]
          rounded-2xl
          shadow-2xl
          w-full
          max-w-[1200px]
          max-h-[92vh]
          overflow-hidden
          text-[var(--erp-text)]
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="
          flex
          items-center
          justify-between
          gap-4
          px-6
          py-4
          border-b
          border-[var(--erp-border)]
          bg-[var(--erp-surface-soft)]
        ">

          <div>

            <div className="
              text-xs
              text-[var(--erp-text-soft)]
              mb-1
            ">
              Gestión de empleados
            </div>

            <h2 className="
              text-xl
              font-semibold
              text-[var(--erp-text)]
            ">
              {empleado?.nombre || "Empleado"}{" "}
              {empleado?.apellidos || ""}
            </h2>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="
              px-4
              py-2
              rounded-xl
              bg-white
              border
              border-[var(--erp-border)]
              text-[var(--erp-text)]
              hover:bg-[var(--erp-surface-soft)]
              transition
            "
          >
            Cerrar
          </button>

        </div>


        {/* ===============================================
            TABS
        =============================================== */}

        <div className="
          px-6
          py-3
          border-b
          border-[var(--erp-border)]
          bg-[var(--erp-surface)]
          overflow-x-auto
        ">

          <div className="
            flex
            gap-2
            min-w-max
          ">

            {[
              ["basicos", "Datos básicos"],
              ["personales", "Datos personales"],
              ["laborales", "Datos laborales"],
              ["seguridad", "Seguridad"],
              ["auditoria", "Auditoría"],
            ].map(
              ([key, label]) => (

                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setTab(key)
                  }
                  className={`
                    px-4
                    py-2
                    rounded-xl
                    text-sm
                    transition
                    ${
                      tab === key
                        ? "bg-[var(--erp-primary)] text-white"
                        : "bg-[var(--erp-surface-soft)] text-[var(--erp-text)] hover:bg-[var(--erp-primary-soft)]"
                    }
                  `}
                >
                  {label}
                </button>

              )
            )}

          </div>

        </div>


        {/* ===============================================
            CONTENIDO
        =============================================== */}

        <div className="
          px-6
          py-5
          overflow-y-auto
          max-h-[calc(92vh-130px)]
        ">

          {loading && (

            <div className="
              py-16
              text-center
              text-[var(--erp-text-soft)]
              animate-pulse
            ">
              Cargando ficha…
            </div>

          )}


          {error && !loading && (

            <div className="
              rounded-xl
              border
              border-red-200
              bg-red-50
              text-red-700
              px-4
              py-3
              mb-5
            ">
              {error}
            </div>

          )}


          {!loading &&
            !error &&
            tab === "basicos" && (

              <section className="
                erp-card
                p-5
              ">

                <h3 className="
                  text-lg
                  font-semibold
                  mb-5
                ">
                  Datos básicos
                </h3>


                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  lg:grid-cols-3
                  gap-4
                ">

                  <Campo
                    label="Estado"
                  >
                    <SelectSJ
                      value={
                        empleado.estado ??
                        (empleado.activo
                          ? 1
                          : 0)
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
                          label: "Baja",
                        },
                      ]}
                    />
                  </Campo>


                  <Campo
                    label="Nombre"
                  >
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


                  <Campo
                    label="Apellidos"
                  >
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


                  <Campo
                    label="DNI"
                  >
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


                  <Campo
                    label="Teléfono"
                  >
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


                  <Campo
                    label="Email empresa"
                  >
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


                  <Campo
                    label="Extensión"
                  >
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

                </div>


                <Guardar
                  onClick={
                    guardarEmpleado
                  }
                />

              </section>

            )}


          {!loading &&
            !error &&
            tab === "personales" && (

              <section className="
                erp-card
                p-5
              ">

                <h3 className="
                  text-lg
                  font-semibold
                  mb-5
                ">
                  Datos personales
                </h3>


                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  lg:grid-cols-3
                  gap-4
                ">

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


                  <Campo label="Persona contacto">
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


                  <Campo label="Teléfono contacto">
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


                  <Campo label="Foto">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleFoto
                      }
                      className="
                        block
                        w-full
                        text-sm
                        text-[var(--erp-text)]
                        file:mr-3
                        file:px-3
                        file:py-2
                        file:rounded-lg
                        file:border-0
                        file:bg-[var(--erp-primary-soft)]
                        file:text-[var(--erp-primary)]
                        hover:file:bg-[var(--erp-primary)]
                        hover:file:text-white
                      "
                    />
                  </Campo>

                </div>


                <div className="mt-4">

                  <Campo label="Observaciones">

                    <textarea
                      rows={4}
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
                        focus:border-[var(--erp-primary)]
                        resize-y
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


          {!loading &&
            !error &&
            tab === "laborales" && (

              <section className="
                erp-card
                p-5
              ">

                <h3 className="
                  text-lg
                  font-semibold
                  mb-5
                ">
                  Datos laborales
                </h3>


                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                ">

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
                            label: item.nombre,
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
                            label: item.nombre,
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
                            label: item.nombre,
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


          {!loading &&
            !error &&
            tab === "seguridad" && (

              <section className="
                space-y-5
              ">

                <div className="
                  erp-card
                  p-5
                ">

                  <h3 className="
                    text-lg
                    font-semibold
                    mb-5
                  ">
                    Seguridad interna
                  </h3>


                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  ">

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
                        value="********"
                        readOnly
                      />

                    </Campo>

                  </div>


                  <div className="
                    mt-5
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  ">

                    <span className="
                      text-sm
                      text-[var(--erp-text-soft)]
                    ">
                      Estado:
                    </span>

                    <span
                      className={`
                        px-3
                        py-1.5
                        rounded-lg
                        text-sm
                        font-medium
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


                  <div className="
                    flex
                    flex-wrap
                    gap-3
                    mt-5
                  ">

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
                        transition
                      "
                    >
                      Reset contraseña
                    </button>

                  </div>

                </div>


                {/* ROL */}

                <div className="
                  erp-card
                  p-5
                ">

                  <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-3
                    mb-4
                  ">

                    <h4 className="
                      font-semibold
                    ">
                      Rol del empleado
                    </h4>

                    <span className="
                      text-sm
                      text-[var(--erp-text-soft)]
                    ">
                      Actual:{" "}
                      <strong className="
                        text-[var(--erp-text)]
                      ">
                        {empleado?.rol?.nombre ||
                          "Sin rol"}
                      </strong>
                    </span>

                  </div>


                  <SelectSJ
                    value={
                      empleado?.rol?.id ||
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
                        rol?.id || null
                      );

                    }}
                    options={[
                      {
                        value: "",
                        label: "Sin rol",
                      },

                      ...roles.map(
                        (rol) => ({
                          value: rol.id,
                          label: rol.nombre,
                        })
                      ),
                    ]}
                  />


                  <div className="
                    flex
                    gap-3
                    mt-4
                  ">

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
                        transition
                      "
                    >
                      Guardar rol
                    </button>

                  </div>

                </div>


                {/* SEGURIDAD */}

                <div className="
                  erp-card
                  p-5
                ">

                  <div className="
                    flex
                    gap-2
                    mb-5
                  ">

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
                        rounded-xl
                        text-sm
                        ${
                          seguridadTab ===
                          "modulos"
                            ? "bg-[var(--erp-primary)] text-white"
                            : "bg-[var(--erp-surface-soft)] text-[var(--erp-text)]"
                        }
                      `}
                    >
                      Módulos visibles
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
                        rounded-xl
                        text-sm
                        ${
                          seguridadTab ===
                          "permisos"
                            ? "bg-[var(--erp-primary)] text-white"
                            : "bg-[var(--erp-surface-soft)] text-[var(--erp-text)]"
                        }
                      `}
                    >
                      Permisos por módulo
                    </button>

                  </div>


                  {seguridadTab ===
                    "modulos" && (

                    <div>

                      <h4 className="
                        font-semibold
                        mb-4
                      ">
                        Selecciona los módulos visibles
                      </h4>

                      <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-3
                        gap-2
                      ">

                        {MODULOS_SJ2026.map(
                          (modulo) => (

                            <label
                              key={modulo}
                              className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                px-3
                                py-2
                                cursor-pointer
                                hover:bg-[var(--erp-primary-soft)]
                              "
                            >

                              <input
                                type="checkbox"
                                checked={
                                  modulos.includes(
                                    modulo
                                  )
                                }
                                onChange={(
                                  event
                                ) => {

                                  if (
                                    event.target
                                      .checked
                                  ) {

                                    setModulos(
                                      (actual) => [
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
                                  accent-[var(--erp-primary)]
                                "
                              />

                              <span>
                                {modulo}
                              </span>

                            </label>

                          )
                        )}

                      </div>


                      <div className="
                        flex
                        flex-wrap
                        gap-3
                        mt-5
                      ">

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
                            bg-white
                            border
                            border-[var(--erp-border)]
                            text-[var(--erp-text)]
                            hover:bg-[var(--erp-surface-soft)]
                          "
                        >
                          Limpiar
                        </button>

                      </div>

                    </div>

                  )}


                  {seguridadTab ===
                    "permisos" && (

                    <div>

                      <h4 className="
                        font-semibold
                        mb-4
                      ">
                        Permisos por módulo
                      </h4>


                      {Object.keys(
                        permisos
                      ).length === 0 ? (

                        <p className="
                          text-sm
                          text-[var(--erp-text-soft)]
                        ">
                          No hay permisos configurados.
                        </p>

                      ) : (

                        <div className="
                          space-y-4
                        ">

                          {Object.keys(
                            permisos
                          ).map(
                            (modulo) => (

                              <div
                                key={modulo}
                                className="
                                  rounded-xl
                                  border
                                  border-[var(--erp-border)]
                                  p-4
                                "
                              >

                                <div className="
                                  font-semibold
                                  mb-3
                                ">
                                  {modulo}
                                </div>


                                <div className="
                                  grid
                                  grid-cols-2
                                  md:grid-cols-4
                                  gap-2
                                ">

                                  {PERMISOS_SJ2026.map(
                                    (permiso) => {

                                      const actual =
                                        permisos[
                                          modulo
                                        ] || [];

                                      return (
                                        <label
                                          key={permiso}
                                          className="
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                          "
                                        >

                                          <input
                                            type="checkbox"
                                            checked={actual.includes(
                                              permiso
                                            )}
                                            onChange={(
                                              event
                                            ) => {

                                              const nuevo =
                                                event
                                                  .target
                                                  .checked
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

                            )
                          )}

                        </div>

                      )}


                      <div className="
                        mt-5
                      ">

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
                          "
                        >
                          Guardar permisos
                        </button>

                      </div>

                    </div>

                  )}

                </div>

              </section>

            )}


          {!loading &&
            !error &&
            tab === "auditoria" && (

              <section className="
                erp-card
                p-5
              ">

                <h3 className="
                  text-lg
                  font-semibold
                  mb-5
                ">
                  Auditoría del empleado
                </h3>


                {auditoria.length === 0 ? (

                  <div className="
                    py-10
                    text-center
                    text-[var(--erp-text-soft)]
                  ">
                    No hay registros de auditoría.
                  </div>

                ) : (

                  <div className="
                    overflow-auto
                    rounded-xl
                    border
                    border-[var(--erp-border)]
                  ">

                    <table className="
                      w-full
                      text-sm
                    ">

                      <thead>

                        <tr className="
                          bg-[var(--erp-primary)]
                          text-white
                          text-left
                        ">

                          <th className="px-4 py-3">
                            Fecha
                          </th>

                          <th className="px-4 py-3">
                            Módulo
                          </th>

                          <th className="px-4 py-3">
                            Acción
                          </th>

                          <th className="px-4 py-3">
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
                                hover:bg-[var(--erp-primary-soft)]
                              "
                            >

                              <td className="
                                px-4
                                py-3
                                whitespace-nowrap
                              ">
                                {registro.fecha
                                  ? new Date(
                                      registro.fecha
                                    ).toLocaleString(
                                      "es-ES"
                                    )
                                  : "—"}
                              </td>

                              <td className="
                                px-4
                                py-3
                              ">
                                {
                                  registro.modulo ||
                                  "—"
                                }
                              </td>

                              <td className="
                                px-4
                                py-3
                              ">
                                {
                                  registro.accion ||
                                  "—"
                                }
                              </td>

                              <td className="
                                px-4
                                py-3
                              ">
                                {
                                  registro.descripcion ||
                                  "—"
                                }
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


      {/* TOAST */}

      {toast && (

        <div className={`
          fixed
          top-5
          right-5
          z-[70]
          px-4
          py-3
          rounded-xl
          shadow-xl
          border
          ${
            toast.tipo === "ok"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }
        `}>
          {toast.mensaje}
        </div>

      )}

    </div>
  );
}


/* =========================================================
   COMPONENTES AUXILIARES
========================================================= */

function Campo({
  label,
  children,
}) {

  return (
    <div>

      <label className="
        block
        text-sm
        font-medium
        text-[var(--erp-text)]
        mb-1.5
      ">
        {label}
      </label>

      {children}

    </div>
  );
}


function Input({
  value,
  onChange,
  type = "text",
  readOnly = false,
}) {

  return (
    <input
      type={type}
      value={value || ""}
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
        ${
          readOnly
            ? "bg-[var(--erp-surface-soft)] cursor-not-allowed"
            : "focus:border-[var(--erp-primary)]"
        }
      `}
    />
  );
}


function Guardar({
  onClick,
}) {

  return (
    <div className="
      flex
      justify-end
      mt-6
    ">

      <button
        type="button"
        onClick={onClick}
        className="
          px-4
          py-2.5
          rounded-xl
          bg-[var(--erp-primary)]
          hover:bg-[var(--erp-primary-dark)]
          text-white
          transition
        "
      >
        Guardar cambios
      </button>

    </div>
  );
}
