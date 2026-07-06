interface Props {
  className?: string;
}

export function AnakMengajiIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 220 220" className={className} role="img" aria-label="Anak mengaji Al-Qur'an">
      <circle cx="110" cy="110" r="100" fill="#E7F5EC" />
      <ellipse cx="110" cy="185" rx="55" ry="10" fill="#DCE7DE" />
      {/* peci */}
      <path d="M78 78 a32 20 0 0 1 64 0 z" fill="#0E6E4F" />
      {/* head */}
      <circle cx="110" cy="95" r="26" fill="#F2CBA0" />
      {/* body */}
      <path d="M62 178 C62 130 88 118 110 118 C132 118 158 130 158 178 Z" fill="#0E6E4F" />
      <path d="M78 178 C78 145 92 132 110 132 C128 132 142 145 142 178 Z" fill="#0A5540" />
      {/* book */}
      <rect x="86" y="150" width="48" height="34" rx="4" fill="#FFFFFF" />
      <line x1="110" y1="150" x2="110" y2="184" stroke="#C79A3D" strokeWidth="2" />
      <line x1="92" y1="160" x2="106" y2="160" stroke="#C79A3D" strokeWidth="2" />
      <line x1="92" y1="168" x2="106" y2="168" stroke="#C79A3D" strokeWidth="2" />
      <line x1="114" y1="160" x2="128" y2="160" stroke="#C79A3D" strokeWidth="2" />
      <line x1="114" y1="168" x2="128" y2="168" stroke="#C79A3D" strokeWidth="2" />
    </svg>
  );
}
