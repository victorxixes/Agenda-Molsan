import { Bar } from "react-chartjs-2";

export default function CitasProvinciaChart({ data }) {
  return (
    <Bar
      data={{
        labels: data.map(d => d.provincia),
        datasets: [{
          label: "Citas",
          data: data.map(d => d.total),
          backgroundColor: "rgba(0,150,255,0.4)"
        }]
      }}
    />
  );
}
