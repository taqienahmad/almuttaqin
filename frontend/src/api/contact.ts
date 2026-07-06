import { api } from "./client";
import type { ContactMessage, ContactMessageInput } from "../types";

export const contactApi = {
  submit: (data: ContactMessageInput) => api.post<ContactMessage>("/contact", data),
  list: () => api.get<ContactMessage[]>("/contact"),
};
