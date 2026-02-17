
import { createContext, useEffect, useState } from "react";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkSession = async () => {

      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      }

      setLoading(false);
    };

    checkSession();

  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

