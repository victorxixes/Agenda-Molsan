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
  editarEmpleado,
  subirFotoEmpleado,
} from "../../api/empleados";


export default function EmpleadoPerfil({
  id,
}) {

  const idNum =
    Number(id);

  const idValido =
    Number.isFinite(idNum) &&
    idNum > 0;


  const [
    data,
    setData,
  ] = useState(null);

  const [
    empleadoEdit,
    setEmpleadoEdit,
  ] = useState({});

  const [
    fotoPreview,
    setFotoPreview,
  ] = useState(null);

  const [
    tab,
    setTab,
  ] = useState("basicos");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    mensaje,
    setMensaje,
  ] = useState("");


  /* ==========================================================
     CARGAR PERFIL
  ========================================================== */

  const cargar =
    useCallback(
      async () => {

        if (!idValido) {
          return;
        }

        setLoading(
          true
        );

        setError("");

        try {

          const res =
            await obtenerFichaCompleta(
              idNum
            );

          const d =
            res?.data || {};

          setData(
            d
          );

          setEmpleadoEdit(
            d.empleado || {}
          );

        } catch (err) {

          console.error(
            "Error cargando perfil:",
            err
          );

          setError(
            err?.response?.data?.detail ||
            err?.message ||
            "No se ha podido cargar el perfil."
          );

        } finally {

          setLoading(
            false
          );
        }

      },
      [idNum, idValido]
    );


  /* ==========================================================
     EFFECT
  ========================================================== */

  useEffect(() => {

    cargar();

  }, [cargar]);


  /* ==========================================================
     CAMBIO
  ========================================================== */

  const handleChange =
    useCallback(
      (
        field,
        value
      ) => {

        setEmpleadoEdit(
          (prev) => ({
            ...prev,
            [field]: value,
          })
        );

        setMensaje("");

      },
      []
    );


  /* ==========================================================
     GUARDAR
  ========================================================== */

  const guardarCambios =
    useCallback(
      async () => {

        if (!idValido) {
          return;
        }

        setGuardando(
          true
        );

        setError("");

        setMensaje("");

        try {

          await editarEmpleado(
            idNum,
            empleadoEdit
          );

          const res =
            await obtenerFichaCompleta(
              idNum
            );

          setData(
            res.data
          );

          setEmpleadoEdit(
            res.data?.empleado ||
            {}
          );

          setMensaje(
            "Cambios guardados correctamente."
          );

        } catch (err) {

          console.error(
            err
          );

          setError(
            err?.response?.data?.detail ||
            err?.message ||
            "Error al guardar los cambios."
          );

        } finally {

          setGuardando(
            false
          );
        }

      },
      [
        idNum,
        idValido,
        empleadoEdit,
      ]
    );


  /* ==========================================================
     FOTO
  ========================================================== */

  const handleFoto =
    useCallback(
      async (
        event
      ) => {

        const file =
          event?.target?.files?.[0];

        if (!file || !idValido) {
          return;
        }

        setError("");

        setMensaje("");

        const preview =
          URL.createObjectURL(
            file
          );

        setFotoPreview(
          preview
        );

        try {

          await subirFotoEmpleado(
            idNum,
            file
          );

          const res =
            await obtenerFichaCompleta(
              idNum
            );

          setData(
            res.data
          );

          setEmpleadoEdit(
            res.data?.empleado ||
            {}
          );

          setMensaje(
            "Foto actualizada correctamente."
          );

        } catch (err) {

          console.error(
            err
          );

          setError(
            err?.response?.data?.detail ||
            err?.message ||
            "No se ha podido subir la foto."
          );

        }

      },
      [
        idNum,
        idValido,
      ]
    );


  /* ==========================================================
     ESTADOS INICIALES
  ========================================================== */

  if (!idValido) {

    return (

      <div className="
        erp-page
      ">

        <div className="
          erp-card
          p-8
          text-center
        ">

          <div className="
            text-4xl
            mb-3
          ">
            👤
          </div>

          <div className="
            text-[var(--erp-text)]
            font-semibold
          ">
            Selecciona un empleado válido.
          </div>

        </div>

      </div>

    );
  }


  if (loading && !data) {

    return (

      <div className="
        erp-page
      ">

        <div className="
          erp-card
          p-12
          text-center
          text-[var(--erp-text-soft)]
          animate-pulse
        ">
          Cargando perfil del empleado…
        </div>

      </div>

    );
  }


  if (error && !data) {

    return (

      <div className="
        erp-page
      ">

        <div className="
          erp-card
          p-6
        ">

          <div className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            text-red-700
            px-4
            py-3
          ">
            {error}
          </div>

        </div>

      </div>

    );
  }


  if (!data) {
    return null;
  }


  const empleado =
    empleadoEdit || {};


  const fotoURL =
    empleado.foto
      ? empleado.foto.replace(
          /^\/api\//,
          "/"
        )
      : null;


  return (

    <div className="
      erp-page
      space-y-5
      animate-fade-in
    ">

      {/* =====================================================
          CABECERA
      ===================================================== */}

      <section className="
        erp-card
        p-6
      ">

        <div className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-6
        ">

          <div className="
            flex
            items-center
            gap-5
          ">

            <div className="
              w-20
              h-20
              rounded-2xl
              overflow-hidden
              border
              border-[var(--erp-border)]
              bg-[var(--erp-surface-soft)]
              shrink-0
            ">

              {(fotoPreview ||
                empleado.foto) ? (

                <img
                  src={
                    fotoPreview ||
                    `${API_BASE}${fotoURL}`
                  }
                  alt="Foto empleado"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              ) : (

                <div className="
                  w-full
                  h-full
                  flex
                  items-center
                  justify-center
                  text-2xl
                ">
                  👤
                </div>

              )}

            </div>


            <div>

              <div className="
                text-xs
                uppercase
                tracking-[0.16em]
                font-semibold
                text-[var(--erp-primary)]
              ">
                Perfil de empleado
              </div>

              <h1 className="
                text-2xl
                font-semibold
                text-[var(--erp-text)]
                mt-1
              ">
                {empleado.nombre}{" "}
                {empleado.apellidos}
              </h1>

              <div className="
                flex
                flex-wrap
                gap-2
                mt-2
              ">

                <span className="
                  text-sm
                  text-[var(--erp-text-soft)]
                ">
                  ID #{empleado.id}
                </span>

                <span className="
                  text-sm
                  text-[var(--erp-text-soft)]
                ">
                  ·
                </span>

                <span className="
                  text-sm
                  text-[var(--erp-text-soft)]
                ">
                  {empleado.usuario ||
                    "Sin usuario"}
                </span>

                <span
                  className={`
                    px-2.5
                    py-1
                    rounded-lg
                    text-xs
                    font-semibold
                    border
                    ${
                      empleado.activo
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }
                  `}
                >
                  {empleado.activo
                    ? "Activo"
                    : "Inactivo"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MENSAJES
      ===================================================== */}

      {error && (

        <div className="
          rounded-xl
          border
          border-red-200
          bg-red-50
          text-red-700
          px-4
          py-3
          text-sm
        ">
          {error}
        </div>

      )}


      {mensaje && (

        <div className="
          rounded-xl
          border
          border-emerald-200
          bg-emerald-50
          text-emerald-700
          px-4
          py-3
          text-sm
        ">
          ✓ {mensaje}
        </div>

      )}


      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="
        erp-card
        p-2
      ">

        <div className="
          flex
          flex-wrap
          gap-1
        ">

          {[
            ["basicos", "Datos básicos", "👤"],
            ["personales", "Datos personales", "🏠"],
            ["laborales", "Datos laborales", "💼"],
            ["auditoria", "Auditoría", "🛡️"],
          ].map(
            ([
              key,
              label,
              icon,
            ]) => (

              <button
                type="button"
                key={key}
                onClick={() =>
                  setTab(key)
                }
                className={`
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  text-sm
                  font-medium
                  transition
                  ${
                    tab === key
                      ? "bg-[var(--erp-primary)] text-white shadow-sm"
                      : "text-[var(--erp-text-soft)] hover:bg-[var(--erp-surface-soft)] hover:text-[var(--erp-text)]"
                  }
                `}
              >
                <span>
                  {icon}
                </span>

                {label}

              </button>

            )
          )}

        </div>

      </div>


      {/* =====================================================
          DATOS BÁSICOS
      ===================================================== */}

      {tab === "basicos" && (

        <section className="
          erp-card
          p-6
          space-y-6
        ">

          <SectionTitle>
            Datos básicos
          </SectionTitle>


          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          ">

            <Campo
              label="Nombre"
              value={
                empleado.nombre
              }
              onChange={(value) =>
                handleChange(
                  "nombre",
                  value
                )
              }
            />

            <Campo
              label="Apellidos"
              value={
                empleado.apellidos
              }
              onChange={(value) =>
                handleChange(
                  "apellidos",
                  value
                )
              }
            />

            <Campo
              label="DNI"
              value={
                empleado.dni
              }
              onChange={(value) =>
                handleChange(
                  "dni",
                  value
                )
              }
            />

            <Campo
              label="Teléfono"
              value={
                empleado.telefono
              }
              onChange={(value) =>
                handleChange(
                  "telefono",
                  value
                )
              }
            />

            <Campo
              label="Email personal"
              value={
                empleado.email_personal
              }
              onChange={(value) =>
                handleChange(
                  "email_personal",
                  value
                )
              }
            />

            <Campo
              label="Email empresa"
              value={
                empleado.email_empresa
              }
              onChange={(value) =>
                handleChange(
                  "email_empresa",
                  value
                )
              }
            />

            <Campo
              label="Usuario"
              value={
                empleado.usuario
              }
              onChange={(value) =>
                handleChange(
                  "usuario",
                  value
                )
              }
            />

          </div>


          {/* FOTO */}

          <div className="
            rounded-2xl
            border
            border-[var(--erp-border)]
            bg-[var(--erp-surface-soft)]
            p-5
          ">

            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              gap-5
            ">

              <div className="
                w-24
                h-24
                rounded-2xl
                overflow-hidden
                border
                border-[var(--erp-border)]
                bg-[var(--erp-surface)]
                shrink-0
              ">

                {(fotoPreview ||
                  empleado.foto) ? (

                  <img
                    src={
                      fotoPreview ||
                      `${API_BASE}${fotoURL}`
                    }
                    alt="Foto empleado"
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                ) : (

                  <div className="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                    text-3xl
                  ">
                    👤
                  </div>

                )}

              </div>


              <div>

                <div className="
                  text-sm
                  font-semibold
                  text-[var(--erp-text)]
                ">
                  Fotografía
                </div>

                <div className="
                  text-xs
                  text-[var(--erp-text-soft)]
                  mt-1
                  mb-3
                ">
                  Selecciona una nueva fotografía del empleado.
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleFoto
                  }
                  className="
                    block
                    text-sm
                    text-[var(--erp-text-soft)]
                  "
                />

              </div>

            </div>

          </div>


          <GuardarButton
            onClick={
              guardarCambios
            }
            loading={
              guardando
            }
          />

        </section>

      )}


      {/* =====================================================
          PERSONALES
      ===================================================== */}

      {tab === "personales" && (

        <section className="
          erp-card
          p-6
          space-y-6
        ">

          <SectionTitle>
            Datos personales
          </SectionTitle>


          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          ">

            <Campo
              label="Dirección"
              value={
                empleado.direccion
              }
              onChange={(value) =>
                handleChange(
                  "direccion",
                  value
                )
              }
            />

            <Campo
              label="Código postal"
              value={
                empleado.codigo_postal
              }
              onChange={(value) =>
                handleChange(
                  "codigo_postal",
                  value
                )
              }
            />

            <Campo
              label="Población"
              value={
                empleado.poblacion
              }
              onChange={(value) =>
                handleChange(
                  "poblacion",
                  value
                )
              }
            />

            <Campo
              label="Provincia"
              value={
                empleado.provincia
              }
              onChange={(value) =>
                handleChange(
                  "provincia",
                  value
                )
              }
            />

            <Campo
              label="Fecha nacimiento"
              type="date"
              value={
                empleado.fecha_nacimiento ||
                ""
              }
              onChange={(value) =>
                handleChange(
                  "fecha_nacimiento",
                  value
                )
              }
            />

            <Campo
              label="Alergias"
              value={
                empleado.alergias
              }
              onChange={(value) =>
                handleChange(
                  "alergias",
                  value
                )
              }
            />

            <Campo
              label="Persona de contacto"
              value={
                empleado.persona_contacto
              }
              onChange={(value) =>
                handleChange(
                  "persona_contacto",
                  value
                )
              }
            />

            <Campo
              label="Teléfono contacto"
              value={
                empleado.telefono_contacto
              }
              onChange={(value) =>
                handleChange(
                  "telefono_contacto",
                  value
                )
              }
            />

          </div>


          <div>

            <label className="
              block
              text-xs
              font-semibold
              text-[var(--erp-text-soft)]
              mb-2
            ">
              Observaciones
            </label>

            <textarea
              rows={5}
              value={
                empleado.observaciones ||
                ""
              }
              onChange={(e) =>
                handleChange(
                  "observaciones",
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-[var(--erp-border)]
                bg-[var(--erp-surface)]
                text-[var(--erp-text)]
                px-4
                py-3
                outline-none
                resize-y
                transition
                focus:border-[var(--erp-primary)]
                focus:ring-2
                focus:ring-[var(--erp-primary-soft)]
              "
            />

          </div>


          <GuardarButton
            onClick={
              guardarCambios
            }
            loading={
              guardando
            }
          />

        </section>

      )}


      {/* =====================================================
          LABORALES
      ===================================================== */}

      {tab === "laborales" && (

        <section className="
          erp-card
          p-6
          space-y-6
        ">

          <SectionTitle>
            Datos laborales
          </SectionTitle>


          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          ">

            <Campo
              label="Departamento ID"
              value={
                empleado.departamento_id
              }
              onChange={(value) =>
                handleChange(
                  "departamento_id",
                  value
                )
              }
            />

            <Campo
              label="Sección ID"
              value={
                empleado.seccion_id
              }
              onChange={(value) =>
                handleChange(
                  "seccion_id",
                  value
                )
              }
            />

            <Campo
              label="Cargo ID"
              value={
                empleado.cargo_id
              }
              onChange={(value) =>
                handleChange(
                  "cargo_id",
                  value
                )
              }
            />

            <Campo
              label="Fecha alta"
              type="date"
              value={
                empleado.fecha_alta ||
                ""
              }
              onChange={(value) =>
                handleChange(
                  "fecha_alta",
                  value
                )
              }
            />

            <Campo
              label="Fecha baja"
              type="date"
              value={
                empleado.fecha_baja ||
                ""
              }
              onChange={(value) =>
                handleChange(
                  "fecha_baja",
                  value
                )
              }
            />

          </div>


          <div className="
            rounded-2xl
            border
            border-[var(--erp-border)]
            bg-[var(--erp-surface-soft)]
            p-4
            flex
            items-center
            justify-between
          ">

            <div>

              <div className="
                text-sm
                font-semibold
                text-[var(--erp-text)]
              ">
                Estado
              </div>

              <div className="
                text-xs
                text-[var(--erp-text-soft)]
                mt-1
              ">
                Estado actual del empleado.
              </div>

            </div>


            <span
              className={`
                px-3
                py-1.5
                rounded-lg
                text-xs
                font-semibold
                border
                ${
                  empleado.activo
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }
              `}
            >
              {empleado.activo
                ? "Activo"
                : "Inactivo"}
            </span>

          </div>


          <GuardarButton
            onClick={
              guardarCambios
            }
            loading={
              guardando
            }
          />

        </section>

      )}


      {/* =====================================================
          AUDITORÍA
      ===================================================== */}

      {tab === "auditoria" && (

        <section className="
          erp-card
          p-6
        ">

          <SectionTitle>
            Auditoría
          </SectionTitle>


          <div className="
            space-y-3
          ">

            {(
              Array.isArray(
                data.auditoria
              )
                ? data.auditoria
                : []
            ).map(
              (item, index) => (

                <div
                  key={
                    item.id ||
                    `audit-${index}`
                  }
                  className="
                    rounded-2xl
                    border
                    border-[var(--erp-border)]
                    bg-[var(--erp-surface-soft)]
                    p-5
                  "
                >

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-3
                    text-sm
                  ">

                    <DatoSimple
                      label="Fecha"
                      value={
                        item.fecha
                      }
                    />

                    <DatoSimple
                      label="Módulo"
                      value={
                        item.modulo
                      }
                    />

                    <DatoSimple
                      label="Acción"
                      value={
                        item.accion
                      }
                    />

                    <DatoSimple
                      label="Descripción"
                      value={
                        item.descripcion
                      }
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      )}

    </div>
  );
}


/* ============================================================
   COMPONENTES AUXILIARES
============================================================ */

function SectionTitle({
  children,
}) {

  return (

    <div className="
      flex
      items-center
      gap-3
    ">

      <div className="
        w-2
        h-7
        rounded-full
        bg-[var(--erp-primary)]
      />

      <h2 className="
        text-xl
        font-semibold
        text-[var(--erp-text)]
      ">
        {children}
      </h2>

    </div>
  );
}


function Campo({
  label,
  value,
  onChange,
  type = "text",
}) {

  return (

    <label>

      <span className="
        block
        text-xs
        font-semibold
        text-[var(--erp-text-soft)]
        mb-2
      ">
        {label}
      </span>

      <input
        type={type}
        value={
          value ?? ""
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="
          w-full
          h-11
          rounded-xl
          border
          border-[var(--erp-border)]
          bg-[var(--erp-surface)]
          text-[var(--erp-text)]
          px-4
          outline-none
          transition
          focus:border-[var(--erp-primary)]
          focus:ring-2
          focus:ring-[var(--erp-primary-soft)]
        "
      />

    </label>
  );
}


function Dato({
  label,
  value,
  multiline = false,
}) {

  return (

    <div className="
      rounded-xl
      border
      border-[var(--erp-border)]
      bg-[var(--erp-surface-soft)]
      px-4
      py-3
    ">

      <div className="
        text-[11px]
        uppercase
        tracking-wide
        font-semibold
        text-[var(--erp-text-soft)]
        mb-1
      ">
        {label}
      </div>

      <div
        className={`
          text-sm
          font-medium
          text-[var(--erp-text)]
          ${
            multiline
              ? "whitespace-pre-wrap"
              : ""
          }
        `}
      >
        {value ||
          "—"}
      </div>

    </div>
  );
}


function DatoSimple({
  label,
  value,
}) {

  return (

    <div>

      <div className="
        text-[11px]
        uppercase
        tracking-wide
        font-semibold
        text-[var(--erp-text-soft)]
        mb-1
      ">
        {label}
      </div>

      <div className="
        text-sm
        text-[var(--erp-text)]
      ">
        {value ||
          "—"}
      </div>

    </div>
  );
}


function GuardarButton({
  onClick,
  loading,
}) {

  return (

    <div className="
      flex
      justify-end
      pt-2
    ">

      <button
        type="button"
        disabled={loading}
        onClick={onClick}
        className="
          inline-flex
          items-center
          justify-center
          px-5
          py-2.5
          rounded-xl
          bg-[var(--erp-primary)]
          hover:bg-[var(--erp-primary-dark)]
          disabled:opacity-50
          disabled:cursor-not-allowed
          text-white
          font-medium
          shadow-sm
          transition
        "
      >
        {loading
          ? "Guardando…"
          : "Guardar cambios"}
      </button>

    </div>
  );
}
