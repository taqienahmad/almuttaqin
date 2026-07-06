interface Props {
  className?: string;
}

export function AnakSholatIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 220 220" className={className} role="img" aria-label="Anak belajar sholat">
      <circle cx="110" cy="110" r="100" fill="#F7EDD6" />
      {/* dome silhouette */}
      <path d="M60 150 a50 50 0 0 1 100 0 z" fill="#C79A3D" opacity="0.35" />
      <rect x="104" y="70" width="12" height="30" fill="#C79A3D" opacity="0.35" />
      <ellipse cx="110" cy="185" rx="55" ry="10" fill="#EADFC0" />
      {/* head */}
      <circle cx="110" cy="88" r="24" fill="#F2CBA0" />
      <path d="M86 82 a24 16 0 0 1 48 0 z" fill="#0E6E4F" />
      {/* body standing, hands folded */}
      <path d="M74 178 C74 130 92 118 110 118 C128 118 146 130 146 178 Z" fill="#0E6E4F" />
      <rect x="96" y="140" width="28" height="16" rx="8" fill="#0A5540" />
    </svg>
  );
}
