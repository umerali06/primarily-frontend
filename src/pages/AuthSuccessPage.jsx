import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { TbLoader } from "react-icons/tb";

const AuthSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser } = useAuthStore();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");

        if (!token || !refreshToken) {
          toast.error("Authentication failed - missing tokens");
          navigate("/login");
          return;
        }

        // Store tokens in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);

        // Get user info from token (decode JWT payload)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          const userData = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role,
            displayName: payload.displayName || payload.name,
          };
          
          // Update auth store
          useAuthStore.setState({
            user: userData,
            token,
            refreshToken,
            isAuthenticated: true,
          });

          // Also store user data in localStorage for persistence
          localStorage.setItem("user", JSON.stringify(userData));

          toast.success(`Welcome ${userData.displayName || userData.name}!`);
          
          // Redirect to items dashboard
          navigate("/items");
        } catch (decodeError) {
          console.error("Token decode error:", decodeError);
          toast.error("Authentication failed - invalid token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth success error:", error);
        toast.error("Authentication failed");
        navigate("/login");
      }
    };

    handleAuthSuccess();
  }, [navigate, searchParams, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <TbLoader className="animate-spin mx-auto mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing authentication...
        </h2>
        <p className="text-gray-600">
          Please wait while we redirect you to your dashboard.
        </p>
      </div>
    </div>
  );
};

export default AuthSuccessPage;