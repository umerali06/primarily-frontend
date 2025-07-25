import React from "react";

const features = [
  {
    title: "Custom Fields",
    image: "/customize/Feature-Visual-1-1.png",
    description:
      "Custom Fields allow you to track and customize unique information about your items.",
    highlight: true,
  },
  {
    title: "Custom Folders",
    image: "/customize/Feature-Visual-2-1.png",
    description:
      "Custom Folders allow you to organize your items exactly how you want them.",
    highlight: true,
  },
  {
    title: "Custom Tags",
    image: "/customize/Feature-Visual-3-1.png",
    description:
      "Custom Tags allow you to add custom categories for your items, even if they're in different folders.",
    highlight: false,
  },
  {
    title: "Customizable User Access",
    image: "/customize/Feature-Visual-4-1.png",
    description:
      "Customizable User Access lets you control who can do and see what in Primarily.",
    highlight: false,
  },
  {
    title: "Customizable Roles",
    image: "/customize/Feature-Visual-5.png",
    description:
      "Custom Roles enable you to define the user experience by creating new roles and tailoring what the role can add, edit, hide, or delete in Primarily.",
    highlight: true,
  },
];

const CustomizeSection = ({ imageSizeClass = "h-24 w-24" }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <div className="mb-8">
          <div className="text-primarily-500 font-bold tracking-widest text-lg mb-2 uppercase">
            Customize
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Customize your inventory.
          </h2>
          <p className="text-lg text-gray-700 max-w-xl mb-8 mx-auto">
            Customize your inventory system with folders and add custom details,
            tags, and user access.
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
                  feature.highlight ? "text-primarily-500" : "text-gray-900"
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

export default CustomizeSection;
