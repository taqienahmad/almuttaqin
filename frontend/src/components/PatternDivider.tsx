/** Thin repeating eight-point star motif, used as a subtle section divider. */
export function PatternDivider() {
  return (
    <svg viewBox="0 0 240 16" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: 16, display: "block" }}>
      <defs>
        <pattern id="star-pattern" width="24" height="16" patternUnits="userSpaceOnUse">
          <path
            d="M12 2 L14 6 L18 8 L14 10 L12 14 L10 10 L6 8 L10 6 Z"
            fill="none"
            stroke="#C79A3D"
            strokeWidth="1"
            opacity="0.6"
          />
        </pattern>
      </defs>
      <rect width="240" height="16" fill="url(#star-pattern)" />
    </svg>
  );
}
