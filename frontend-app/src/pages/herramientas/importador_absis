import { useState } from "react";
import axios from "axios";

export default function ImportadorAbsis() {
    const [fecha, setFecha] = useState("");
    const [file, setFile] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const importar = async (modo) => {
        setError(null);
        setResultado(null);

        if (!file) {
            setError("Debes seleccionar un archivo Excel.");
            return;
        }

        if (modo === "fecha" && !fecha) {
            setError("Debes seleccionar una fecha para importar.");
            return;
        }

        setCargando(true);

        try {
            const formData = new FormData();
            formData.append("fichero", file);

            const url =
                modo === "hoy"
                    ? "/utilidades/importador-absis/expedientes"
                    : `/utilidades/importador-absis/expedientes?fecha=${fecha}`;

            const res = await axios.post(url, formData);
            setResultado(res.data);

        } catch (err) {
            setError("Error al importar el archivo. Revisa el formato o el servidor.");
        }

        setCargando(false);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Importador ABSIS</h1>

            {/* Selección de fecha */}
            <div className="mb-4">
                <label className="block mb-2 font-semibold">Seleccionar fecha</label>
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>

            {/* Archivo Excel */}
            <div className="mb-4">
                <label className="block mb-2 font-semibold">Archivo Excel</label>
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border p-2 rounded"
                />
            </div>

            {/* Botones */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => importar("hoy")}
                    disabled={cargando}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {cargando ? "Importando..." : "Importar expedientes del día"}
                </button>

                <button
                    onClick={() => importar("fecha")}
                    disabled={cargando}
                    className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {cargando ? "Importando..." : "Importar expedientes de la fecha seleccionada"}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Resultado */}
            {resultado && (
                <div className="bg-gray-100 p-4 rounded">
                    <p><strong>Fecha importada:</strong> {resultado.fecha_importada}</p>
                    <p><strong>Expedientes creados:</strong> {resultado.expedientes_creados}</p>
                    <p><strong>Expedientes actualizados:</strong> {resultado.expedientes_actualizados}</p>
                    <p><strong>Total filtrados:</strong> {resultado.total_filtrados}</p>
                </div>
            )}
        </div>
    );
}
