import {
  FiUsers,
  FiBarChart2,
  FiAlertCircle,
  FiTrendingUp,
  FiFileText,
  FiStar,
  FiCode,
  FiLock,
  FiClipboard,
} from "react-icons/fi";

const features = [
  {
    icon: <FiUsers className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Activity Report",
    desc: "Activity reports allow you to keep tabs on all users’ changes to items, folders, tags, and more.",
  },
  {
    icon: <FiBarChart2 className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Inventory Summary Report",
    desc: "Inventory summary reports allow you to quickly see the total quantity and value of your inventory based on selected filters.",
  },
  {
    icon: <FiAlertCircle className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Low Stock Report",
    desc: "Low stock reports allow you to see all items that are below set minimums so you can re-order the right amount at the right time.",
  },
  {
    icon: <FiTrendingUp className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Item Flow Report",
    desc: "Item flow report gives you a full picture of all quantity changes for your items during a specified time period.",
  },
  {
    icon: <FiClipboard className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Move Summary Report",
    desc: "Move summary reports give you a record of all inventory location changes during a specified time period.",
  },
  {
    icon: <FiFileText className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Transaction Report",
    desc: "Transaction reports provide a full picture of all inventory transactions, including quantity changes, additions, and deletions.",
  },
  {
    icon: <FiFileText className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Saved Reports",
    desc: "Saved reports allow you to customize and automate preferred report filters and layouts for any report type. Display the data you need, in the format you want, instantly.",
  },
  {
    icon: <FiStar className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Customizable Roles",
    desc: "Custom Roles enable you to define the user experience by creating a new role and tailoring what this role can add, edit, hide, or delete in Primarily.",
  },
  {
    icon: <FiCode className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "API",
    desc: "API access so you can connect your existing tools and data to Primarily.",
  },
  {
    icon: <FiStar className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Report subscription",
    desc: "Report subscription let you set up any saved report to run regularly and automatically deliver to your email.",
  },
  {
    icon: <FiLock className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "SSO (Single Sign-On)",
    desc: "SSO (Single sign-on) for maximum security.",
  },
];

const EnterpriseTab = () => (
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

export default EnterpriseTab;
