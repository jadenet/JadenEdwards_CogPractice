import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getToken, setToken } from "../lib/api";
import { getCurrentUser, login as loginRequest, register as registerRequest } from "../lib/bankingApi";
import type { AuthResponse, User } from "../types/bank";

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (body: { name: string; email: string; username: string; password: string }) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) return setReady(true);
    getCurrentUser()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  function accept({ token, user }: AuthResponse) {
    setToken(token);
    setUser(user);
    return user;
  }

  const value: AuthContextValue = {
    user,
    ready,
    login: async (username, password) => accept(await loginRequest(username, password)),
    register: async (body) => accept(await registerRequest(body)),
    logout: () => {
      setToken(null);
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function homePathFor(user: User) {
  return user.role === "admin" ? "/admin" : `/users/${user.user_id}/accounts`;
}
