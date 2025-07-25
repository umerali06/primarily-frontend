import {
  FiClipboard,
  FiBarChart2,
  FiLink,
  FiFileText,
  FiTag,
  FiRefreshCw,
  FiCheckSquare,
  FiBell,
  FiMail,
} from "react-icons/fi";

const features = [
  {
    icon: <FiClipboard className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Pick Lists",
    desc: "Create a pick list to ensure your team grabs the right items from your inventory, every time.",
  },
  {
    icon: <FiBarChart2 className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Barcode & QR Code Scanning",
    desc: "Barcode & QR code scanning so you can scan items right from your smartphone.",
  },
  {
    icon: <FiLink className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "QuickBooks Online Integration",
    desc: "Easily send invoices and purchase orders to your existing QBO account.",
  },
  {
    icon: <FiFileText className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Purchase Orders",
    desc: "Create a purchase order using your inventory details for end-to-end inventory management.",
  },
  {
    icon: <FiTag className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Label Generation",
    desc: "Label generation so you can add barcode labels to physical inventory.",
  },
  {
    icon: <FiRefreshCw className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Check-in/Check-out",
    desc: "Use the in-app scanner to check items in and out and ensure they’re returned to the correct locations.",
  },
  {
    icon: <FiBarChart2 className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Quantity-based alerts",
    desc: "Quantity-based alerts to notify you when an item falls below a set threshold (so you know when and how much to re-order).",
  },
  {
    icon: <FiClipboard className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Date-based Alerts",
    desc: "Date-based alerts so you can schedule maintenance and repairs for valuable equipment and assets.",
  },
  {
    icon: <FiBell className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "In-app Alerts",
    desc: "In-app alerts to notify you of your alerts while you’re using the Primarily app.",
  },
  {
    icon: <FiMail className="w-8 h-8 text-[#0a7662] mb-2" />,
    title: "Email Alerts",
    desc: "Email alerts to notify you via email of your alerts.",
  },
];

const ManagingTab = () => (
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

export default ManagingTab;
