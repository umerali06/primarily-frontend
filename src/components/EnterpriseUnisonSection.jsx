import React from "react";

const cards = [
  {
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="8" y="32" width="48" height="20" rx="2" fill="#E53935" />
        <rect x="12" y="20" width="40" height="16" rx="2" fill="#E53935" />
        <rect x="20" y="12" width="24" height="8" rx="2" fill="#E53935" />
      </svg>
    ),
    border: "border-green-300",
    bg: "bg-white",
  },
  {
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="16" y="40" width="12" height="12" rx="2" fill="#44475A" />
        <rect x="36" y="40" width="12" height="12" rx="2" fill="#44475A" />
        <rect x="16" y="24" width="12" height="12" rx="2" fill="#44475A" />
        <rect x="36" y="24" width="12" height="12" rx="2" fill="#44475A" />
        <rect x="26" y="32" width="12" height="12" rx="2" fill="#44475A" />
      </svg>
    ),
    border: "border-gray-200",
    bg: "bg-gray-50",
  },
  {
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="16" y="32" width="32" height="20" rx="2" fill="#44475A" />
        <rect x="24" y="20" width="16" height="8" rx="2" fill="#44475A" />
        <rect x="28" y="12" width="8" height="8" rx="2" fill="#44475A" />
      </svg>
    ),
    border: "border-gray-200",
    bg: "bg-gray-50",
  },
];

const EnterpriseUnisonSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4">
          Everything you do
          <br className="hidden md:block" /> works in unison.
        </h2>
        <p className="text-center text-lg text-gray-700 max-w-2xl mb-12">
          You can use{" "}
          <a href="#" className="text-[#0a7662] font-medium hover:underline">
            Primarily
          </a>{" "}
          to track inventory and assets anywhere—from{" "}
          <span className="text-[#0a7662]">warehouses</span> and{" "}
          <span className="text-[#0a7662]">factories</span> to{" "}
          <span className="text-[#0a7662]">offices</span> and{" "}
          <span className="text-[#0a7662]">retail</span> locations.
        </p>

        {/* Decorative image for large screens */}
        <img
          src="/enterprise/enterprise-unison.png"
          alt="Enterprise Unison Illustration"
          className="mt-16 max-w-2xl w-full hidden md:block"
          draggable="false"
        />
      </div>
    </section>
  );
};

export default EnterpriseUnisonSection;
