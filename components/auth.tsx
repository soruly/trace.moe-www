import { createContext, useContext, useEffect, useState } from "react";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const STORAGE_KEY = "trace.moe-api-key";

export const isGuest = (id) => (id.indexOf("@") >= 0 ? false : true);
export const isAdmin = (id) => (id.match(/^[a-zA-Z0-9_.+-]+@trace.moe$/) ? true : false);
export const initials = (email: string) =>
  email
    .split("@")[0]
    .split(/[._+-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((e) => e[0].toUpperCase())
    .join("");
export const getStoredApiKey = () =>
  typeof localStorage === "undefined" ? "" : localStorage.getItem(STORAGE_KEY) || "";

interface User {
  id: string;
  priority: number;
  concurrency: number;
  quota: number;
  quotaUsed: number;
}

interface AuthContextValue {
  status: "loading" | "guest" | "user";
  user: User | null;
  apiKey: string;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  setApiKey: (key: string) => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState<"loading" | "guest" | "user">("loading");
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKeyState] = useState("");

  const fetchMe = async (key: string) => {
    try {
      const res = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/me`, {
        headers: { "x-trace-key": key || "" },
      });
      if (res.status >= 400) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  };

  const applySession = async (key: string) => {
    let me = await fetchMe(key);
    if (!me && key) {
      // stored key is no longer valid, fall back to guest
      localStorage.removeItem(STORAGE_KEY);
      key = "";
      me = await fetchMe("");
    }
    setUser(me);
    setApiKeyState(me ? key : "");
    setStatus(me && key && !isGuest(me.id) ? "user" : "guest");
  };

  useEffect(() => {
    applySession(getStoredApiKey());
    const syncTabs = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) applySession(e.newValue || "");
    };
    window.addEventListener("storage", syncTabs);
    return () => window.removeEventListener("storage", syncTabs);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/user/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status >= 400) {
      return { ok: false, error: (await res.json()).error };
    }
    const key = (await res.json()).key;
    localStorage.setItem(STORAGE_KEY, key);
    await applySession(key);
    return { ok: true };
  };

  const logout = async () => {
    localStorage.removeItem(STORAGE_KEY);
    await applySession("");
  };

  const setApiKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKeyState(key);
  };

  const refresh = async () => {
    const me = await fetchMe(apiKey);
    if (me) setUser(me);
  };

  return (
    <AuthContext.Provider value={{ status, user, apiKey, login, logout, setApiKey, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
