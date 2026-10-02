```jsx
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
            console.error("Error importando ABSIS:", err);

            setError(
                err?.response?.data?.error ||
                "Error al importar el archivo. Revisa el formato o el servidor."
            );
        }

        setCargando(false);
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in text-white">

            {/* =====================================================
                CABECERA
            ====================================================== */}

            <div
                className="
                    bg-white/10 backdrop-blur-xl
                    border border-white/20
                    rounded-2xl
                    p-6
                    shadow-xl
                "
            >
                <div className="flex items-start gap-4">

                    <div
                        className="
                            w-12 h-12
                            rounded-xl
                            bg-blue-500/20
                            border border-blue-400/30
                            flex items-center justify-center
                            text-2xl
                            shadow-lg
                        "
                    >
                        📥
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold drop-shadow">
                            Importador ABSIS
                        </h1>

                        <p className="text-white/70 text-sm mt-1">
                            Importa expedientes desde el Excel matriz ABSIS
                            seleccionando el día que deseas procesar.
                        </p>
                    </div>

                </div>
            </div>


            {/* =====================================================
                PANEL PRINCIPAL
            ====================================================== */}

            <div
                className="
                    bg-white/10 backdrop-blur-xl
                    border border-white/20
                    rounded-2xl
                    p-6
                    shadow-xl
                    space-y-6
                "
            >

                {/* =================================================
                    FECHA
                ================================================== */}

                <div>
                    <label
                        className="
                            block
                            text-sm
                            font-semibold
                            text-white/80
                            mb-2
                        "
                    >
                        📅 Fecha de importación
                    </label>

                    <div
                        className="
                            max-w-sm
                            bg-white/5
                            border border-white/10
                            rounded-xl
                            p-3
                        "
                    >
                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            disabled={cargando}
                            className="
                                w-full
                                bg-transparent
                                text-white
                                outline-none
                                cursor-pointer
                            "
                        />
                    </div>

                    <p className="text-xs text-white/50 mt-2">
                        Selecciona una fecha si quieres importar un día
                        concreto del histórico ABSIS.
                    </p>
                </div>


                {/* =================================================
                    ARCHIVO
                ================================================== */}

                <div>
                    <label
                        className="
                            block
                            text-sm
                            font-semibold
                            text-white/80
                            mb-2
                        "
                    >
                        📊 Archivo Excel
                    </label>

                    <label
                        className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            w-full
                            min-h-[150px]
                            rounded-2xl
                            border
                            border-dashed
                            border-white/20
                            bg-white/5
                            hover:bg-white/10
                            transition
                            cursor-pointer
                        "
                    >
                        <div className="text-center pointer-events-none">

                            <div className="text-4xl mb-2">
                                📄
                            </div>

                            {file ? (
                                <>
                                    <div className="font-semibold text-white">
                                        {file.name}
                                    </div>

                                    <div className="text-xs text-white/50 mt-1">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="font-semibold text-white">
                                        Selecciona el Excel ABSIS
                                    </div>

                                    <div className="text-xs text-white/50 mt-1">
                                        Formato permitido: .xlsx
                                    </div>
                                </>
                            )}

                        </div>

                        <input
                            type="file"
                            accept=".xlsx"
                            disabled={cargando}
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                        />
                    </label>
                </div>


                {/* =================================================
                    BOTONES
                ================================================== */}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">

                    <button
                        type="button"
                        onClick={() => importar("hoy")}
                        disabled={cargando || !file}
                        className="
                            flex-1
                            px-5
                            py-3
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            font-semibold
                            shadow-lg
                            transition-all
                            active:scale-[0.97]
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                        "
                    >
                        {cargando ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">
                                    ⟳
                                </span>
                                Importando...
                            </span>
                        ) : (
                            "📥 Importar expedientes del día"
                        )}
                    </button>


                    <button
                        type="button"
                        onClick={() => importar("fecha")}
                        disabled={cargando || !file || !fecha}
                        className="
                            flex-1
                            px-5
                            py-3
                            rounded-xl
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            font-semibold
                            shadow-lg
                            transition-all
                            active:scale-[0.97]
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                        "
                    >
                        {cargando ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">
                                    ⟳
                                </span>
                                Importando...
                            </span>
                        ) : (
                            "📅 Importar fecha seleccionada"
                        )}
                    </button>

                </div>

            </div>


            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (
                <div
                    className="
                        bg-red-500/15
                        backdrop-blur-xl
                        border border-red-400/30
                        rounded-2xl
                        p-5
                        shadow-xl
                        animate-fade-in
                    "
                >
                    <div className="flex items-start gap-3">

                        <div className="text-2xl">
                            ⛔
                        </div>

                        <div>
                            <h3 className="font-semibold text-red-200">
                                Error en la importación
                            </h3>

                            <p className="text-sm text-red-100/80 mt-1">
                                {error}
                            </p>
                        </div>

                    </div>
                </div>
            )}


            {/* =====================================================
                RESULTADO
            ====================================================== */}

            {resultado && (
                <div
                    className="
                        bg-green-500/10
                        backdrop-blur-xl
                        border border-green-400/30
                        rounded-2xl
                        p-6
                        shadow-xl
                        animate-fade-in
                    "
                >

                    <div className="flex items-center gap-3 mb-5">

                        <div
                            className="
                                w-11 h-11
                                rounded-xl
                                bg-green-500/20
                                border border-green-400/30
                                flex items-center justify-center
                                text-xl
                            "
                        >
                            ✓
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Importación completada
                            </h2>

                            <p className="text-sm text-white/60">
                                El proceso ABSIS ha finalizado correctamente.
                            </p>
                        </div>

                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* FECHA */}

                        <div
                            className="
                                bg-white/5
                                border border-white/10
                                rounded-xl
                                p-4
                            "
                        >
                            <div className="text-xs text-white/50 uppercase tracking-wide">
                                Fecha importada
                            </div>

                            <div className="text-lg font-semibold mt-1">
                                {resultado.fecha_importada || "-"}
                            </div>
                        </div>


                        {/* CREADOS */}

                        <div
                            className="
                                bg-white/5
                                border border-white/10
                                rounded-xl
                                p-4
                            "
                        >
                            <div className="text-xs text-white/50 uppercase tracking-wide">
                                Expedientes creados
                            </div>

                            <div className="text-2xl font-bold text-green-300 mt-1">
                                {resultado.expedientes_creados ?? 0}
                            </div>
                        </div>


                        {/* ACTUALIZADOS */}

                        <div
                            className="
                                bg-white/5
                                border border-white/10
                                rounded-xl
                                p-4
                            "
                        >
                            <div className="text-xs text-white/50 uppercase tracking-wide">
                                Expedientes actualizados
                            </div>

                            <div className="text-2xl font-bold text-blue-300 mt-1">
                                {resultado.expedientes_actualizados ?? 0}
                            </div>
                        </div>


                        {/* FILTRADOS */}

                        <div
                            className="
                                bg-white/5
                                border border-white/10
                                rounded-xl
                                p-4
                            "
                        >
                            <div className="text-xs text-white/50 uppercase tracking-wide">
                                Total filtrados
                            </div>

                            <div className="text-2xl font-bold text-white mt-1">
                                {resultado.total_filtrados ?? 0}
                            </div>
                        </div>

                    </div>


                    {/* ERRORES */}

                    {resultado.errores > 0 && (
                        <div
                            className="
                                mt-4
                                p-4
                                rounded-xl
                                bg-yellow-500/10
                                border border-yellow-400/20
                                text-yellow-100
                                text-sm
                            "
                        >
                            ⚠️ La importación terminó con{" "}
                            <strong>{resultado.errores}</strong>{" "}
                            registros con error.
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}
```
