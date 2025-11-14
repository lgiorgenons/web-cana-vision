import { apiFetch } from "@/lib/api-client";

export type ForgotPasswordPayload = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordPayload = {
  accessToken: string;
  password: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export async function requestPasswordReset(payload: ForgotPasswordPayload) {
  return apiFetch<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return apiFetch<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
