import IconBase from "./IconBase";

export default function IconAgenda({ size }) {
  return (
    <IconBase size={size}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="#1F3A5F" strokeWidth="2"/>
        <line x1="3" y1="10" x2="21" y2="10" stroke="#2D6CDF" strokeWidth="2"/>
      </svg>
    </IconBase>
  );
}
