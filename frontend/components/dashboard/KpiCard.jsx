import IconBase from "../icons/IconBase.jsx";

export default function KpiCard({ title, value, icon, compact }) {
  return (
    <div className={`glass-card rounded-xl shadow-md flex items-center gap-3 
      ${compact ? "p-3 min-h-[90px]" : "p-6"}`}>
      
      <div className="text-blue-400 text-2xl">
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
