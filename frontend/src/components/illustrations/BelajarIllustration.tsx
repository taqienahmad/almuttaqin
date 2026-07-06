interface Props {
  className?: string;
}

export function BelajarIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 220 220" className={className} role="img" aria-label="Kegiatan belajar di kelas">
      <circle cx="110" cy="110" r="100" fill="#E7F5EC" />
      {/* board */}
      <rect x="50" y="60" width="120" height="70" rx="6" fill="#0A5540" />
      <rect x="50" y="60" width="120" height="70" rx="6" fill="none" stroke="#C79A3D" strokeWidth="3" />
      <line x1="66" y1="82" x2="120" y2="82" stroke="#F7FAF3" strokeWidth="3" strokeLinecap="round" />
      <line x1="66" y1="98" x2="140" y2="98" stroke="#F7FAF3" strokeWidth="3" strokeLinecap="round" />
      <line x1="66" y1="114" x2="104" y2="114" stroke="#F7FAF3" strokeWidth="3" strokeLinecap="round" />
      <rect x="102" y="130" width="16" height="8" fill="#8a6a1f" />

      {/* child at desk */}
      <circle cx="110" cy="164" r="18" fill="#F2CBA0" />
      <path d="M88 158 a22 13 0 0 1 44 0 z" fill="#0E6E4F" />
      <rect x="80" y="182" width="60" height="14" rx="4" fill="#C79A3D" />
    </svg>
  );
}
