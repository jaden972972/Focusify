interface LogoStruddiaProps {
  size?: number;
  className?: string;
  glowIntensity?: "soft" | "strong";
}

export default function LogoStuddia({ size = 52, className, glowIntensity = "strong" }: LogoStruddiaProps) {
  const h = Math.round(size * 0.45);
  const glow =
    glowIntensity === "strong"
      ? "drop-shadow(0 0 5px #FF00FF) drop-shadow(0 0 12px #FF00FFAA) drop-shadow(0 0 24px #FF00FF55)"
      : "drop-shadow(0 0 4px #FF00FF88) drop-shadow(0 0 10px #FF00FF44)";

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 80 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Studdia logo"
      style={{ filter: glow }}
    >
      {/* Infinity symbol — two looping bezier ovals crossing at center */}
      <path
        d="M 40 18
           C 38 7, 26 2, 16 8
           C 6 14, 6 22, 16 28
           C 26 34, 38 29, 40 18
           C 42 7, 54 2, 64 8
           C 74 14, 74 22, 64 28
           C 54 34, 42 29, 40 18 Z"
        stroke="#FF00FF"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Play triangle — centered, pointing right */}
      <polygon
        points="35,12 47,18 35,24"
        fill="#FF00FF"
      />
    </svg>
  );
}
