export default function EmpleadoPerfilModal({ id, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[800px] max-h-[90vh] overflow-auto">
        
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <EmpleadoFicha id={id} />
      </div>
    </div>
  );
}
