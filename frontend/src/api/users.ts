import { api } from "./client";
import type { User, UserCreateInput, UserRole } from "../types";

export const usersApi = {
  me: () => api.get<User>("/users/me"),
  list: (role?: UserRole) => api.get<User[]>(role ? `/users?role=${role}` : "/users"),
  create: (user: UserCreateInput) => api.post<User>("/users", user),
  linkChild: (parentId: number, studentId: number) =>
    api.post<void>(`/users/${parentId}/children/${studentId}`, {}),
  resetPassword: (userId: number, newPassword: string) =>
    api.put<User>(`/users/${userId}/password`, { new_password: newPassword }),
};
