import { Link } from "react-router-dom";
import {
  FiArchive,
  FiCamera,
  FiBarChart2,
  FiRefreshCw,
  FiArrowRight,
  FiCheckSquare,
  FiFolderPlus,
} from "react-icons/fi";

const features = [
  {
    id: "organizing",
    eyebrow: "Organizing",
    icon: <FiFolderPlus className="h-8 w-8 text-[#0a7662]" />,
    title: "Organize and automate your inventory at the touch of a button.",
    points: [
      "Easily upload your existing inventory list into Primarily.",
      "Organize inventory folders by location, type, and more.",
      "Add critical item details with custom fields.",
    ],
    image: "/featured/all_items_table-950x613.png",
    buttons: true,
  },
  {
    id: "managing",
    eyebrow: "Managing",
    icon: <FiCamera className="h-8 w-8 text-[#0a7662]" />,
    title: "Track and manage your entire inventory with one easy app.",
    points: [
      "Speed up inventory counts with in-app barcode and QR code scanner.",
      "Upload high-resolution photos to visually track each item.",
      "Get alerted when you're running low on stock.",
    ],
    image: "/featured/item_details_construction-950x613.png",
    buttons: true,
  },
  {
    id: "reporting",
    eyebrow: "Reporting",
    icon: <FiBarChart2 className="h-8 w-8 text-[#0a7662]" />,
    title: "Get real-time reporting insights.",
    points: [
      "Get in-depth data on items, folders, and user histories.",
      "Easily export custom PDF or CSV reports.",
      "Perfect for audits, budgeting, and forecasting.",
    ],
    image: "/featured/primarily_report_2-1-1-950x613.png",
    buttons: true,
  },
  {
    id: "synchronization",
    eyebrow: "Synchronization",
    icon: <FiRefreshCw className="h-8 w-8 text-[#0a7662]" />,
    title: "Automatically sync your inventory across all devices, all teams.",
    description:
      "Use Primarily on mobile, desktop, or tablet, thanks to automatic, cloud-based syncing. You and your team can update inventory in real time from any location.",
    image: "/featured/overflow-screens-950x599.png",
    buttons: false,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            id={feature.id}
            className={`flex flex-col ${
              index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center mb-24 last:mb-0`}
          >
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:px-8">
              <div className="flex items-center mb-4">
                {feature.icon}
                <span className="text-[#0a7662] font-semibold text-lg ml-3">
                  {feature.eyebrow}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                {feature.title}
              </h3>
              {feature.points ? (
                <ul className="space-y-4 mb-8">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <FiCheckSquare className="h-6 w-6 text-[#0a7662] mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-lg">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 text-lg mb-8">
                  {feature.description}
                </p>
              )}
              {/* Buttons row */}
              {feature.buttons ? (
                <div className="flex flex-row gap-4 mt-4">
                  <Link
                    to="/signup"
                    className="bg-[#0a7662] hover:bg-[#075c4c] text-white font-medium py-3 px-8 rounded-full transition-colors text-base shadow-md text-center"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    to="/features"
                    className="flex items-center text-[#0a7662] font-medium text-base hover:text-[#0a7662] transition-colors"
                  >
                    See All Features <FiArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-row justify-end mt-4">
                  <Link
                    to="/plans"
                    className="bg-[#0a7662] hover:bg-[#075c4c] text-white font-medium py-3 px-8 rounded-full transition-colors text-base shadow-md text-center"
                  >
                    See All Plans{" "}
                    <FiArrowRight className="ml-2 w-5 h-5 inline" />
                  </Link>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
