import React from "react";

const features = [
  {
    title: "Pick Lists",
    image: "/manage/Feature-Visual-1-2.png",
    description:
      "Pick lists let you quickly create lists of items from your inventory, ensuring your team grabs the right items every time.",
    highlight: true,
  },
  {
    title: "Barcode Scanning & Label Generation",
    image: "/manage/Feature-Visual-2-2.png",
    description:
      "Barcoding lets you scan barcodes from your smartphone to instantly add and manage your items. Plus, generate and print custom barcode labels with ease.",
    highlight: true,
  },
  {
    title: "QR Code Scanning & Label Generation",
    image: "/manage/Feature-Visual-3-2.png",
    description:
      "QR Coding lets you scan QR codes from your smartphone to instantly add and manage your items. Plus, generate and print custom QR labels with ease.",
    highlight: true,
  },
  {
    title: "Purchase Orders",
    image: "/manage/Group-60585-1.png",
    description:
      "Create and export Purchase Orders using inventory details like item names, photos, costs, quantities, and more.",
    highlight: true,
  },
  {
    title: "Item Check-in/Check-out",
    image: "/manage/Group-60631-1.png",
    description:
      "Check-In / Check-Out lets your team manage items so you always know who had what, when, and ensure they're returned to the right locations.",
    highlight: false,
  },
];

const ManageSection = ({ imageSizeClass = "h-24 w-24" }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <div className="mb-8">
          <div className="text-[#0a7662] font-bold tracking-widest text-lg mb-2 uppercase">
            Manage
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Manage your inventory.
          </h2>
          <p className="text-lg text-gray-700 max-w-xl mb-8 mx-auto">
            Scan in new items with barcodes and QR codes and print custom labels
            to track unique items
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl items-center justify-items-center">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center bg-gray-100 rounded-2xl p-8 h-full min-h-[220px] shadow-sm"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className={`${imageSizeClass} mb-4 ${
                  feature.highlight ? "filter-none" : "filter grayscale"
                }`}
                style={
                  feature.highlight
                    ? { filter: "none" }
                    : { filter: "grayscale(1)" }
                }
              />
              <h3
                className={`text-xl font-bold mb-2 ${
                  feature.highlight ? "text-[#0a7662]" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h3>
              <p className="text-gray-700 text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManageSection;
