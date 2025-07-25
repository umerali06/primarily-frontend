import { Link } from "react-router-dom";
import FeaturedHero from "../components/FeaturedHero";

const FeaturesPage = () => {
  const features = [
    {
      id: "inventory-management",
      title: "Inventory Management",
      description:
        "Easily track, organize, and manage your inventory with our intuitive software.",
      image: "/images/inventory-management.webp",
      link: "/features/inventory-management",
    },
    {
      id: "asset-tracking",
      title: "Asset Tracking",
      description:
        "Keep track of all your business assets with our powerful tracking tools.",
      image: "/images/asset-tracking.webp",
      link: "/features/asset-tracking",
    },
    {
      id: "qr-code-labels",
      title: "QR Code Labels",
      description:
        "Generate and print custom QR code labels for quick and easy inventory scanning.",
      image: "/images/qr-code-labels.webp",
      link: "/features/qr-code-labels",
    },
    {
      id: "inventory-app",
      title: "Inventory App",
      description:
        "Access your inventory on the go with our mobile app for iOS and Android.",
      image: "/images/inventory-app.webp",
      link: "/features/inventory-app",
    },
    {
      id: "low-stock-alerts",
      title: "Low Stock Alerts",
      description:
        "Get notified when your inventory is running low to avoid stockouts.",
      image: "/images/low-stock-alerts.webp",
      link: "/features/low-stock-alerts",
    },
    {
      id: "custom-fields",
      title: "Custom Fields",
      description:
        "Create custom fields to track the specific information that matters to your business.",
      image: "/images/custom-fields.webp",
      link: "/features/custom-fields",
    },
  ];

  return (
    <div className=" bg-gray-50">
      <FeaturedHero />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Primarily Features
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Discover all the powerful features that make Primarily the best
            inventory management solution for small businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-700 mb-4">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="text-[#0a7662] font-medium hover:text-[#0a7662] flex items-center"
                >
                  Learn more
                  <svg
                    className="ml-1 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/signup"
            className="bg-[#0a7662] text-white hover:bg-[#075c4c] transition-colors py-3 px-8 rounded-full font-medium inline-block"
          >
            Try Primarily Free for 14 Days
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
