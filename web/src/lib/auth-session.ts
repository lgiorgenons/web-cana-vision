import type { AuthResponse } from "@/services/auth";

const AUTH_STORAGE_KEY = "atmos-auth-session";

const safeWindow = typeof window !== "undefined" ? window : undefined;

function getStorage(persist: boolean) {
  if (!safeWindow) return undefined;
  return persist ? safeWindow.localStorage : safeWindow.sessionStorage;
}

export function saveAuthSession(session: AuthResponse, persist = true) {
  const storage = getStorage(persist);
  if (!storage) return;
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

  const other = getStorage(!persist);
  other?.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthSession(): AuthResponse | null {
  if (!safeWindow) return null;
  const raw = safeWindow.localStorage.getItem(AUTH_STORAGE_KEY) ??
    safeWindow.sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    safeWindow.localStorage.removeItem(AUTH_STORAGE_KEY);
    safeWindow.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearAuthSession() {
  if (!safeWindow) return;
  safeWindow.localStorage.removeItem(AUTH_STORAGE_KEY);
  safeWindow.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
