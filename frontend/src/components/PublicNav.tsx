import { Link, NavLink } from "react-router-dom";

export function PublicNav() {
  return (
    <header className="public-nav">
      <div className="container">
        <Link to="/" className="public-nav-brand">
          <img src="/logo_muttaqin.png" alt="Logo TAAM Al Muttaqin" className="public-nav-logo" />
          <span>Taman Asuh Anak Muslim (TAAM) Al Muttaqin</span>
        </Link>
        <nav className="public-nav-links">
          <NavLink to="/" end>
            Beranda
          </NavLink>
          <NavLink to="/profil">Profil Sekolah</NavLink>
          <NavLink to="/program">Program</NavLink>
          <NavLink to="/ppdb">PPDB</NavLink>
          <NavLink to="/galeri">Galeri</NavLink>
          <NavLink to="/kontak">Kontak</NavLink>
          <Link to="/login" className="btn btn-sm">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
