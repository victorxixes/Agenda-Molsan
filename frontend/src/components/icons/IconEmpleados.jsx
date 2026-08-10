import IconBase from "./IconBase";

export default function IconEmpleados({ size }) {
  return (
    <IconBase size={size}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="9" r="3" stroke="#1F3A5F" strokeWidth="2"/>
        <circle cx="15" cy="9" r="3" stroke="#6A7A8C" strokeWidth="2"/>
        <path d="M4 20c0-3 2-5 5-5s5 2 5 5" stroke="#2D6CDF" strokeWidth="2"/>
        <path d="M10 20c0-3 2-5 5-5s5 2 5 5" stroke="#6A7A8C" strokeWidth="2"/>
      </svg>
    </IconBase>
  );
}
