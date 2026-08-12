import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { authApi } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const u = await authApi.me();
      setUser(u);
    } catch (err) {
      if (err?.response && err.response.status !== 401) {
        console.warn("AuthContext: auth check failed", err.response.status);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginWithGoogle = useCallback(async (accessToken) => {
    const result = await authApi.google(accessToken);
    setUser(result.user);
    window.location.href = "/admin";
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("AuthContext: logout API failed, clearing state anyway", err?.message);
    }
    setUser(null);
    window.location.href = "/";
  }, []);

  const value = useMemo(
    () => ({ user, loading, loginWithGoogle, logout, refresh: checkAuth, setUser }),
    [user, loading, loginWithGoogle, logout, checkAuth]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};