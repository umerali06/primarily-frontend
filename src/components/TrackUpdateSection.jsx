import React from "react";

const features = [
  {
    title: "Low Stock Alerts",
    image: "/track and update/Feature-Visual-1-4.png",
    description:
      "Low Stock Alerts notify you when an item is running low so you always reorder the right amount.",
    highlight: true,
  },
  {
    title: "Date-Based Alerts",
    image: "/track and update/Feature-Visual-2-4.png",
    description:
      "Date-based Alerts let you track maintenance and repair schedules for assets, tools, and equipment.",
    highlight: true,
  },
  {
    title: "Offline Mobile Access",
    image: "/track and update/Feature-Visual-3-4.png",
    description:
      "Offline Mobile Access lets you stock and update inventory even when you're offline or out of range.",
    highlight: true,
  },
  {
    title: "Automatic Sync",
    image: "/track and update/Feature-Visual-4-3.png",
    description:
      "Automatic Sync lets you and your team track and update inventory in real time from any device.",
    highlight: false,
  },
  {
    title: "In-App Alerts",
    image: "/track and update/Feature-Visual-5-2.png",
    description:
      "In-App Alerts nudge you and your team in Primarily when it's time to reorder or repair.",
    highlight: true,
  },
  {
    title: "Email Alerts",
    image: "/track and update/Feature-Visual-9.png",
    description:
      "Email Alerts nudge you and your team via email when it's time to reorder or repair.",
    highlight: false,
  },
];

const TrackUpdateSection = ({ imageSizeClass = "h-24 w-24" }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <div className="mb-8">
          <div className="text-[#0a7662] font-bold tracking-widest text-lg mb-2 uppercase">
            Track & Update
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Track & update your inventory.
          </h2>
          <p className="text-lg text-gray-700 max-w-xl mb-8 mx-auto">
            Seamlessly update inventory and set alerts to ensure you always
            stock the right amount.
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

export default TrackUpdateSection;
