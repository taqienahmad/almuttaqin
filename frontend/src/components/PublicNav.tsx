import { Link } from "react-router-dom";

export function PublicNav() {
  return (
    <header className="public-nav">
      <div className="container">
        <Link to="/" className="public-nav-brand">
          <img src="/logo_muttaqin.png" alt="Logo TAAM Al Muttaqin" className="public-nav-logo" />
          <span>Taman Asuh Anak Muslim (TAAM) Al Muttaqin</span>
        </Link>
        <nav className="public-nav-links">
          <Link to="/">Beranda</Link>
          <Link to="/profil">Profil Sekolah</Link>
          <Link to="/program">Program</Link>
          <Link to="/kegiatan">Kegiatan</Link>
          <Link to="/ppdb">PPDB</Link>
          <Link to="/galeri">Galeri</Link>
          <Link to="/kontak">Kontak</Link>
          <Link to="/login" className="btn btn-sm">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
