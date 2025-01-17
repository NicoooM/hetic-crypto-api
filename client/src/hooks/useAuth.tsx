import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import API from "services/api";

interface AuthContextType {
  user: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem("token");
    if (user) {
      setUser(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const reponse = await API.post("/auth/login", { email, password });
    const token = reponse.data.accessToken;
    localStorage.setItem("token", token);
    setUser(true);
  };
  const logout = async () => {
    await API.post("/auth/logout");
    localStorage.removeItem("token");
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
