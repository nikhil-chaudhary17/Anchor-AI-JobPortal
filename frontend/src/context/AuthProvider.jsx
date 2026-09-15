import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../services/api";
import { loginUser, registerUser, logoutUser } from "../services/authServices";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/user/profile");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

const login = useCallback(async (credentials) => {
  const data = await loginUser(credentials);

  const profileRes = await api.get("/user/profile");

  setUser(profileRes.data.user);

  return data;
}, []);


  const register = useCallback(async (details) => {
    const data = await registerUser(details);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updates) => {
  setUser((prev) => ({ ...prev, ...updates }));
}, []);

 const value = useMemo(
  () => ({ user, loading, login, register, logout, updateUser }),
  [user, loading, login, register, logout, updateUser]
);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}