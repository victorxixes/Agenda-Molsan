import { useEffect } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";

const getFotoURL = (foto) => {
  if (!foto || foto === "string" || foto.trim() === "") {
    return "/placeholder.png";
  }
  if (foto.startsWith("http")) return foto;
  return `${import.meta.env.VITE_API_URL}${foto}`;
};

export default function DatosPersonales({ empleadoId }) {
  const { empleadoActual, cargarEmpleado } = useEmpleadosStore();

  useEffect(() => {
    cargarEmpleado(empleadoId);
  }, [empleadoId]);

  if (!empleadoActual) return <div className="p-6">Cargando datos...</div>;

  const e = empleadoActual;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Datos personales</h2>

      {/* FOTO */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={getFotoURL(e.foto)}
          alt="Foto empleado"
          className="w-20 h-20 rounded-full object-cover border"
        />

        <div>
          <p className="text-lg font-semibold">
            {e.nombre} {e.apellidos}
          </p>
          <p className="text-sm text-neutral-600">{e.usuario}</p>
          <p className="text-sm text-neutral-600">
            Rol: {e.rol_nombre || "Sin rol"}
          </p>
        </div>
      </div>

      {/* DATOS PERSONALES */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="font-semibold">Nombre</label>
          <p>{e.nombre}</p>
        </div>

        <div>
          <label className="font-semibold">Apellidos</label>
          <p>{e.apellidos}</p>
        </div>

        <div>
          <label className="font-semibold">DNI</label>
          <p>{e.dni || "—"}</p>
        </div>

        <div>
          <label className="font-semibold">Teléfono</label>
          <p>{e.telefono || "—"}</p>
        </div>

        <div>
          <label className="font-semibold">Email personal</label>
          <p>{e.email_personal || "—"}</p>
        </div>

        <div>
          <label className="font-semibold">Dirección</label>
          <p>{e.direccion || "—"}</p>
        </div>

        <div>
          <label className="font-semibold">Fecha nacimiento</label>
          <p>{e.fecha_nacimiento || "—"}</p>
        </div>

        <div>
          <label className="font-semibold">Alergias</label>
          <p>{e.alergias || "—"}</p>
        </div>

        <div>
          <label className="font-semibold">Persona contacto</label>
          <p>{e.persona_contacto || "—"}</p>
        </div>

        <div>
          <label className="font-semibold">Teléfono contacto</label>
          <p>{e.telefono_contacto || "—"}</p>
        </div>

        <div className="col-span-2">
          <label className="font-semibold">Observaciones</label>
          <p>{e.observaciones || "—"}</p>
        </div>
      </div>
    </div>
  );
}
