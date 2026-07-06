/**
 * Google Drive "share" links (drive.google.com/file/d/ID/view or
 * drive.google.com/open?id=ID) point to an HTML viewer page, not the raw
 * image bytes, so they render as a broken <img>. The obvious fix,
 * drive.google.com/uc?export=view, gets rejected by Chrome's Opaque
 * Response Blocking (net::ERR_BLOCKED_BY_ORB) when hotlinked cross-site -
 * confirmed by testing an actual <img> load, not just curl. The
 * lh3.googleusercontent.com/d/ID host is what Drive itself actually serves
 * image bytes from and does not trip ORB, so convert to that instead
 * (capped at 1000px wide - plenty for feed/gallery thumbnails, and avoids
 * pulling multi-MB originals on every page view).
 */
export function toDirectImageUrl(url: string): string {
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w1000`;
  }
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}=w1000`;
  }
  return url;
}
