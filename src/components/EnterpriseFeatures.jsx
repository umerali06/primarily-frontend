import { FaCheck } from "react-icons/fa";

const keyFeatures = [
  "Track large volumes of assets, inventory, tools, equipment, and more.",
  "Get an instant, real-time view of your entire inventory, even across multiple locations.",
  "Create invoices and purchase orders using your inventory details for end-to-end inventory management.",
];

const supportFeatures = [
  "Get custom account set up and onboarding from your dedicated Account Manager.",
  "Get your team up to speed with customized training sessions.",
  "Receive data migration assistance to import existing inventory data.",
];

const mobileFeatures = [
  "Simple mobile app your whole team can use—no extra equipment required.",
  "Built-in handheld scanner capability so you can check items in and out instantly.",
  "Cross-device syncing so your team can update inventory in real time, in the office or in the field.",
];

const EnterpriseFeatures = () => (
  <section className="bg-white py-20 px-4">
    <div className="max-w-6xl mx-auto flex flex-col gap-24">
      {/* Key Features */}
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 text-left">
            Why use Primarily for your large business?
          </h2>
          <div className="font-bold text-gray-800 mb-2">
            <span className="text-[#0a7662]">Key Features</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">
            Simple yet powerful features.
          </h3>
          <ul className="space-y-6 mb-2">
            {keyFeatures.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-lg text-gray-800"
              >
                <FaCheck className="text-[#0a7662] mt-1 w-5 h-5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="/enterprise/enterprise-teams.png"
            alt="Enterprise Teams"
            className="max-w-full rounded-xl shadow-lg"
          />
        </div>
      </div>
      {/* Support and Training */}
      <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
        <div className="flex-1">
          <div className="font-bold text-gray-800 mb-2">
            <span className="text-gray-900">Support and </span>
            <span className="text-[#0a7662]">Training</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">
            Receive custom training & onboarding.
          </h3>
          <ul className="space-y-6 mb-2">
            {supportFeatures.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-lg text-gray-800"
              >
                <FaCheck className="text-[#0a7662] mt-1 w-5 h-5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="/enterprise/enterprise-support.png"
            alt="Enterprise Support"
            className="max-w-full rounded-xl shadow-lg"
          />
        </div>
      </div>
      {/* Mobile Functionality */}
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 flex justify-center">
          <img
            src="/enterprise/enterprise-mobile-720x540.png"
            alt="Enterprise Mobile"
            className="max-w-full rounded-xl shadow-lg"
          />
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-800 mb-2">
            <span className="text-gray-900">Mobile </span>
            <span className="text-[#0a7662]">Functionality</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">
            Mobile access from anywhere.
          </h3>
          <ul className="space-y-6 mb-2">
            {mobileFeatures.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-lg text-gray-800"
              >
                <FaCheck className="text-[#0a7662] mt-1 w-5 h-5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default EnterpriseFeatures;
