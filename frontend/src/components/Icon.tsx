export type IconName =
  | "book"
  | "heart"
  | "shield"
  | "users"
  | "palette"
  | "moon-star"
  | "home"
  | "message"
  | "map-pin"
  | "sparkles"
  | "sun"
  | "leaf";

interface Props {
  name: IconName;
  className?: string;
}

const PATHS: Record<IconName, JSX.Element> = {
  book: (
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.3c-1.8-1.2-4.3-1.6-7-1.2v12.6c2.7-.4 5.2 0 7 1.2 1.8-1.2 4.3-1.6 7-1.2V5.1c-2.7-.4-5.2 0-7 1.2Z" />
      <path d="M12 6.3v12.6" />
    </g>
  ),
  heart: (
    <path d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2 4.5 5.5 4c2-.3 3.7.6 6.5 3 2.8-2.4 4.5-3.3 6.5-3C22 4.5 23.5 8 22 11.2c-2.5 4.7-10 9.3-10 9.3Z" />
  ),
  shield: (
    <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Zm-1.5 12L7 11.5l1.4-1.4 2.1 2.1 4.1-4.1L16 9.5 10.5 15Z" />
  ),
  users: (
    <path d="M9 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7-1a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6ZM2 19.5c0-3 3.1-5.5 7-5.5s7 2.5 7 5.5V21H2v-1.5Zm14.5-4.4c2.6.5 4.5 2.4 4.5 4.4V21h-3v-1.5c0-1.6-.7-3-1.9-4.1Z" />
  ),
  palette: (
    <g>
      <path
        d="M12 3.5a8.5 8.5 0 1 0 0 17c1 0 1.8-.8 1.8-1.8 0-.45-.18-.85-.47-1.16-.3-.32-.48-.75-.48-1.24 0-1 .8-1.8 1.8-1.8h2.05A4.65 4.65 0 0 0 21.5 10 8.5 8.5 0 0 0 12 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8.1" cy="10.2" r="1.15" fill="currentColor" />
      <circle cx="10.6" cy="7.1" r="1.15" fill="currentColor" />
      <circle cx="14.4" cy="7.4" r="1.15" fill="currentColor" />
    </g>
  ),
  "moon-star": (
    <path d="M20.5 14.7A8.5 8.5 0 0 1 9.3 3.5a8.5 8.5 0 1 0 11.2 11.2ZM18 3l.6 1.4L20 5l-1.4.6L18 7l-.6-1.4L16 5l1.4-.6L18 3Z" />
  ),
  home: <path d="M12 3 2 11h3v9h5v-6h4v6h5v-9h3L12 3Z" />,
  message: (
    <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4.5 4V6a1 1 0 0 1 1-1Z" />
  ),
  "map-pin": (
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.8A2.8 2.8 0 1 1 12 6.2a2.8 2.8 0 0 1 0 5.6Z" />
  ),
  sparkles: (
    <path d="M11 2 9.4 7.4 4 9l5.4 1.6L11 16l1.6-5.4L18 9l-5.4-1.6L11 2Zm7 10-.8 2.6L14.6 15l2.6.8.8 2.6.8-2.6 2.6-.8-2.6-.8L18 12Z" />
  ),
  sun: (
    <path d="M12 5.5a1 1 0 0 1-1-1V3a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1ZM12 21a1 1 0 0 1-1-1v-1.5a1 1 0 1 1 2 0V20a1 1 0 0 1-1 1Zm8.5-9a1 1 0 0 1 1-1H23a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1ZM1 12a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1Zm17.5-6.4-1 1a1 1 0 0 1-1.5-1.4l1-1a1 1 0 0 1 1.5 1.4ZM6 18.4l-1 1a1 1 0 1 1-1.4-1.4l1-1A1 1 0 0 1 6 18.4Zm12.4 1a1 1 0 0 1-1.4 0l-1-1a1 1 0 0 1 1.4-1.5l1 1a1 1 0 0 1 0 1.5ZM6 5.6a1 1 0 0 1-1.4 0l-1-1A1 1 0 1 1 5 3.2l1 1a1 1 0 0 1 0 1.4ZM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
  ),
  leaf: (
    <path d="M20 4c-8 0-14.5 5-15.8 12.3A1 1 0 0 0 5.2 17.5c1-.1 2-.3 2.9-.6C7 19 6.2 20.4 5.3 21.6a1 1 0 0 0 1.5 1.3c1.6-1.9 2.7-3.6 3.5-5.3 5.5-1.6 9.7-6.3 9.7-11.6V4Z" />
  ),
};

export function Icon({ name, className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
