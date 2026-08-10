export default function DocumentosTable({ documentos, onEdit, onDelete }) {
  return (
    <table className="glass-table w-full">
      <thead>
        <tr>
          <th>Título</th>
          <th>Concepto</th>
          <th>Fecha</th>
          <th>Archivo</th>
          <th className="text-right">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {documentos.map(doc => (
          <tr key={doc.id}>
            <td>{doc.titulo}</td>
            <td>{doc.concepto}</td>
            <td>{new Date(doc.fecha_publicacion).toLocaleString()}</td>

            <td>
              <a
                href={doc.fichero}
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                Descargar
              </a>
            </td>

            <td className="text-right">
              <button
                className="btn-edit mr-2"
                onClick={() => onEdit(doc)}
              >
                ✏️
              </button>

              <button
                className="btn-delete"
                onClick={() => onDelete(doc.id)}
              >
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
