import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/tables", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication failed:", error);
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div id="loader">
        <h1>Loading...</h1>
      </div>
    );
  }

  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
