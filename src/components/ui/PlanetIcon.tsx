export function PlanetIcon({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
      <defs>
        <radialGradient id="pi" cx="40%" cy="38%" r="50%">
          <stop offset="0%" stopColor="#5B9CF6"/>
          <stop offset="35%" stopColor="#1E6FD9"/>
          <stop offset="70%" stopColor="#6B3FA0"/>
          <stop offset="100%" stopColor="#1a1040"/>
        </radialGradient>
        <radialGradient id="ps" cx="32%" cy="30%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="10" fill="url(#pi)"/>
      <circle cx="16" cy="16" r="10" fill="url(#ps)"/>
      <path d="M 1 16 A 15 4.5 0 0 0 31 16" fill="none" stroke="white" strokeWidth="2" opacity="0.7"/>
    </svg>
  );
}
