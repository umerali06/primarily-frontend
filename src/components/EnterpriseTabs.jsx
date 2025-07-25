import { useState } from "react";
import {
  FiFolder,
  FiSettings,
  FiBarChart2,
  FiSmartphone,
  FiUsers,
} from "react-icons/fi";
import OrganizingTab from "./EnterpriseTabs/OrganizingTab";
import ManagingTab from "./EnterpriseTabs/ManagingTab";
import ReportingTab from "./EnterpriseTabs/ReportingTab";
import MobileTab from "./EnterpriseTabs/MobileTab";
import EnterpriseTab from "./EnterpriseTabs/EnterpriseTab";

const tabs = [
  { label: "Organizing", icon: <FiFolder className="w-5 h-5" /> },
  { label: "Managing", icon: <FiSettings className="w-5 h-5" /> },
  { label: "Reporting", icon: <FiBarChart2 className="w-5 h-5" /> },
  { label: "Mobile", icon: <FiSmartphone className="w-5 h-5" /> },
  { label: "Enterprise", icon: <FiUsers className="w-5 h-5" /> },
];

const tabComponents = [
  OrganizingTab,
  ManagingTab,
  ReportingTab,
  MobileTab,
  EnterpriseTab,
];

const EnterpriseTabs = () => {
  const [active, setActive] = useState(0);
  const ActiveComponent = tabComponents[active];

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-8">
          About Primarily for enterprise.
        </h2>
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 mb-12">
          <nav className="flex justify-center gap-2 md:gap-8">
            {tabs.map((tab, idx) => (
              <button
                key={tab.label}
                onClick={() => setActive(idx)}
                className={`flex items-center gap-2 px-2 md:px-6 py-3 text-lg font-semibold border-b-2 transition-colors duration-200 ${
                  active === idx
                    ? "border-[#0a7662] text-[#0a7662]"
                    : "border-transparent text-gray-700 hover:text-[#0a7662]"
                }`}
                aria-selected={active === idx}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div>
          <ActiveComponent />
        </div>
      </div>
    </section>
  );
};

export default EnterpriseTabs;
