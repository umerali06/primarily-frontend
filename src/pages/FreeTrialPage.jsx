import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PartnersShowcase from "../components/PartnersShowcase";
import { trialService } from "../services/trial";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
// import MobileAppSection from "../components/MobileAppSection";

const FreeTrialPage = () => {
  // Form state for payment fields
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [trialStatus, setTrialStatus] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Check if user already has a trial
  useEffect(() => {
    const checkTrialStatus = async () => {
      try {
        const response = await trialService.getStatus();
        if (response && response.data && response.data.hasTrial) {
          setTrialStatus(response.data.trial);
          if (response.data.trial && response.data.trial.status === "active") {
            navigate("/items");
          }
        }
      } catch (error) {
        console.error("Failed to check trial status:", error);
      }
    };

    if (user) {
      checkTrialStatus();
    }
  }, [user, navigate]);

  // Simple validation: all fields must be non-empty
  const isFormValid =
    form.fullName.trim() &&
    form.email.trim() &&
    form.cardNumber.trim() &&
    form.expiry.trim() &&
    form.cvc.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const trialData = {
        billingInfo: {
          email: form.email,
          company: form.company,
          phone: form.phone,
        },
        trialDays: 14,
      };

      await trialService.start(trialData);
      toast.success("Free trial started successfully!");
      navigate("/items");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start trial");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipTrial = () => {
    navigate("/items");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Modal header */}
      <div className="max-w-4xl mx-auto pt-8 pb-2 flex flex-col items-center">
        <img src="/logo-placeholder.svg" alt="Primarily" className="h-12 mb-4" />
        <button className="absolute left-1/2 top-8 -translate-x-1/2 bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl focus:outline-none z-10">
          ×
        </button>
      </div>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow flex flex-col md:flex-row overflow-hidden mt-2">
        {/* Left: Payment Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
          <button className="text-sm text-gray-500 mb-4 flex items-center gap-2 hover:underline">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path
                stroke="#44475A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15l-5-5 5-5"
              />
            </svg>
            Back
          </button>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Start Your Free 14-Day Trial
          </h2>
          <p className="text-gray-600 mb-6">Add your inventory items today.</p>
          <form
            className="bg-white rounded-xl border border-gray-200 p-6 mb-4"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <span className="inline-block bg-primary-light text-primary text-xs font-semibold rounded px-3 py-1 mb-4">
              DISCOUNT APPLIED
            </span>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl font-semibold">
                Enter your payment info
              </div>
              <div className="flex gap-1">
                <img
                  src="/free-trail/visa-svgrepo-com.svg"
                  alt="Visa"
                  className="h-6"
                />
                <img
                  src="/free-trail/master-card-svgrepo-com.svg"
                  alt="Mastercard"
                  className="h-6"
                />
                <img
                  src="/free-trail/discover-svgrepo-com.svg"
                  alt="Discover"
                  className="h-6"
                />
                <img
                  src="/free-trail/amex-svgrepo-com.svg"
                  alt="Amex"
                  className="h-6"
                />
              </div>
            </div>
            <label
              className="block text-sm text-gray-700 mb-1 mt-2"
              htmlFor="fullName"
            >
              Full Name (as on card)
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Full Name"
              className="w-full border rounded px-4 py-3 mb-3 text-base"
              value={form.fullName}
              onChange={handleChange}
              required
            />

            <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              className="w-full border rounded px-4 py-3 mb-3 text-base"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label
              className="block text-sm text-gray-700 mb-1"
              htmlFor="company"
            >
              Company (Optional)
            </label>
            <input
              type="text"
              id="company"
              name="company"
              placeholder="Company Name"
              className="w-full border rounded px-4 py-3 mb-3 text-base"
              value={form.company}
              onChange={handleChange}
            />

            <label className="block text-sm text-gray-700 mb-1" htmlFor="phone">
              Phone (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Phone Number"
              className="w-full border rounded px-4 py-3 mb-3 text-base"
              value={form.phone}
              onChange={handleChange}
            />
            <label
              className="block text-sm text-gray-700 mb-1"
              htmlFor="cardNumber"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="Card number"
              className="w-full border rounded px-4 py-3 mb-3 text-base"
              value={form.cardNumber}
              onChange={handleChange}
              required
              inputMode="numeric"
              maxLength={19}
            />
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label
                  className="block text-sm text-gray-700 mb-1"
                  htmlFor="expiry"
                >
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  placeholder="MM/YY"
                  className="w-full border rounded px-4 py-3 text-base"
                  value={form.expiry}
                  onChange={handleChange}
                  required
                  maxLength={5}
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-sm text-gray-700 mb-1"
                  htmlFor="cvc"
                >
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  name="cvc"
                  placeholder="CVC"
                  className="w-full border rounded px-4 py-3 text-base"
                  value={form.cvc}
                  onChange={handleChange}
                  required
                  maxLength={4}
                />
              </div>
              <button
                type="button"
                className="bg-[var(--primary-dark)] text-white px-4 py-2 rounded text-sm font-semibold mt-6 h-12"
              >
                Autofill link
              </button>
            </div>
            <button
              type="submit"
              className={`w-full font-semibold py-3 rounded-lg mt-2 transition text-white ${
                isFormValid && !isLoading
                  ? "btn-primary hover:btn-primary-hover cursor-pointer"
                  : "bg-red-200 cursor-not-allowed opacity-70"
              }`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Starting Trial..." : "Start 14-Day Free Trial"}
            </button>

            <button
              type="button"
              onClick={handleSkipTrial}
              className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 transition font-medium"
              disabled={isLoading}
            >
              Skip Trial - Continue to Dashboard
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">
              By clicking on 'Start 14-Day Free Trial' you agree to our
              <a href="#" className="text-primary hover:underline ml-1">
                Terms & Conditions
              </a>{" "}
              and
              <a href="#" className="text-primary hover:underline ml-1">
                Privacy Policy
              </a>
              .
            </p>
            <div className="flex justify-center mt-6">
              <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 text-xs font-semibold">
                <img
                  src="/free-trail/credit-card-stripe-svgrepo-com.svg"
                  alt="Stripe"
                  className="h-5"
                />
                powered by <span className="font-bold">stripe</span>
              </span>
            </div>
          </form>
        </div>
        {/* Right: Plan Summary */}
        <div className="w-full md:w-1/2 bg-gray-50 p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-2xl font-bold text-gray-900">
                Free 14-Day Trial
              </div>
              <a
                href="#"
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Compare Plans
              </a>
            </div>
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="text-lg font-semibold mb-1">Advanced</div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-extrabold text-gray-900 line-through">
                  $49
                </span>
                <span className="text-5xl font-extrabold text-gray-900">
                  $24
                </span>
                <span className="text-lg text-gray-500">/month</span>
              </div>
              <div className="text-primary text-sm font-semibold mb-2">
                Billed yearly: $288{" "}
                <span className="bg-primary-light text-primary rounded px-2 py-1 ml-2">
                  SAVE $300 A YEAR
                </span>
              </div>
            </div>
            <div className="text-gray-700 text-sm mb-4">
              Your card will be automatically charged after your free trial ends
              on <span className="font-semibold">Jul 28, 2025</span>. Your
              subscription will auto renew yearly at the then-current price,
              plus taxes, if any.
            </div>
            <div className="text-sm mb-4">
              <a href="#" className="text-primary hover:underline">
                Switch to monthly billing
              </a>{" "}
              at <span className="text-gray-900 font-semibold">$49</span> /
              month
            </div>
            <div className="border-t border-gray-300 my-4"></div>
            <div className="mb-4">
              <div className="text-xl font-bold mb-2">Features</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-base text-gray-800">
                  <span className="text-primary">✔</span> 500 Items
                </li>
                <li className="flex items-center gap-2 text-base text-gray-800">
                  <span className="text-primary">✔</span> 2 Free user licenses
                </li>
                <li className="flex items-center gap-2 text-base text-gray-800">
                  <span className="text-primary">✔</span> 5 Custom fields
                </li>
              </ul>
            </div>
            <div className="flex justify-end">
              {/* Provided SVG for the card end */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="100"
                viewBox="0 0 308 254"
                fill="none"
              >
                <path
                  fill="#F9E9E9"
                  d="M255.48 366.134c17.349 2.893 48.908 1.1 66.255-1.88 17.348-2.98 34.379-12.709 42.014-28.57 5.296-11.024 5.592-24.179 1.572-35.736-5.024-14.526-13.79-27.466-22.303-40.264-25.229-37.964 1.844-67.976 7.391-92.687 11.153-49.738 2.444-93.393-36.592-115.352-36.553-20.57-76.387-12.039-84.94-9.777-110.224 29.175-174.79 165.98-153.967 221.1 12.53 33.129 38.115 79.404 180.57 103.166"
                  style={{ mixBlendMode: "multiply" }}
                ></path>
                <path
                  fill="url(#registration-blob_svg__a)"
                  d="M313.822 94.42c-9.833-13.77-32.52-34.016-46.347-43.79-13.827-9.773-32.03-14.74-48.013-9.144-11.101 3.896-20.25 12.643-25.377 23.239-6.463 13.298-9.303 28.063-12.217 42.56-8.663 42.985-47.494 44.984-68.076 58.019-41.419 26.247-65.19 61.866-53.574 103.356 10.872 38.856 43.771 60.149 51.128 64.428 94.822 55.131 231.798 5.993 255.128-45.665 14.011-31.058 28.086-79.939-52.652-193.003"
                  style={{ mixBlendMode: "multiply" }}
                ></path>
                <defs>
                  <linearGradient
                    id="registration-blob_svg__a"
                    x1="141.355"
                    x2="272.91"
                    y1="78.709"
                    y2="352.775"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#F9E9E9"></stop>
                    <stop offset="1" stopColor="#EBBBBB"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Discount note */}
      <div className="max-w-5xl mx-auto text-center text-gray-500 text-sm mt-4">
        50% discount applies only to first year of new customer subscriptions.
        After the first year, a 20% discount applies to all yearly plans.
      </div>
      {/* Mobile App Section */}
      <div className="mt-16">
        <PartnersShowcase />
      </div>
      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto mt-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Frequently asked questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-xl font-bold mb-2">
              Will my credit card be charged right now?
            </div>
            <div className="text-gray-700">
              Dont worry! We won't charge your card. You may notice a temporary
              pre-authorization of $0.50 to verify your card. This hold will
              automatically disappear, and the amount will be returned to you
              within a week.
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-xl font-bold mb-2">
              Can I change my payment method later?
            </div>
            <div className="text-gray-700">
              Yes! You can change your payment method at any time.
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-xl font-bold mb-2">
              What happens after my free trial ends?
            </div>
            <div className="text-gray-700">
              If you do not downgrade or delete your account within the 14 days
              during your free trial, your account will automatically convert to
              a paid month-to-month or yearly subscription, depending on what
              you have selected when signing up.
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-xl font-bold mb-2">
              Can I cancel the trial at any time?
            </div>
            <div className="text-gray-700">
              Yes! You can cancel your trial anytime within the trial period.
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          {/* Provided SVG for FAQ section */}
          <svg
            width="180"
            height="100"
            viewBox="0 0 432 232"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M37.125 164C16.9817 164 .6524 147.658.6524 127.5S16.9817 91 37.125 91s36.4727 16.342 36.4727 36.5S57.2683 164 37.125 164z"
              fill="#E45562"
            ></path>
            <g clipPath="url(#clip0___BHfH9zXu)">
              <path
                d="M24.6352 128c0-5.5 5.3959-10 11.991-10 6.595 0 11.991 4.5 11.991 10s-5.396 10-11.991 10c-.9993 0-1.9985-.1-2.9978-.3l-5.5958 2.2c-.0999 0-.1998.1-.3997.1-.1998 0-.3997-.1-.5995-.2-.2998-.2-.3997-.6-.3997-.9l.4996-4.7c-1.5988-1.8-2.4981-4-2.4981-6.2zm9.9925 3h6.9947v-2h-6.9947v2zm-2.9978-4h9.9925v-2h-9.9925v2z"
                fill="#fff"
              ></path>
            </g>
            <path
              opacity=".1"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M426.277 2.8636c0 1.5816 1.281 2.8637 2.862 2.8637 1.58 0 2.861-1.2821 2.861-2.8637C432 1.2821 430.719 0 429.139 0c-1.581 0-2.862 1.282-2.862 2.8636zm-17.168 0c0 1.5816 1.281 2.8637 2.862 2.8637 1.58 0 2.861-1.2821 2.861-2.8637 0-1.5815-1.281-2.8636-2.861-2.8636-1.581 0-2.862 1.2821-2.862 2.8636zm-14.306 2.8637c-1.58 0-2.861-1.2821-2.861-2.8637 0-1.5815 1.281-2.8636 2.861-2.8636 1.58 0 2.862 1.282 2.862 2.8636s-1.282 2.8637-2.862 2.8637zm-20.034-2.8637c0 1.5816 1.281 2.8637 2.862 2.8637 1.58 0 2.861-1.2821 2.861-2.8637 0-1.5815-1.281-2.8636-2.861-2.8636-1.581 0-2.862 1.2821-2.862 2.8636zm-14.305 2.8637c-1.581 0-2.862-1.2821-2.862-2.8637 0-1.5815 1.281-2.8636 2.862-2.8636 1.58 0 2.861 1.2821 2.861 2.8636s-1.281 2.8637-2.861 2.8637zm-20.031-2.8637c0 1.5816 1.281 2.8637 2.861 2.8637 1.58 0 2.862-1.2821 2.862-2.8637 0-1.5815-1.282-2.8636-2.862-2.8636s-2.861 1.2821-2.861 2.8636zm-14.306 2.8637c-1.581 0-2.862-1.2821-2.862-2.8637 0-1.5815 1.281-2.8636 2.862-2.8636 1.58 0 2.861 1.2821 2.861 2.8636 0 1.5816-1.281 2.8637-2.861 2.8637zm-20.034-2.8637c0 1.5816 1.282 2.8637 2.862 2.8637s2.861-1.282 2.861-2.8637c0-1.5815-1.281-2.8636-2.861-2.8636-1.58 0-2.862 1.2821-2.862 2.8636zm123.046 20.0473c-1.581 0-2.862-1.2821-2.862-2.8637 0-1.5815 1.281-2.8636 2.862-2.8636 1.58 0 2.861 1.2821 2.861 2.8636 0 1.5816-1.281 2.8637-2.861 2.8637zm-20.03-2.8637c0 1.5816 1.281 2.8637 2.862 2.8637 1.58 0 2.861-1.2821 2.861-2.8637 0-1.5815-1.281-2.8636-2.861-2.8636-1.581 0-2.862 1.2821-2.862 2.8636zm-14.306 2.8637c-1.58 0-2.861-1.2821-2.861-2.8637 0-1.5815 1.281-2.8636 2.861-2.8636 1.58 0 2.862 1.2821 2.862 2.8636 0 1.5816-1.282 2.8637-2.862 2.8637zm-20.034-2.8637c0 1.5816 1.281 2.8637 2.862 2.8637 1.58 0 2.861-1.2821 2.861-2.8637 0-1.5815-1.281-2.8636-2.861-2.8636-1.581 0-2.862 1.2821-2.862 2.8636zm-14.305 2.8637c-1.581 0-2.862-1.2821-2.862-2.8637 0-1.5815 1.281-2.8636 2.862-2.8636 1.58 0 2.861 1.2821 2.861 2.8636 0 1.5816-1.281 2.8637-2.861 2.8637zm-20.031-2.8637c0 1.5816 1.281 2.8637 2.861 2.8637 1.58 0 2.862-1.2821 2.862-2.8637 0-1.5815-1.282-2.8636-2.862-2.8636s-2.861 1.2821-2.861 2.8636zm-14.306 2.8637c-1.581 0-2.862-1.2821-2.862-2.8637 0-1.5815 1.281-2.8636 2.862-2.8636 1.58 0 2.861 1.2821 2.861 2.8636 0 1.5816-1.281 2.8637-2.861 2.8637zm-20.034-2.8637c0 1.5816 1.282 2.8637 2.862 2.8637s2.861-1.282 2.861-2.8637c0-1.5815-1.281-2.8636-2.861-2.8636-1.58 0-2.862 1.2821-2.862 2.8636zm123.046 20.0472c-1.581 0-2.862-1.2821-2.862-2.8637 0-1.5815 1.281-2.8636 2.862-2.8636 1.58 0 2.861 1.2821 2.861 2.8636 0 1.5816-1.281 2.8637-2.861 2.8637zm-20.03-2.8637c0 1.5816 1.281 2.8637 2.862 2.8637 1.58 0 2.861-1.2821 2.861-2.8637 0-1.5815-1.281-2.8636-2.861-2.8636-1.581 0-2.862 1.2821-2.862 2.8636zm-14.306 2.8637c-1.58 0-2.861-1.2821-2.861-2.8637 0-1.5815 1.281-2.8636 2.861-2.8636 1.58 0 2.862 1.2821 2.862 2.8636 0 1.5816-1.282 2.8637-2.862 2.8637zm-20.034-2.8637c0 1.5816 1.281 2.8637 2.862 2.8637 1.58 0 2.861-1.2821 2.861-2.8637 0-1.5815-1.281-2.8636-2.861-2.8636-1.581 0-2.862 1.2821-2.862 2.8636zm-14.305 2.8637c-1.581 0-2.862-1.2821-2.862-2.8637 0-1.5815 1.281-2.8636 2.862-2.8636 1.58 0 2.861 1.2821 2.861 2.8636 0 1.5816-1.281 2.8637-2.861 2.8637zm-20.031-2.8637c0 1.5816 1.281 2.8637 2.861 2.8637 1.58 0 2.862-1.2821 2.862-2.8637 0-1.5815-1.282-2.8636-2.862-2.8636s-2.861 1.2821-2.861 2.8636zm-14.306 2.8637c-1.581 0-2.862-1.2821-2.862-2.8637 0-1.5815 1.281-2.8636 2.862-2.8636 1.58 0 2.861 1.2821 2.861 2.8636 0 1.5816-1.281 2.8637-2.861 2.8637zm-20.034-2.8637c0 1.5816 1.282 2.8637 2.862 2.8637s2.861-1.282 2.861-2.8637c0-1.5815-1.281-2.8636-2.861-2.8636-1.58 0-2.862 1.2821-2.862 2.8636zm123.046 20.0433c-1.581 0-2.862-1.2821-2.862-2.864 0-1.581 1.281-2.863 2.862-2.863 1.58 0 2.861 1.282 2.861 2.863 0 1.582-1.281 2.864-2.861 2.864zm-20.03-2.86c0 1.582 1.281 2.864 2.862 2.864 1.58 0 2.861-1.282 2.861-2.864 0-1.581-1.281-2.863-2.861-2.863-1.581 0-2.862 1.282-2.862 2.863zm-14.306 2.86c-1.58 0-2.861-1.282-2.861-2.864 0-1.581 1.281-2.863 2.861-2.863 1.58 0 2.862 1.282 2.862 2.863 0 1.582-1.282 2.864-2.862 2.864zm-20.034-2.86c0 1.582 1.281 2.864 2.862 2.864 1.58 0 2.861-1.282 2.861-2.864 0-1.581-1.281-2.863-2.861-2.863-1.581 0-2.862 1.282-2.862 2.863zm-14.305 2.86c-1.581 0-2.862-1.282-2.862-2.864 0-1.581 1.281-2.864 2.862-2.864 1.58 0 2.861 1.282 2.861 2.864 0 1.582-1.281 2.864-2.861 2.864zm-20.032-2.86c0 1.582 1.281 2.864 2.862 2.864 1.58 0 2.861-1.282 2.861-2.864 0-1.581-1.281-2.863-2.861-2.863-1.581 0-2.862 1.282-2.862 2.863zm-14.305 2.864c-1.581 0-2.862-1.282-2.862-2.864 0-1.581 1.281-2.864 2.862-2.864 1.58 0 2.861 1.282 2.861 2.864 0 1.582-1.281 2.864-2.861 2.864zm-20.034-2.868c0 1.582 1.281 2.864 2.862 2.864 1.58 0 2.861-1.282 2.861-2.864 0-1.581-1.281-2.863-2.861-2.863-1.581 0-2.862 1.282-2.862 2.863zm123.046 20.048c-1.581 0-2.862-1.282-2.862-2.864 0-1.581 1.281-2.864 2.862-2.864 1.58 0 2.861 1.283 2.861 2.864 0 1.582-1.281 2.864-2.861 2.864zm-20.03-2.864c0 1.582 1.281 2.864 2.862 2.864 1.58 0 2.861-1.282 2.861-2.864 0-1.581-1.281-2.864-2.861-2.864-1.581 0-2.862 1.283-2.862 2.864zm-14.306 2.864c-1.58 0-2.861-1.282-2.861-2.864 0-1.581 1.281-2.864 2.861-2.864 1.58 0 2.862 1.283 2.862 2.864 0 1.582-1.281 2.864-2.861 2.864zm-20.034-2.864c0 1.582 1.281 2.864 2.862 2.864 1.58 0 2.861-1.282 2.861-2.864 0-1.581-1.281-2.864-2.861-2.864-1.581 0-2.862 1.283-2.862 2.864z"
              fill="#000"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M317.59 165.5c-20.144 0-36.473-16.342-36.473-36.5s16.329-36.5 36.473-36.5c20.143 0 36.472 16.342 36.472 36.5s-16.329 36.5-36.472 36.5z"
              fill="#E45562"
            ></path>
            <g clipPath="url(#clip1___BHfH9zXu)">
              <path
                d="M316.341 118.963l-3.107 6.3-6.949 1.012a.8304.8304 0 00-.417.187.828.828 0 00-.254.378.8356.8356 0 00-.017.457c.037.15.116.288.227.396l5.029 4.9-1.187 6.926c-.026.153-.009.31.05.454.058.144.155.268.281.359.125.092.274.146.429.157.154.011.309-.021.446-.093l6.215-3.265 6.215 3.268c.137.072.292.104.447.092a.8214.8214 0 00.428-.157.8328.8328 0 00.281-.359.8296.8296 0 00.05-.454l-1.187-6.922 5.029-4.9c.111-.108.19-.246.227-.396a.8355.8355 0 00-.016-.457.8378.8378 0 00-.255-.378.831.831 0 00-.416-.187l-6.949-1.017-3.108-6.3a.834.834 0 00-.307-.338.8273.8273 0 00-.439-.126.8314.8314 0 00-.746.463z"
                fill="#fff"
              ></path>
            </g>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M176.528 232c-28.698 0-51.961-23.281-51.961-52s23.263-52 51.961-52c28.697 0 51.961 23.281 51.961 52s-23.264 52-51.961 52z"
              fill="#DD2A3B"
            ></path>
            <g clipPath="url(#clip2___BHfH9zXu)">
              <path
                d="M161.647 167.965c1.884-1.883 4.385-2.922 7.047-2.922s5.163 1.039 7.045 2.921c.024.024.049.048.073.074.024-.026.047-.049.071-.073 1.883-1.883 4.385-2.922 7.047-2.922s5.163 1.039 7.047 2.922c1.883 1.883 2.918 4.386 2.918 7.051 0 2.664-1.036 5.167-2.918 7.05l-14.165 14.176-14.165-14.176c-1.882-1.883-2.918-4.386-2.918-7.05 0-2.663 1.036-5.168 2.918-7.051z"
                fill="#fff"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0___BHfH9zXu">
                <path
                  fill="#fff"
                  transform="matrix(-1 0 0 1 48.6172 117)"
                  d="M0 0h23.982v24H0z"
                ></path>
              </clipPath>
              <clipPath id="clip1___BHfH9zXu">
                <path
                  fill="#fff"
                  transform="matrix(-1 0 0 1 329.078 117.5)"
                  d="M0 0h23.982v24H0z"
                ></path>
              </clipPath>
              <clipPath id="clip2___BHfH9zXu">
                <path
                  fill="#fff"
                  transform="matrix(-1 0 0 1 192.895 163.617)"
                  d="M0 0h34.1662v34.1918H0z"
                ></path>
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialPage;
