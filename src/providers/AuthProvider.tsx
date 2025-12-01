// src/providers/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // fixed import

const API_BASE = "http://lingomate-eb.ap-northeast-2.elasticbeanstalk.com/api";

type AuthContextType = {
  token: string | null;
  user: any;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Restore token from storage
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("auth_token");
      if (stored) {
        setToken(stored);
        try {
          setUser(jwtDecode(stored));
        } catch {}
      }
      setLoading(false);
    })();
  }, []);

  const login = async (accessToken: string) => {
    setToken(accessToken);
    setUser(jwtDecode(accessToken));
    await AsyncStorage.setItem("auth_token", accessToken);

    // Sync user to backend
    await fetch(`${API_BASE}/auth/register-if-needed`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  };

  const logout = async () => {
    await AsyncStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
