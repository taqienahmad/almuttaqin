import { api } from "./client";

interface Token {
  access_token: string;
  token_type: string;
}

export function login(email: string, password: string) {
  return api.post<Token>("/auth/login", { email, password });
}
