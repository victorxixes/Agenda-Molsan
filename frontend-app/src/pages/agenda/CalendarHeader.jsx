export default function CalendarHeader({ selectedDate, onChange }) {
  const prevMonth = () => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() - 1);
    onChange(d);
  };

  const nextMonth = () => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + 1);
    onChange(d);
  };

  const goToday = () => {
    onChange(new Date());
  };

  const monthName = selectedDate.toLocaleString("es-ES", { month: "long" });

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold capitalize">
        {monthName} {selectedDate.getFullYear()}
      </h2>

      <div className="flex gap-2">
        <button className="btn" onClick={prevMonth}>←</button>
        <button className="btn btn-primary" onClick={goToday}>Hoy</button>
        <button className="btn" onClick={nextMonth}>→</button>
      </div>
    </div>
  );
}
