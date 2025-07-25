import React from "react";

const features = [
  {
    title: "QuickBooks Online",
    image: "/integration/Group-11826-1-480x347.png",
    description:
      "The integration with QuickBooks Online allows you to easily send invoices and purchase orders to your existing QBO account.",
    highlight: "text-primary",
  },
  {
    title: "Slack",
    image: "/integration/Group-11827-1-480x347.png",
    description:
      "The integration with Slack allows your team to receive notifications about changes to inventory directly in a Slack channel.",
    highlight: "text-[#E01E5A]", // Slack pink
  },
  {
    title: "Webhooks",
    image: "/integration/Group-11828-1-480x347.png",
    description:
      "The integration with Webhooks allows you to automate messages when an event occurs in Primarily.",
    highlight: "text-pink-500",
  },
  {
    title: "Microsoft Teams",
    image: "/integration/Group-11829-1-480x347.png",
    description:
      "The integration with Microsoft Teams allows your team to receive notifications about changes to inventory directly in a Teams channel.",
    highlight: "text-primary",
  },
  {
    title: "API",
    image: "/integration/Group-60584-2-480x347.png",
    description:
      "The Primarily API allows other software applications to access data from your Primarily account outside of Primarily.",
    highlight: "text-primary",
  },
];

const IntegrationSection = ({ imageSizeClass = "h-24 w-24" }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <div className="mb-8">
          <div className="text-[#0a7662] font-bold tracking-widest text-lg mb-2 uppercase">
            Integrations
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Set up integrations.
          </h2>
          <p className="text-lg text-gray-700 max-w-xl mb-8 mx-auto">
            Speed up processes and save time by integrating Primarily with your
            favorite platforms.
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
                className={`${imageSizeClass} mb-4`}
                style={{ filter: "none" }}
              />
              <h3 className={`text-xl font-bold mb-2 ${feature.highlight}`}>
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

export default IntegrationSection;
