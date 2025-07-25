import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    // Parse tokens from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (token && refreshToken) {
      // Store tokens (localStorage or Zustand)
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      setAuth({ token, refreshToken });

      // Fetch user profile
      axios
        .get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const user = res.data.data;
          // Check onboarding status (assume user.hasCompletedOnboarding or similar)
          if (user.hasCompletedOnboarding) {
            navigate("/items");
          } else {
            navigate("/onboarding");
          }
        })
        .catch(() => {
          // If error, redirect to login
          navigate("/login");
        });
    } else {
      // If no tokens, redirect to login
      navigate("/login");
    }
  }, [navigate, setAuth]);

  return <div>Signing you in with Google...</div>;
};

export default AuthSuccess;
