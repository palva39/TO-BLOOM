import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@/types";
import api from "@/lib/api";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    navigate?: (path: string) => void
  ) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      // User not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    navigate?: (path: string) => void
  ) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      setUser(response.data.user);
      toast.success("Login successful!");
      // Use navigate if provided, else fallback
      if (navigate) {
        if (response.data.user.rol === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        if (response.data.user.rol === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        username,
        password,
      });
      setUser(response.data.user);
      toast.success("Registration successful!");
      window.location.href = "/profile";
    } catch (error: any) {
      const message = error.response?.data?.error || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error("Logout failed");
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
