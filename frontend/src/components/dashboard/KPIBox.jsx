import React from "react";

export default function KPIBox({ title, value }) {
  return (
    <div style={{
      padding: "20px",
      borderRadius: "10px",
      background: "#f5f5f5",
      marginBottom: "10px"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

