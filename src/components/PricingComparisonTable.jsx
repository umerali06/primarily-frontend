import { FaCheck } from "react-icons/fa";

const plans = [
  {
    name: "Free",
    price: "$0 USD/mo",
    cta: "Sign Up",
    ctaType: "secondary",
  },
  {
    name: "Advanced",
    price: "$24 USD/mo",
    cta: "Start Free Trial",
    ctaType: "primary",
  },
  {
    name: "Ultra",
    price: "$74 USD/mo",
    cta: "Start Free Trial",
    ctaType: "primary",
  },
  {
    name: "Premium",
    price: "$149 USD/mo",
    cta: "Start Free Trial",
    ctaType: "primary",
  },
  {
    name: "Enterprise",
    price: "Get a Quote",
    cta: "Talk to Sales",
    ctaType: "secondary",
  },
];

const features = [
  {
    group: "ORGANIZE",
    items: [
      {
        name: "Unique Items",
        values: ["100", "500", "2,000", "5,000", "10,000+"],
      },
      { name: "User Licenses", values: ["1", "2", "5", "8", "12+"] },
      { name: "Inventory Import", values: [true, true, true, true, true] },
      { name: "Item Photos", values: [true, true, true, true, true] },
      { name: "Inventory Lists", values: [true, true, true, true, true] },
    ],
  },
  {
    group: "CUSTOMIZE",
    items: [
      { name: "Custom Fields", values: ["1", "5", "10", "20", "Unlimited"] },
      { name: "Custom Folders", values: [true, true, true, true, true] },
      { name: "Custom Tags", values: [true, true, true, true, true] },
      {
        name: "Custom Units of Measurement",
        values: [false, true, true, true, true],
      },
      {
        name: "Customizable User Access",
        values: [false, true, true, true, true],
      },
      {
        name: "Customizable Role Permissions",
        values: [false, false, false, true, true],
      },
      {
        name: "Limited Access Seats",
        values: [false, false, false, true, true],
      },
      {
        name: "Multi-account Access (MAA)",
        values: [false, false, false, false, true],
      },
    ],
  },
  {
    group: "MANAGE",
    items: [
      {
        name: "In-app Barcode & QR Code Scanning",
        values: [true, true, true, true, true],
      },
      {
        name: "3rd-party Scanner Support",
        values: [false, false, true, true, true],
      },
      {
        name: "QR Code Label Creation",
        values: [true, true, true, true, true],
      },
      {
        name: "Barcode Label Creation",
        values: [false, false, true, true, true],
      },
      {
        name: "Item Check-In/Check-out",
        values: [false, true, true, true, true],
      },
      { name: "Purchase Orders", values: [false, false, true, true, true] },
      { name: "Pick Lists", values: [false, false, true, true, true] },
    ],
  },
  {
    group: "TRACK AND UPDATE",
    items: [
      { name: "Low Stock Alerts", values: [false, true, true, true, true] },
      { name: "Date-based Alerts", values: [false, false, true, true, true] },
      { name: "Offline Mobile Access", values: [true, true, true, true, true] },
      { name: "Automatic Sync", values: [true, true, true, true, true] },
      { name: "In-app Alerts", values: [false, true, true, true, true] },
      { name: "Email Alerts", values: [false, true, true, true, true] },
    ],
  },
  {
    group: "REPORT",
    items: [
      {
        name: "Activity History Reports",
        values: [true, true, true, true, true],
      },
      {
        name: "Inventory Summary Reports",
        values: [true, true, true, true, true],
      },
      {
        name: "User Activity Summary Reports",
        values: [false, false, false, true, true],
      },
      { name: "Low Stock Reports", values: [false, false, true, true, true] },
      {
        name: "Move Summary Reports",
        values: [false, false, true, true, true],
      },
      { name: "Item Flow Reports", values: [false, false, true, true, true] },
      {
        name: "Quantity Change by Item Reports",
        values: [false, false, true, true, true],
      },
      { name: "Saved Reports", values: [false, false, false, true, true] },
      {
        name: "Report Subscriptions",
        values: [false, false, false, true, true],
      },
      {
        name: "Activity History",
        values: ["1 month", "1 year", "3 years", "Unlimited", "Unlimited"],
      },
      {
        name: "Transaction Reports",
        values: [
          "1-month limit",
          "1-year limit",
          "3-year limit",
          "Unlimited",
          "Unlimited",
        ],
      },
    ],
  },
  {
    group: "INTEGRATIONS",
    items: [
      { name: "QuickBooks Online", values: [false, false, false, true, true] },
      { name: "Slack", values: [false, false, false, true, true] },
      { name: "Webhooks", values: [false, false, false, true, true] },
      { name: "Microsoft Teams", values: [false, false, false, true, true] },
      { name: "API", values: [false, false, false, false, true] },
      { name: "SSO", values: [false, false, false, false, true] },
    ],
  },
  {
    group: "SUPPORT",
    items: [
      {
        name: "Help Center Resources & Tutorials",
        values: [true, true, true, true, true],
      },
      {
        name: "Weekly Onboarding Webinars",
        values: [true, true, true, true, true],
      },
      { name: "Email Support", values: [true, true, true, true, true] },
      {
        name: "Scheduled Phone Support",
        values: [false, false, false, true, true],
      },
      {
        name: "Onboarding Training Session",
        values: [false, false, false, true, true],
      },
      {
        name: "Dedicated Customer Success Manager",
        values: [false, false, false, false, true],
      },
    ],
  },
];

const PricingComparisonTable = () => (
  <section className="bg-[#fafafa] py-16 px-2 md:px-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-10">
        Compare Plans
      </h2>
      <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
        <table className="min-w-full text-sm md:text-base">
          <thead className="sticky top-0 z-10 bg-white border-b-2 border-gray-200">
            <tr>
              <th className="w-48 py-6 px-4 align-middle">
                <img
                  src="/logo-placeholder.svg"
                  alt="Primarily Logo"
                  className="h-10 mx-auto"
                />
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.name}
                  className="text-center font-extrabold text-lg text-gray-900 py-6 px-4"
                >
                  <div className="mb-1">{plan.name}</div>
                  <div className="text-base font-medium text-gray-700 mb-2">
                    {plan.price}
                  </div>
                  <button
                    className={`px-5 py-2 rounded-full font-semibold text-base transition-colors duration-200 focus:outline-none mb-2 ${
                      plan.ctaType === "primary"
                        ? "bg-[#0a7662] text-white hover:bg-[#075c4c]"
                        : "border border-[#0a7662] text-[#0a7662] hover:bg-[#e6f3f1]"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((group) => (
              <>
                <tr key={group.group}>
                  <td
                    colSpan={6}
                    className="bg-gray-800 text-white font-bold uppercase py-3 px-4 text-left text-sm md:text-base"
                  >
                    {group.group}
                  </td>
                </tr>
                {group.items.map((item) => (
                  <tr key={item.name} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-800 text-left whitespace-nowrap">
                      {item.name}
                    </td>
                    {item.values.map((val, pIdx) => (
                      <td key={pIdx} className="text-center py-3 px-4">
                        {val === true ? (
                          <FaCheck className="inline-block text-[#0a7662] w-5 h-5" />
                        ) : val === false ? (
                          <span className="inline-block w-5 h-5 text-gray-300">
                            —
                          </span>
                        ) : (
                          <span className="text-gray-900 font-semibold">
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default PricingComparisonTable;
