
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  AuthUser,
  LoginCredentials,
} from "../features/auth/auth.types";

import {
  authenticate,
} from "../features/auth/auth.service";

const STORAGE_KEY = "cacao-sambirano-session";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  async function login(
    credentials: LoginCredentials,
  ): Promise<boolean> {
    const authenticatedUser = await authenticate(credentials);

    if (!authenticatedUser) {
      return false;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(authenticatedUser),
    );

    setUser(authenticatedUser);

    return true;
  }

  function logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur de AuthProvider.",
    );
  }

  return context;
}
