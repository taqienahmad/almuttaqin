import { Link } from "react-router-dom";
import { PatternDivider } from "./PatternDivider";
import { useSchoolInfo } from "../schoolInfo";
import { useSiteSettings } from "../context/SiteSettingsContext";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 2a8 8 0 0 1 6.9 12l-.3.5.6 2.3-2.4-.6-.5.3A8 8 0 1 1 12 4Zm-3.4 3.9c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3-.3-.2-1.5-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.8-2Z" />
    </svg>
  );
}

export function Footer() {
  const { ADDRESS, WHATSAPP_DISPLAY, WHATSAPP_LINK, INSTAGRAM_URL, MAPS_SEARCH_URL } = useSchoolInfo();
  const settings = useSiteSettings();

  return (
    <footer className="site-footer">
      <PatternDivider />
      <div className="container site-footer-columns">
        <div>
          <h4>TAAM Al Muttaqin</h4>
          <p>{settings.footer_tagline}</p>
          <div className="site-footer-social">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram TAAM Al Muttaqin">
              <InstagramIcon />
            </a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp TAAM Al Muttaqin">
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        <div>
          <h4>Kontak</h4>
          <p>{ADDRESS}</p>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            WhatsApp: {WHATSAPP_DISPLAY}
          </a>
        </div>

        <div>
          <h4>Lokasi</h4>
          <a href={MAPS_SEARCH_URL} target="_blank" rel="noopener noreferrer">
            Lihat di Google Maps &rarr;
          </a>
        </div>

        <div>
          <h4>Jelajahi</h4>
          <Link to="/profil">Profil Sekolah</Link>
          <Link to="/program">Program</Link>
          <Link to="/kegiatan">Kegiatan</Link>
          <Link to="/galeri">Galeri</Link>
          <Link to="/ppdb">PPDB</Link>
          <Link to="/kontak">Kontak</Link>
        </div>
      </div>
      <div className="site-footer-bottom">
        &copy; {new Date().getFullYear()} TAAM Al Muttaqin. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
