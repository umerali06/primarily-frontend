import React from "react";

const features = [
  {
    title: "Items",
    image: "/organize/Feature-Visual-1.png",
    description:
      "Item entries allow you to add your items and track custom details.",
    highlight: false,
  },
  {
    title: "Inventory Import",
    image: "/organize/Feature-Visual-2.png",
    description:
      "Inventory Import lets you upload an existing inventory spreadsheet and populate your items in Primarily instantly.",
    highlight: false,
  },
  {
    title: "Item Photos",
    image: "/organize/Feature-Visual-3.png",
    description:
      "Item Photos help you track the appearance and condition of your items.",
    highlight: true,
  },
  {
    title: "Inventory Lists",
    image: "/organize/Feature-Visual-4.png",
    description:
      "Inventory Lists summarize your entire inventory in one easy view.",
    highlight: false,
  },
  {
    title: "User Licenses",
    image: "/organize/Feature-Visual.png",
    description:
      "User licenses allow you to bring your employees into Primarily so you can manage inventory with your team.",
    highlight: false,
  },
];

const OrganizeSection = ({ imageSizeClass = "h-24 w-24" }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <div className="mb-8">
          <div className="text-[#0a7662] font-bold tracking-widest text-lg mb-2 uppercase">
            Organize
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Organize your inventory.
          </h2>
          <p className="text-lg text-gray-700 max-w-xl mb-8 mx-auto">
            Get organized by adding your inventory and inviting your team to
            Primarily.
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

export default OrganizeSection;
