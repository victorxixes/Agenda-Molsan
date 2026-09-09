<section className="border p-4 rounded bg-white shadow-sm">
  <h3 className="text-lg font-semibold mb-3">Datos básicos</h3>

  <div className="grid grid-cols-2 gap-2 text-sm">
    <div>
      <strong>Nombre:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.nombre || ""}
        onChange={(e) => handleEmpleadoChange("nombre", e.target.value)}
      />
    </div>

    <div>
      <strong>Teléfono:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.telefono || ""}
        onChange={(e) => handleEmpleadoChange("telefono", e.target.value)}
      />
    </div>

    <div>
      <strong>Email empresa:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.email_empresa || ""}
        onChange={(e) => handleEmpleadoChange("email_empresa", e.target.value)}
      />
    </div>

    <div>
      <strong>Extensión:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.extension || ""}
        onChange={(e) => handleEmpleadoChange("extension", e.target.value)}
      />
    </div>

    <div>
      <label className="inline-flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={empleado.activo ?? true}
          onChange={(e) => handleEmpleadoChange("activo", e.target.checked)}
        />
        Activo
      </label>
    </div>
  </div>
</section>
<section className="border p-4 rounded bg-white shadow-sm">
  <h3 className="text-lg font-semibold mb-3">Datos personales</h3>

  <div className="grid grid-cols-2 gap-2 text-sm">

    <div>
      <strong>Apellidos:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.apellidos || ""}
        onChange={(e) => handleEmpleadoChange("apellidos", e.target.value)}
      />
    </div>

    <div>
      <strong>DNI:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.dni || ""}
        onChange={(e) => handleEmpleadoChange("dni", e.target.value)}
      />
    </div>

    <div>
      <strong>Email personal:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.email_personal || ""}
        onChange={(e) => handleEmpleadoChange("email_personal", e.target.value)}
      />
    </div>

    <div>
      <strong>Dirección:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.direccion || ""}
        onChange={(e) => handleEmpleadoChange("direccion", e.target.value)}
      />
    </div>

    <div>
      <strong>Código postal:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.codigo_postal || ""}
        onChange={(e) => handleEmpleadoChange("codigo_postal", e.target.value)}
      />
    </div>

    <div>
      <strong>Población:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.poblacion || ""}
        onChange={(e) => handleEmpleadoChange("poblacion", e.target.value)}
      />
    </div>

    <div>
      <strong>Provincia:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.provincia || ""}
        onChange={(e) => handleEmpleadoChange("provincia", e.target.value)}
      />
    </div>

    <div>
      <strong>Fecha nacimiento:</strong>
      <input
        type="date"
        className="border p-1 rounded w-full"
        value={empleado.fecha_nacimiento || ""}
        onChange={(e) =>
          handleEmpleadoChange("fecha_nacimiento", e.target.value)
        }
      />
    </div>

    <div>
      <strong>Alergias:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.alergias || ""}
        onChange={(e) => handleEmpleadoChange("alergias", e.target.value)}
      />
    </div>

    <div>
      <strong>Persona contacto:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.persona_contacto || ""}
        onChange={(e) =>
          handleEmpleadoChange("persona_contacto", e.target.value)
        }
      />
    </div>

    <div>
      <strong>Teléfono contacto:</strong>
      <input
        className="border p-1 rounded w-full"
        value={empleado.telefono_contacto || ""}
        onChange={(e) =>
          handleEmpleadoChange("telefono_contacto", e.target.value)
        }
      />
    </div>

    <div className="col-span-2">
      <strong>Observaciones:</strong>
      <textarea
        className="border p-1 rounded w-full text-xs"
        rows={3}
        value={empleado.observaciones || ""}
        onChange={(e) =>
          handleEmpleadoChange("observaciones", e.target.value)
        }
      />
    </div>
  </div>

  <div className="mt-4 flex items-center gap-4">
    {empleado.foto && (
      <img
        src={`${API_BASE}${empleado.foto}`}
        alt="Foto empleado"
        className="w-24 h-24 rounded object-cover border"
      />
    )}
    <label className="text-sm">
      Subir nueva foto:
      <input type="file" className="block mt-1" onChange={handleFoto} />
    </label>
  </div>
