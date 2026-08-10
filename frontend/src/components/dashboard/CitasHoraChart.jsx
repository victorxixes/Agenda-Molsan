import { Line } from "react-chartjs-2";

export default function CitasHoraChart({ data }) {
  return (
    <Line
      data={{
        labels: data.map(d => d.hora),
        datasets: [{
          label: "Citas",
          data: data.map(d => d.total),
          borderColor: "rgba(0,150,255,0.8)",
          backgroundColor: "rgba(0,150,255,0.3)"
        }]
      }}
    />
  );
}
