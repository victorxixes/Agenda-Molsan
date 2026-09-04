import { useIntranet } from "../../hooks/useIntranet";

export default function DocumentosTable() {
  const { documentos, eliminarDocumento } = useIntranet();

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th>ID</th>
          <th>Título</th>
          <th>Concepto</th>
          <th>Fecha</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {documentos.map((d) => (
          <tr key={d.id} className="border-b">
            <td>{d.id}</td>
            <td>{d.titulo}</td>
            <td>{d.concepto}</td>
            <td>{new Date(d.fecha_publicacion).toLocaleString()}</td>
            <td>
              <button
                className="text-red-600"
                onClick={() => eliminarDocumento(d.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
