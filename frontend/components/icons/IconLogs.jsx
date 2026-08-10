import IconBase from "./IconBase";

export default function IconLogs({ size }) {
  return (
    <IconBase size={size}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="#1F3A5F" strokeWidth="2"/>
        <line x1="8" y1="10" x2="16" y2="10" stroke="#2D6CDF" strokeWidth="2"/>
        <line x1="8" y1="14" x2="16" y2="14" stroke="#6A7A8C" strokeWidth="2"/>
      </svg>
    </IconBase>
  );
}
