import IconBase from "./IconBase";

export default function IconSistema({ size }) {
  return (
    <IconBase size={size}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#1F3A5F" strokeWidth="2"/>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="#2D6CDF" strokeWidth="2"/>
      </svg>
    </IconBase>
  );
}
