import { Link } from "react-router-dom";
import { FiBox, FiSmartphone, FiTag, FiHome, FiLayers } from "react-icons/fi";
import { TbMedicalCross } from "react-icons/tb";

const toolkitItems = [
  {
    icon: <FiBox className="w-7 h-7 text-[#0a7662] mb-2" />, // Inventory Management
    title: "Inventory Management",
    desc: `Track, organize, and manage all your business’s inventory.`,
    link: "/solutions/inventory-management",
    linkText: "See Inventory Management Solutions",
  },
  {
    icon: <FiSmartphone className="w-7 h-7 text-[#0a7662] mb-2" />, // Asset Tracking
    title: "Asset Tracking",
    desc: `Track your business’s assets, including equipment, tools, machinery, vehicles, and more.`,
    link: "/solutions/asset-tracking",
    linkText: "See Asset Tracking Solutions",
  },
  {
    icon: <TbMedicalCross className="w-7 h-7 text-[#0a7662] mb-2" />, // Supplies & Consumables
    title: "Supplies & Consumables",
    desc: `Track the supplies and raw materials your business consumes to provide its services.`,
    link: "/solutions/supplies-consumables",
    linkText: "See Supplies & Consumables Solutions",
  },
  {
    icon: <FiTag className="w-7 h-7 text-[#0a7662] mb-2" />, // Selling
    title: "Selling",
    desc: `Track the products and goods you sell to your customers.`,
    link: "/solutions/selling",
    linkText: "See Selling Solutions",
  },
  {
    icon: <FiHome className="w-7 h-7 text-[#0a7662] mb-2" />, // Home
    title: "Home",
    desc: `Track and inventory your personal belongings to stay organized during your move.`,
    link: "/solutions/home",
    linkText: "See Home Solutions",
  },
  {
    icon: <FiLayers className="w-7 h-7 text-[#0a7662] mb-2" />, // Industries
    title: "Industries",
    desc: `Find your industry and learn how Primarily can help your business track inventory and assets.`,
    link: "/solutions/industries",
    linkText: "See Industries Solutions",
  },
  {
    icon: <FiSmartphone className="w-7 h-7 text-[#0a7662] mb-2" />, // Mobile Inventory Tracking
    title: "Mobile Inventory Tracking",
    desc: `Manage inventory on the go with our easy-to-use mobile app.`,
    link: "/features/mobile-app",
    linkText: "Learn About Our Mobile App",
  },
  {
    icon: <FiTag className="w-7 h-7 text-[#0a7662] mb-2" />, // Barcoding
    title: "Barcoding",
    desc: `Manage inventory and assets with built-in QR & barcoding.`,
    link: "/features/barcoding",
    linkText: "Learn About Barcoding",
  },
];

const SolutionToolkit = () => (
  <section className="bg-white py-16 px-4">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 text-center">
        A business toolkit.
        <br className="hidden md:block" />
        For every business.
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {toolkitItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-start bg-white rounded-xl p-6 shadow-none hover:shadow-lg transition-shadow min-h-[180px]"
          >
            {item.icon}
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {item.title}
            </h3>
            <p className="text-gray-700 mb-3 text-base">{item.desc}</p>
            <Link
              to={item.link}
              className="text-[#0a7662] font-medium flex items-center gap-1 hover:underline text-base mt-auto"
            >
              {item.linkText}
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionToolkit;
