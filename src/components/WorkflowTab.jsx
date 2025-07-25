import React from "react";
import { TbClipboardList, TbShoppingCart } from "react-icons/tb";

const workflows = [
  {
    key: "picklists",
    title: "Pick Lists",
    desc: "Easily request items for pickup with Primarily's Pick Lists. Create a list, add items, and assign it to a user for review or pickup. Quantities update automatically after items are picked.",
    icon: <TbClipboardList className="text-3xl text-gray-400" />,
    new: false,
  },
  {
    key: "purchaseorders",
    title: "Purchase Orders",
    desc: "Simplify your procurement process by easily creating, managing, and tracking purchase orders. This is the hub for that.",
    icon: <TbShoppingCart className="text-3xl text-gray-400" />,
    new: true,
  },
];

const WorkflowTab = ({ GREEN }) => (
  <div className="flex flex-col h-full w-full p-12">
    <h1 className="text-4xl font-bold mb-2" style={{ color: GREEN.main }}>
      Workflows
    </h1>
    <div className="text-gray-500 text-lg mb-8">
      Workflows are actions you can take on your inventory that interact with
      quantities.
    </div>
    <div className="flex gap-8">
      {workflows.map((wf) => (
        <div
          key={wf.key}
          className="bg-white rounded-2xl shadow p-8 flex flex-col w-96 relative border border-gray-100"
        >
          <div className="flex items-center mb-4">
            {wf.icon}
            {wf.new && (
              <span className="ml-auto px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold flex items-center gap-1">
                <span className="text-primary text-base">★</span> New
              </span>
            )}
          </div>
          <div className="font-bold text-2xl text-gray-800 mb-2">
            {wf.title}
          </div>
          <div className="text-gray-500 text-base leading-relaxed">
            {wf.desc}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WorkflowTab;