</section>
<section className="border p-4 rounded bg-white shadow-sm">
  <h3 className="text-lg font-semibold mb-3">Datos laborales</h3>

  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
    <div><strong>Departamento actual:</strong> {data?.departamento?.nombre || "Sin departamento"}</div>
    <div><strong>Sección actual:</strong> {data?.seccion?.nombre || "Sin sección"}</div>
    <div><strong>Cargo actual:</strong> {data?.cargo?.nombre || "Sin cargo"}</div>
  </div>

  <div className="grid grid-cols-3 gap-2 text-sm">
    <div>
      <label className="block mb-1">Departamento</label>
      <select
        className="border p-2 rounded w-full"
        value={empleado.departamento_id || ""}
        onChange={(e) =>
          handleEmpleadoChange("departamento_id", Number(e.target.value))
        }
      >
        <option value="">Sin departamento</option>
        {departamentos.map((d) => (
          <option key={d.id} value={d.id}>{d.nombre}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block mb-1">Sección</label>
      <select
        className="border p-2 rounded w-full"
        value={empleado.seccion_id || ""}
        onChange={(e) =>
          handleEmpleadoChange("seccion_id", Number(e.target.value))
        }
      >
        <option value="">Sin sección</option>
        {secciones.map((s) => (
          <option key={s.id} value={s.id}>{s.nombre}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block mb-1">Cargo</label>
      <select
        className="border p-2 rounded w-full"
        value={empleado.cargo_id || ""}
        onChange={(e) =>
          handleEmpleadoChange("cargo_id", Number(e.target.value))
        }
      >
        <option value="">Sin cargo</option>
        {cargos.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-2 text-sm mt-4">
    <div><strong>Fecha alta:</strong> {empleado.fecha_alta || "-"}</div>
    <div><strong>Fecha baja:</strong> {empleado.fecha_baja || "-"}</div>
  </div>

  <button
    className="mt-3 px-3 py-1 bg-green-600 text-white rounded text-sm"
    onClick={guardarEmpleado}
  >
    Guardar datos laborales
  </button>
</section>
{/* ============================
    SEGURIDAD INTERNA
============================ */}
<section className="border p-4 rounded bg-white shadow-sm">
  <h3 className="text-lg font-semibold mb-3">Seguridad interna</h3>

  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
    <div>
      <strong>Usuario:</strong>
      <input
        className="border p-1 rounded w-full bg-gray-100"
        value={empleado.usuario || ""}
        readOnly
      />
    </div>

    <div>
      <strong>Password:</strong>
      <input
        className="border p-1 rounded w-full bg-gray-100"
        value="********"
        readOnly
      />
    </div>

    <div>
      <strong>Rol asignado:</strong>
      <input
        className="border p-1 rounded w-full bg-gray-100"
        value={empleado.rol?.nombre || "Sin rol"}
        readOnly
      />
    </div>
  </div>

  {/* Módulos visibles */}
  <div className="mt-4">
    <h4 className="font-semibold mb-2">Módulos visibles</h4>
    <textarea
      className="w-full border rounded p-2 text-xs"
      rows={4}
      value={JSON.stringify(modulos, null, 2)}
      onChange={(e) => {
        try {
          setModulos(JSON.parse(e.target.value));
        } catch {
          // ignorar errores de parseo
        }
      }}
    />
    <button
      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
      onClick={guardarModulos}
    >
      Guardar módulos visibles
    </button>
  </div>

  {/* Permisos por módulo */}
  <div className="mt-6">
    <h4 className="font-semibold mb-2">Permisos por módulo</h4>
    <textarea
      className="w-full border rounded p-2 text-xs"
      rows={6}
      value={JSON.stringify(permisos, null, 2)}
      onChange={(e) => {
        try {
          setPermisos(JSON.parse(e.target.value));
        } catch {
          // ignorar errores
        }
      }}
    />
    <button
      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
      onClick={guardarPermisos}
    >
      Guardar permisos
    </button>
  </div>
</section>
