import React from "react";

export default function ChartFirmasMes({ data }) {
  const meses = [
    "Ene","Feb","Mar","Abr","May","Jun",
    "Jul","Ago","Sep","Oct","Nov","Dic"
  ];

  // Protección total: si no es array → lo convertimos en []
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div>
      <h3>Firmas por mes</h3>

      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>VC</th>
            <th>P</th>
          </tr>
        </thead>

        <tbody>
          {safeData.map((item, index) => (
            <tr key={index}>
              <td>{meses[(item.mes ?? index) - 1]}</td>
              <td>{item.vc ?? 0}</td>
              <td>{item.p ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
