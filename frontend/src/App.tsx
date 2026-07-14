import { AnimatePresence } from "motion/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getRole, isLoggedIn } from "./api/client";
import { PageTransition } from "./components/PageTransition";
import { ScrollToTop } from "./components/ScrollToTop";
import { AdminDashboard } from "./pages/AdminDashboard";
import { GaleriPage } from "./pages/GaleriPage";
import { GuruDashboard } from "./pages/GuruDashboard";
import { HomePage } from "./pages/HomePage";
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

function page(element: JSX.Element) {
  return <PageTransition>{element}</PageTransition>;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={page(<HomePage />)} />
          <Route path="/profil" element={page(<ProfilPage />)} />
          <Route path="/program" element={page(<ProgramPage />)} />
          <Route path="/kegiatan" element={<Navigate to="/program" replace />} />
          <Route path="/galeri" element={page(<GaleriPage />)} />
          <Route path="/posts/:id" element={page(<PostDetailPage />)} />
          <Route path="/ppdb" element={page(<PPDBPage />)} />
          <Route path="/kontak" element={page(<KontakPage />)} />
          <Route path="/login" element={page(<LoginPage />)} />

          <Route
            path="/dashboard/admin"
            element={page(
              <RequireRole role="admin">
                <AdminDashboard />
              </RequireRole>,
            )}
          />
          <Route
            path="/dashboard/guru"
            element={page(
              <RequireRole role="guru">
                <GuruDashboard />
              </RequireRole>,
            )}
          />
          <Route
            path="/dashboard/siswa"
            element={page(
              <RequireRole role="siswa">
                <SiswaDashboard />
              </RequireRole>,
            )}
          />
          <Route
            path="/dashboard/orang_tua"
            element={page(
              <RequireRole role="orang_tua">
                <OrangTuaDashboard />
              </RequireRole>,
            )}
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}
