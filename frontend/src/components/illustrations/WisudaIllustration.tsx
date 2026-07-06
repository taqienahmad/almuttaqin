interface Props {
  className?: string;
}

export function WisudaIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 220 220" className={className} role="img" aria-label="Wisuda tahfidz Al-Qur'an">
      <circle cx="110" cy="110" r="100" fill="#F7EDD6" />
      <ellipse cx="110" cy="188" rx="55" ry="8" fill="#EADFC0" />
      {/* head */}
      <circle cx="110" cy="100" r="24" fill="#F2CBA0" />
      {/* graduation cap */}
      <path d="M74 88 L110 72 L146 88 L110 104 Z" fill="#1B2B24" />
      <rect x="107" y="98" width="6" height="18" fill="#1B2B24" />
      <circle cx="110" cy="118" r="4" fill="#C79A3D" />
      {/* body/gown */}
      <path d="M72 178 C72 140 90 122 110 122 C130 122 148 140 148 178 Z" fill="#0E6E4F" />
      <path d="M96 130 L110 178 L124 130" fill="none" stroke="#C79A3D" strokeWidth="3" />
      {/* scroll */}
      <rect x="82" y="150" width="36" height="10" rx="5" fill="#FFFFFF" stroke="#C79A3D" strokeWidth="2" />
    </svg>
  );
}
