import React, { useState } from "react";

// Pestañas
import DatosPersonales from "./tabs/DatosPersonales";
import DatosLaborales from "./tabs/DatosLaborales";
import RolEmpleado from "./tabs/RolEmpleado";
import PermisosEmpleado from "./tabs/PermisosEmpleado";
import ModulosEmpleado from "./tabs/ModulosEmpleado";
import FotoEmpleado from "./tabs/FotoEmpleado";
import AuditoriaEmpleado from "./tabs/AuditoriaEmpleado";

export default function EmpleadoCrearCompleto() {
  const [tab, setTab] = useState("personales");

  // Estado global del empleado
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email: "",
    direccion: "",
    fecha_nacimiento: "",
    observaciones: "",

    // Datos laborales
    departamento: "",
    seccion: "",
    cargo: "",
    fecha_alta: "",
    fecha_baja: "",
    tipo_contrato: "",
    jornada: "",
    horario: "",

    // Rol
    rol: "",

    // Permisos
    permisos: [],

    // Módulos visibles
    modulos: [],

    // Foto
    fotoFile: null,
  });

  // Enviar JSON + foto juntos (multipart)
  const handleSubmit = async () => {
    const formDataMultipart = new FormData();

    // JSON completo
    formDataMultipart.append("data", JSON.stringify(formData));

    // Foto (si existe)
    if (formData.fotoFile) {
      formDataMultipart.append("foto", formData.fotoFile);
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/empleados/crear-completo`,
      {
        method: "POST",
        body: formDataMultipart,
      }
    );

    const data = await res.json();

    if (data.status === "ok") {
      alert("Empleado creado correctamente");
    } else {
      alert("Error creando empleado");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      {/* Navegación por pestañas */}
      <div className="flex flex-wrap gap-3 border-b pb-3 mb-4">

        <button
          onClick={() => setTab("personales")}
          className={`px-3 py-2 rounded ${
            tab === "personales" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Datos personales
        </button>

        <button
          onClick={() => setTab("laborales")}
          className={`px-3 py-2 rounded ${
            tab === "laborales" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Datos laborales
        </button>

        <button
          onClick={() => setTab("rol")}
          className={`px-3 py-2 rounded ${
            tab === "rol" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Rol
        </button>

        <button
          onClick={() => setTab("permisos")}
          className={`px-3 py-2 rounded ${
            tab === "permisos" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Permisos
        </button>

        <button
          onClick={() => setTab("modulos")}
          className={`px-3 py-2 rounded ${
            tab === "modulos" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Módulos visibles
        </button>

        <button
          onClick={() => setTab("foto")}
          className={`px-3 py-2 rounded ${
            tab === "foto" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Foto
        </button>

        <button
          onClick={() => setTab("auditoria")}
          className={`px-3 py-2 rounded ${
            tab === "auditoria" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Auditoría
        </button>

      </div>

      {/* Contenido de pestañas */}
      {tab === "personales" && (
        <DatosPersonales formData={formData} setFormData={setFormData} />
      )}

      {tab === "laborales" && (
        <DatosLaborales formData={formData} setFormData={setFormData} />
      )}

      {tab === "rol" && (
        <RolEmpleado formData={formData} setFormData={setFormData} />
      )}

      {tab === "permisos" && (
        <PermisosEmpleado formData={formData} setFormData={setFormData} />
      )}

      {tab === "modulos" && (
        <ModulosEmpleado formData={formData} setFormData={setFormData} />
      )}

      {tab === "foto" && (
        <FotoEmpleado formData={formData} setFormData={setFormData} />
      )}

      {tab === "auditoria" && (
        <AuditoriaEmpleado formData={formData} />
      )}

      {/* Botón final */}
      <button
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Crear empleado
      </button>
    </div>
  );
}
