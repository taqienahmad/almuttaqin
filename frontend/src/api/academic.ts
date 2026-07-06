import { api } from "./client";
import type { Absensi, Jadwal, Kelas, MataPelajaran, Nilai } from "../types";

export const kelasApi = {
  list: () => api.get<Kelas[]>("/kelas"),
  create: (kelas: { name: string; wali_kelas_id?: number }) => api.post<Kelas>("/kelas", kelas),
};

export const mataPelajaranApi = {
  list: () => api.get<MataPelajaran[]>("/mata-pelajaran"),
  create: (mapel: { name: string; code: string }) => api.post<MataPelajaran>("/mata-pelajaran", mapel),
};

export const jadwalApi = {
  list: (kelasId?: number) => api.get<Jadwal[]>(kelasId ? `/jadwal?kelas_id=${kelasId}` : "/jadwal"),
  create: (jadwal: Omit<Jadwal, "id">) => api.post<Jadwal>("/jadwal", jadwal),
};

export const nilaiApi = {
  list: () => api.get<Nilai[]>("/nilai"),
  create: (nilai: Omit<Nilai, "id" | "guru_id">) => api.post<Nilai>("/nilai", nilai),
};

export const absensiApi = {
  list: () => api.get<Absensi[]>("/absensi"),
  create: (absensi: Omit<Absensi, "id" | "guru_id">) => api.post<Absensi>("/absensi", absensi),
};
