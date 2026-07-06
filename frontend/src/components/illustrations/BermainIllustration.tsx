interface Props {
  className?: string;
}

export function BermainIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 220 220" className={className} role="img" aria-label="Anak-anak bermain bersama">
      <circle cx="110" cy="110" r="100" fill="#E7F5EC" />
      <ellipse cx="110" cy="188" rx="70" ry="8" fill="#DCE7DE" />

      {/* child 1 */}
      <circle cx="72" cy="98" r="20" fill="#F2CBA0" />
      <path d="M52 90 a20 14 0 0 1 40 0 z" fill="#C79A3D" />
      <path d="M46 178 C46 145 58 130 72 130 C86 130 98 145 98 178 Z" fill="#0E6E4F" />

      {/* child 2 */}
      <circle cx="148" cy="102" r="20" fill="#E3A272" />
      <path d="M128 96 a20 14 0 0 1 40 0 z" fill="#0A5540" />
      <path d="M122 178 C122 147 134 132 148 132 C162 132 174 147 174 178 Z" fill="#C79A3D" />

      {/* ball */}
      <circle cx="110" cy="160" r="16" fill="#FFFFFF" stroke="#0E6E4F" strokeWidth="3" />
      <path d="M110 144 v32 M94 160 h32" stroke="#0E6E4F" strokeWidth="2" />
    </svg>
  );
}
