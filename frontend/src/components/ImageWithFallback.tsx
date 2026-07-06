import { useState, type ReactNode } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  fallback?: ReactNode;
}

export function ImageWithFallback({ src, alt, className, fallback }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) return <>{fallback ?? null}</>;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
