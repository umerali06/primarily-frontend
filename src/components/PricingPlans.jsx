import { useState } from "react";
import {
  FaPaperPlane,
  FaRocket,
  FaUserAstronaut,
  FaRegSmileBeam,
} from "react-icons/fa";
import { GiUfo } from "react-icons/gi";
import { MdFlight } from "react-icons/md";

const plans = [
  {
    name: "Free",
    icon: <FaPaperPlane className="w-14 h-14 text-[#0a7662] mx-auto" />,
    desc: "Best for getting started.",
    price: "$0",
    priceUnit: "USD/mo.",
    features: ["100 Unique Items", "1 User License"],
    cta: "Sign Up",
    ctaType: "primary",
    highlight: false,
  },
  {
    name: "Advanced",
    icon: <FaRegSmileBeam className="w-14 h-14 text-[#0a7662] mx-auto" />,
    desc: "Best for maintaining optimal inventory levels.",
    price: "$24",
    priceUnit: "USD/mo.*",
    save: "You’ll save $300! Billed at $288/yr.",
    features: [
      "500 Unique Items",
      "2 User Licenses",
      "+ Unlimited QR Code Label Creation",
    ],
    cta: "Start Free Trial",
    ctaType: "primary",
    secondaryCta: "Buy Now",
    highlight: false,
  },
  {
    name: "Ultra",
    icon: <MdFlight className="w-14 h-14 text-[#0a7662] mx-auto" />,
    desc: "Best for simplifying day-to-day inventory tasks.",
    price: "$74",
    priceUnit: "USD/mo.*",
    save: "You’ll save $900! Billed at $888/yr.",
    features: [
      "2,000 Unique Items",
      "5 User Licenses",
      "+ Unlimited QR Code & Barcode Label Creation",
      "+ Purchase Orders",
    ],
    cta: "Start Free Trial",
    ctaType: "primary",
    secondaryCta: "Buy Now",
    highlight: true,
    highlightLabel: "Most Popular",
  },
  {
    name: "Premium",
    icon: <FaRocket className="w-14 h-14 text-[#0a7662] mx-auto" />,
    desc: "Best for streamlining inventory processes and oversight.",
    price: "$149",
    priceUnit: "USD/mo.*",
    save: "You’ll save $1800! Billed at $1788/yr.",
    features: [
      "5,000 Unique Items",
      "8 User Licenses",
      "+ Customizable Role Permissions",
      "+ QuickBooks Online Integration",
    ],
    cta: "Start Free Trial",
    ctaType: "primary",
    secondaryCta: "Talk to Sales",
    highlight: false,
  },
  {
    name: "Enterprise",
    icon: <GiUfo className="w-14 h-14 text-[#0a7662] mx-auto" />,
    desc: "Best for customized inventory processes and control.",
    price: "Get a Quote",
    priceUnit: "",
    features: [
      "10,000+ Unique Items",
      "12+ User Licenses",
      "+ API and Webhooks",
      "+ Dedicated Customer Success Manager",
    ],
    cta: "Talk to Sales",
    ctaType: "secondary",
    highlight: false,
  },
];

const PricingPlans = () => {
  const [yearly, setYearly] = useState(true);

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">
          Start Your 14-Day Free Trial Today.
        </h2>
        <p className="text-lg text-gray-700 text-center mb-8 max-w-2xl mx-auto">
          Transform how your business does inventory with our powerful,
          easy-to-use solution. Find the right Primarily plan for you.
        </p>
        {/* Toggle */}
        <div className="flex justify-center items-center mb-12">
          <div className="relative flex items-center bg-gray-100 rounded-full p-1">
            {yearly && (
              <span className="absolute -top-7 left-0 text-xs text-white bg-[#0a7662] rounded-full px-2 py-0.5 font-semibold shadow-md animate-bounce z-10">
                Save 50%
              </span>
            )}
            <button
              className={`px-6 py-2 rounded-full font-semibold text-base transition-colors duration-200 focus:outline-none ${
                yearly ? "bg-[#0a7662] text-white shadow" : "text-gray-700"
              }`}
              onClick={() => setYearly(true)}
            >
              Yearly
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold text-base transition-colors duration-200 focus:outline-none ${
                !yearly ? "bg-[#0a7662] text-white shadow" : "text-gray-700"
              }`}
              onClick={() => setYearly(false)}
            >
              Monthly
            </button>
          </div>
        </div>
        {/* Plans Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col items-center bg-white rounded-2xl shadow-md border ${
                plan.highlight
                  ? "border-[#0a7662] shadow-lg scale-105 z-10"
                  : "border-gray-200"
              } px-6 py-8 relative transition-transform duration-200`}
            >
              {plan.highlight && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0a7662] text-white text-xs font-bold px-6 py-2 rounded-t-2xl shadow-md">
                  {plan.highlightLabel}
                </div>
              )}
              <div className="mb-4">{plan.icon}</div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-1 text-center">
                {plan.name}
              </h3>
              <p className="text-gray-700 mb-4 text-center min-h-[48px]">
                {plan.desc}
              </p>
              <div className="text-3xl font-extrabold text-gray-900 mb-1 text-center">
                {plan.price}
              </div>
              {plan.priceUnit && (
                <div className="text-base text-gray-700 mb-1 text-center">
                  {plan.priceUnit}
                </div>
              )}
              {plan.save && (
                <div className="text-xs text-[#0a7662] font-semibold mb-2 text-center">
                  {plan.save}
                </div>
              )}
              <div className="w-full border-t border-gray-200 my-4"></div>
              <ul className="w-full mb-6 space-y-2">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-gray-800 text-base"
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-[#0a7662] mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 w-full">
                <button
                  className={`w-full py-3 rounded-full font-semibold text-base transition-colors duration-200 focus:outline-none ${
                    plan.ctaType === "primary"
                      ? "bg-[#0a7662] text-white hover:bg-[#075c4c]"
                      : "border border-[#0a7662] text-[#0a7662] hover:bg-[#e6f3f1]"
                  }`}
                >
                  {plan.cta}
                </button>
                {plan.secondaryCta && (
                  <button className="w-full py-3 rounded-full font-semibold text-base border border-[#0a7662] text-[#0a7662] hover:bg-[#e6f3f1] transition-colors duration-200 focus:outline-none">
                    {plan.secondaryCta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-8 max-w-2xl mx-auto text-center">
          * 50% discount applies only to first year of new customer
          subscriptions. After the first year, a 20% discount applies to all
          yearly plans.
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
