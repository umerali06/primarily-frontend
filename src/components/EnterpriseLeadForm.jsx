import { useState } from "react";
import {
  enterpriseLeadService,
  formValidation,
  formUtils,
} from "../services/publicForms";
import toast from "react-hot-toast";

const countries = [
  { code: "+1", name: "United States" },
  { code: "+44", name: "United Kingdom" },
  { code: "+92", name: "Pakistan" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+39", name: "Italy" },
  { code: "+34", name: "Spain" },
  { code: "+81", name: "Japan" },
  { code: "+86", name: "China" },
  { code: "+91", name: "India" },
  { code: "+61", name: "Australia" },
  { code: "+55", name: "Brazil" },
];

const EnterpriseLeadForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: countries[0].name,
    phone: "",
    users: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = formValidation.validateEnterpriseLead(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await formUtils.handleSubmit(
        () => enterpriseLeadService.submit(form),
        setLoading,
        (error) => {
          setErrors({ submit: error });
          toast.error(error);
        },
        (message) => {
          setSuccess(true);
          toast.success(message);
          // Reset form after successful submission
          setTimeout(() => {
            formUtils.resetForm(
              setForm,
              {
                firstName: "",
                lastName: "",
                email: "",
                country: countries[0].name,
                phone: "",
                users: "",
                agree: false,
              },
              setErrors,
              () => {}
            );
            setSuccess(false);
          }, 3000);
        }
      );
    } catch (error) {
      // Error is already handled in formUtils.handleSubmit
    }
  };

  return (
    <section className="bg-[#fafafa] py-16 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-stretch">
        {/* Left: Badges, Heading, Text */}
        <div className="flex-1 flex flex-col justify-center items-start">
          <div className="flex gap-3 mb-6">
            <img
              src="/Americas_HighPerformer.svg"
              alt="High Performer Americas"
              className="h-18"
            />
            <img
              src="/high-perfeormance-winter.svg"
              alt="High Performer Winter"
              className="h-18"
            />
            <img
              src="/high-grammer-americas.svg"
              alt="High Grammer Americas"
              className="h-18"
            />
            <img src="/high-grammer.svg" alt="High Grammer" className="h-18" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Inventory management software that’s perfect for{" "}
            <span className="text-[#0a7662]">large teams.</span>
          </h2>
          <p className="text-gray-700 text-lg mb-6 max-w-md">
            Primarily enables teams of 12 or more people to track inventory in real
            time from multiple locations.
          </p>
        </div>
        {/* Right: Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto flex flex-col gap-4"
        >
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">Thank you for your interest!</p>
              <p className="text-sm">
                Our enterprise team will contact you within 24 hours.
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="firstName"
                placeholder="First name*"
                value={form.firstName}
                onChange={handleChange}
                required
                className={`w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0a7662] ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="lastName"
                placeholder="Last name*"
                value={form.lastName}
                onChange={handleChange}
                required
                className={`w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0a7662] ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Work Email*"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0a7662] ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0a7662] ${
                  errors.country ? "border-red-500" : "border-gray-300"
                }`}
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
            <div className="flex-1">
              <input
                type="tel"
                name="phone"
                placeholder="Phone number*"
                value={form.phone}
                onChange={handleChange}
                required
                className={`w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0a7662] ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-gray-800 font-medium mb-2">
              How many users will you need?{" "}
              <span className="text-[#0a7662]">*</span>
            </label>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="users"
                  value="12-15"
                  checked={form.users === "12-15"}
                  onChange={handleChange}
                  required
                  className="accent-[#0a7662]"
                />
                12-15 users
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="users"
                  value="16-20"
                  checked={form.users === "16-20"}
                  onChange={handleChange}
                  required
                  className="accent-[#0a7662]"
                />
                16-20 users
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="users"
                  value="21+"
                  checked={form.users === "21+"}
                  onChange={handleChange}
                  required
                  className="accent-[#0a7662]"
                />
                21+ users
              </label>
            </div>
            {errors.users && (
              <p className="text-red-500 text-sm mt-1">{errors.users}</p>
            )}
          </div>

          <div className="mb-2">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                required
                className="accent-[#0a7662] mt-1"
              />
              <span className="text-gray-700 text-sm">
                I agree to the{" "}
                <a href="/terms" className="text-[#0a7662] underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-[#0a7662] underline">
                  Privacy Policy
                </a>
                <span className="text-[#0a7662]">*</span>
              </span>
            </label>
            {errors.agree && (
              <p className="text-red-500 text-sm mt-1">{errors.agree}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-green-50 border border-red-200 text-green-800 px-4 py-3 rounded-lg">
              <p className="text-sm">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full font-bold py-4 rounded-full text-lg mt-2 transition-colors ${
              loading || success
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0a7662] hover:bg-[#075c4c] text-white"
            }`}
          >
            {loading ? "Submitting..." : success ? "Submitted!" : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EnterpriseLeadForm;
