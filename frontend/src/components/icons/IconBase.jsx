export default function IconBase({ children, size = 22 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        padding: "6px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(200,200,200,0.4)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}
