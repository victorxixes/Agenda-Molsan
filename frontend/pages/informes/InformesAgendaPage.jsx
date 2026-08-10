import React, { useEffect, useState } from "react";
import { useInformesStore } from "../../store/informesStore";

export default function InformesAgendaPage() {
  const { agenda, loading, error, cargarAgenda } = useInformesStore();

  const hoy = new Date();
  const [year, setYear] = useState(hoy.getFullYear());
  const [month, setMonth] = useState(hoy.getMonth() + 1);
  const [day, setDay] = useState(hoy.getDate());

  useEffect(() => {
    cargarAgenda(year, month, day);
  }, [year, month, day]);

  const handleSubmit = (e) => {
    e.preventDefault();
    cargarAgenda(year, month, day);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Informe de agenda</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border px-2 py-1"
          placeholder="Año"
        />
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border px-2 py-1"
          placeholder="Mes"
        />
        <input
          type="number"
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className="border px-2 py-1"
          placeholder="Día"
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
          Actualizar
        </button>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && agenda && (
        <div className="grid grid-cols-3 gap-4">
          <InformeBloque titulo="Día" datos={agenda.dia} />
          <InformeBloque titulo="Semana" datos={agenda.semana} />
          <InformeBloque titulo="Mes" datos={agenda.mes} />
        </div>
      )}
    </div>
  );
}

function InformeBloque({ titulo, datos }) {
  return (
    <div className="border rounded p-3">
      <h2 className="font-semibold mb-2">{titulo}</h2>
      <p>Total citas: {datos.total}</p>
      <p>Confirmadas: {datos.confirmadas}</p>
      <p>Finalizadas: {datos.finalizadas}</p>
      <p>Canceladas: {datos.canceladas}</p>
    </div>
  );
}
