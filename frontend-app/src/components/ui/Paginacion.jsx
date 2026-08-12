export default function Paginacion({ page, pages, onChange }) {
  return (
    <div className="flex items-center gap-4 mt-4">

      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Anterior
      </button>

      <span className="text-sm text-[#1F3A5F] font-semibold">
        Página {page} de {pages}
      </span>

      <button
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Siguiente
      </button>

    </div>
  );
}
