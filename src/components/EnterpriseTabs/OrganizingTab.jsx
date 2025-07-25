import {
  FiUpload,
  FiBox,
  FiImage,
  FiFolder,
  FiTag,
  FiFileText,
  FiUsers,
  FiSettings,
  FiClock,
} from "react-icons/fi";

const features = [
  {
    icon: <FiUpload className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Easy Inventory Import",
    desc: "Easy inventory import transfers your existing inventory into Primarily with the touch of a button.",
  },
  {
    icon: <FiBox className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Items",
    desc: "Enter your items and track key details about them, such as quantity, location, and cost.",
  },
  {
    icon: <FiImage className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Item Photos",
    desc: "Add item photos to your entries to create a visual inventory and track appearance and condition details.",
  },
  {
    icon: <FiFolder className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Custom Folders",
    desc: "Custom folders so you can organize your stuff exactly how you want it.",
  },
  {
    icon: <FiTag className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Custom Fields",
    desc: "Custom fields so you can track the unique details that matter to you and custom-segment your items.",
  },
  {
    icon: <FiFileText className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Inventory Lists",
    desc: "Inventory lists perfect for audits, budgeting, or forecasting.",
  },
  {
    icon: <FiUsers className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "User Licenses",
    desc: "User licenses so you can collaborate with your team and even your clients.",
  },
  {
    icon: <FiSettings className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Customizable User Access",
    desc: "Customizable user access ensures you share the right info with the right people.",
  },
  {
    icon: <FiClock className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Activity History",
    desc: "Activity history provides visibility into user updates so you know who did what, and when.",
  },
];

const OrganizingTab = () => (
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

export default OrganizingTab;
