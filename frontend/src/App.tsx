import { Navigate, Route, Routes } from "react-router-dom";
import { getRole, isLoggedIn } from "./api/client";
import { AdminDashboard } from "./pages/AdminDashboard";
import { GaleriPage } from "./pages/GaleriPage";
import { GuruDashboard } from "./pages/GuruDashboard";
import { HomePage } from "./pages/HomePage";
import { KegiatanPage } from "./pages/KegiatanPage";
import { KontakPage } from "./pages/KontakPage";
import { LoginPage } from "./pages/LoginPage";
import { OrangTuaDashboard } from "./pages/OrangTuaDashboard";
import { PostDetailPage } from "./pages/PostDetailPage";
import { PPDBPage } from "./pages/PPDBPage";
import { ProfilPage } from "./pages/ProfilPage";
import { ProgramPage } from "./pages/ProgramPage";
import { SiswaDashboard } from "./pages/SiswaDashboard";
import type { UserRole } from "./types";

function RequireRole({ role, children }: { role: UserRole; children: JSX.Element }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (getRole() !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profil" element={<ProfilPage />} />
      <Route path="/program" element={<ProgramPage />} />
      <Route path="/kegiatan" element={<KegiatanPage />} />
      <Route path="/galeri" element={<GaleriPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="/ppdb" element={<PPDBPage />} />
      <Route path="/kontak" element={<KontakPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard/admin"
        element={
          <RequireRole role="admin">
            <AdminDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/dashboard/guru"
        element={
          <RequireRole role="guru">
            <GuruDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/dashboard/siswa"
        element={
          <RequireRole role="siswa">
            <SiswaDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/dashboard/orang_tua"
        element={
          <RequireRole role="orang_tua">
            <OrangTuaDashboard />
          </RequireRole>
        }
      />
    </Routes>
  );
}
