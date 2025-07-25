import {
  FiSmartphone,
  FiCloud,
  FiCheckCircle,
  FiCode,
  FiLock,
} from "react-icons/fi";

const features = [
  {
    icon: <FiSmartphone className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Easy-to-use Mobile App",
    desc: "Easy-to-use mobile app for iOS or Android.",
  },
  {
    icon: <FiCloud className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Cloud-based Automatic Sync",
    desc: "Cloud-based automatic sync ensures your team can seamlessly update inventory in real time from any device.",
  },
  {
    icon: <FiCheckCircle className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Offline Mobile Access",
    desc: "Offline mobile access so you can use Primarily in the field (and sync later).",
  },
  {
    icon: <FiCode className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "API",
    desc: "API access so you can connect your existing tools and data to Primarily.",
  },
  {
    icon: <FiLock className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "SSO (Single Sign-On)",
    desc: "SSO (Single sign-on) for maximum security.",
  },
];

const MobileTab = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {features.map((f, i) => (
      <div key={i} className="flex flex-col items-center text-center p-6">
        {f.icon}
        <h4 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h4>
        <p className="text-gray-700 text-base">{f.desc}</p>
      </div>
    ))}
  </div>
);

export default MobileTab;
