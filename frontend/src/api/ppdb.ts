import { api } from "./client";
import type { PPDBInput, PPDBRegistration, PPDBStatus } from "../types";

export const ppdbApi = {
  submit: (data: PPDBInput) => api.post<PPDBRegistration>("/ppdb", data),
  list: (status?: PPDBStatus) =>
    api.get<PPDBRegistration[]>(status ? `/ppdb?ppdb_status=${status}` : "/ppdb"),
  updateStatus: (id: number, status: PPDBStatus, catatan_admin?: string) =>
    api.put<PPDBRegistration>(`/ppdb/${id}/status`, { status, catatan_admin }),
};
