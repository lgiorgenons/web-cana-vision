import { apiFetch } from "@/lib/api-client";

export type AuthUser = {
  id: string;
  nome: string;
  email: string;
  role: string | null;
  clienteId: string | null;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
};

export type AuthResponse = {
  user: AuthUser;
  tokens?: AuthTokens;
  provider?: string;
  requiresEmailConfirmation?: boolean;
};

export type RegisterPayload = {
  nome: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function registerUser(payload: RegisterPayload) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
