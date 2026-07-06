import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession } from "../api/client";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  guru: "Guru",
  siswa: "Siswa",
  orang_tua: "Orang Tua",
};

interface Props {
  role: "admin" | "guru" | "siswa" | "orang_tua";
  children: ReactNode;
}

export function DashboardShell({ role, children }: Props) {
  const navigate = useNavigate();

  function handleLogout() {
    clearSession();
    navigate("/login");
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-brand">
          <img src="/logo_muttaqin.png" alt="Logo TAAM Al Muttaqin" className="dashboard-sidebar-logo" />
          <span>
            Taman Asuh Anak Muslim
            <br />
            (TAAM) Al Muttaqin
          </span>
        </div>
        <span className="badge badge-gold dashboard-sidebar-role">{ROLE_LABEL[role]}</span>
        <div className="dashboard-sidebar-spacer" />
        <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
          Keluar
        </button>
      </aside>
      <div className="dashboard-content">{children}</div>
    </div>
  );
}
