import React from "react";

const features = [
  {
    title: "Activity History Reports",
    image: "/reporting/Feature-Visual-1-3.png",
    description:
      "Activity History Reports let you monitor your team's changes and updates in Primarily.",
    highlight: true,
  },
  {
    title: "Inventory Summary Reports",
    image: "/reporting/Feature-Visual-2-3.png",
    description:
      "Inventory Summary Reports show you the total quantity and value of your inventory based on your custom filters.",
    highlight: true,
  },
  {
    title: "User Activity Summary Reports",
    image: "/reporting/Feature-Visual-3-3.png",
    description:
      "User Activity Summary Reports let you view a summary of each team member's actions and filter for specific activities within a given time period.",
    highlight: true,
  },
  {
    title: "Low Stock Reports",
    image: "/reporting/Feature-Visual-4-2.png",
    description:
      "Low Stock Reports show you all items that are below minimum quantity so you know how much to reorder.",
    highlight: true,
  },
  {
    title: "Move Summary Reports",
    image: "/reporting/Feature-Visual-5-1.png",
    description:
      "Move Summary Reports track all item location changes in a specified time period.",
    highlight: true,
  },
  {
    title: "Item Flow Report",
    image: "/reporting/Feature-Visual-6-1.png",
    description:
      "Item Flow Reports track all item quantity changes in a specified time period.",
    highlight: true,
  },
  {
    title: "Saved Reports",
    image: "/reporting/Feature-Visual-7.png",
    description:
      "Saved Reports allow you to go beyond preset report types and build customized reporting dashboards. Select the data you want to see and save your preferred filters and layouts.",
    highlight: true,
  },
  {
    title: "Report Subscriptions",
    image: "/reporting/Feature-Visual-8.png",
    description:
      "Report Subscriptions allow you to automate a summary of any report to be sent via email (one-time or ongoing).",
    highlight: true,
  },
];

const ReportSection = ({ imageSizeClass = "h-24 w-24" }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <div className="mb-8">
          <div className="text-[#0a7662] font-bold tracking-widest text-lg mb-2 uppercase">
            Report
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Run inventory reports.
          </h2>
          <p className="text-lg text-gray-700 max-w-xl mb-8 mx-auto">
            Get in-depth reports on items, folders, user histories, stock
            levels, and more.
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

export default ReportSection;
