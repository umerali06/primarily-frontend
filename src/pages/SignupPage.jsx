import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) clearError();
  };

  const isFormValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    formData.agreeToTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      toast.success("Account created successfully!");
      
      // Store user name for immediate use
      localStorage.setItem("user", JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        displayName: formData.fullName
      }));
      
      navigate("/onboarding");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left: Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 py-12">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Never lose track of an item again.
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Simple, fast, and powerful inventory software for businesses and
            teams to stay organized.
          </p>
          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full flex items-center gap-3 btn-primary text-white font-medium py-3 px-4 rounded-lg mb-6 text-lg shadow transition"
          >
            <span className="bg-white rounded p-1 mr-2 flex items-center justify-center">
              <img
                src="google-color-svgrepo-com.svg"
                alt=""
                srcSet=""
                className="w-7 h-7"
              />
            </span>
            Sign up with Google
          </button>
          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-200" />
            <span className="mx-4 text-gray-400 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          {/* Signup Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="block w-full border-b border-gray-300 bg-transparent px-0 py-3 text-lg focus:outline-none focus-primary transition"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Work Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full border-b border-gray-300 bg-transparent px-0 py-3 text-lg focus:outline-none focus-primary transition"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Create Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full border-b border-gray-300 bg-transparent px-0 py-3 text-lg focus:outline-none focus-primary transition"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full border-b border-gray-300 bg-transparent px-0 py-3 text-lg focus:outline-none focus-primary transition"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-green-500 border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                required
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-700 select-none"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <button
              type="submit"
              className={`w-full font-semibold py-3 rounded-lg mt-2 transition text-white ${
                isFormValid && !isLoading
                  ? "btn-primary"
                  : "bg-red-200 cursor-not-allowed opacity-70"
              }`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
            {error && (
              <div className="mt-4 p-3 bg-green-50 border border-red-200 rounded-lg text-green-700 text-sm">
                {error}
              </div>
            )}
          </form>
          <p className="text-xs text-gray-500 mt-6 text-center">
            By clicking on 'Create account' you agree to Primarily's{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
      {/* Right: Testimonial and Trust */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-gray-50 px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 max-w-lg w-full text-center">
          <p className="text-xl text-gray-800 mb-6 font-medium">
            “Simple to input inventory. Simple to use. Simple to customize. My
            team adopted Primarily very quickly.”
          </p>
          <div className="text-gray-700 mt-4">
            <div className="font-semibold">Olivia C.</div>
            <div className="text-sm">CEO</div>
          </div>
        </div>
        <div className="text-center text-gray-700 text-lg max-w-md">
          Join 20,000+ businesses small and large that trust Primarily to track,
          audit, and manage their inventory.
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
