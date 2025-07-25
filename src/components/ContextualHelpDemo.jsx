import React, { useState } from "react";
import FormFieldWithHelp from "./FormFieldWithHelp";
import FieldHelp from "./FieldHelp";
import Tooltip from "./Tooltip";
import { TbInfoCircle, TbHelpCircle, TbAlertCircle } from "react-icons/tb";

/**
 * Demo component for contextual help features
 */
const ContextualHelpDemo = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    location: "",
    unit: "pieces",
    category: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "number" ? (value ? parseFloat(value) : "") : value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.quantity && formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }

    if (formData.price && formData.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert("Form submitted successfully!");
      console.log("Form data:", formData);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Contextual Help Demo
        </h2>
        <p className="text-gray-600">
          This demo showcases different ways to provide contextual help to
          users. Hover over the help icons to see tooltips with helpful
          information.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Basic Tooltips
        </h3>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <span>Info Tooltip:</span>
            <Tooltip content="This is an information tooltip" type="info">
              <span className="sr-only">Info</span>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <span>Help Tooltip:</span>
            <Tooltip content="This is a help tooltip" type="help">
              <span className="sr-only">Help</span>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <span>Warning Tooltip:</span>
            <Tooltip content="This is a warning tooltip" type="warning">
              <span className="sr-only">Warning</span>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <span>Custom Tooltip:</span>
            <Tooltip
              content={
                <div>
                  <p className="font-bold">Custom Tooltip</p>
                  <p>This tooltip has custom HTML content</p>
                  <ul className="list-disc pl-4 mt-1">
                    <li>Item 1</li>
                    <li>Item 2</li>
                  </ul>
                </div>
              }
              maxWidth={300}
            >
              <button className="px-2 py-1 bg-[#e6f3f1] text-[#0a7662] rounded hover:bg-[#e6f3f1]">
                Hover me
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Field Help Examples
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span>Name field help:</span>
            <FieldHelp fieldName="name" />
          </div>

          <div className="flex items-center gap-2">
            <span>Price field help:</span>
            <FieldHelp fieldName="price" />
          </div>

          <div className="flex items-center gap-2">
            <span>Location field help:</span>
            <FieldHelp fieldName="location" />
          </div>

          <div className="flex items-center gap-2">
            <span>Custom help:</span>
            <FieldHelp
              fieldName="quantity"
              customHelpText="This is custom help text for the quantity field."
              customGuidance="Must be a whole number greater than zero."
              customExample="42"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Form Fields with Help
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWithHelp
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              required
              error={errors.name}
            />

            <FormFieldWithHelp
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              type="select"
              options={[
                { value: "", label: "Select a category" },
                { value: "electronics", label: "Electronics" },
                { value: "furniture", label: "Furniture" },
                { value: "office", label: "Office Supplies" },
                { value: "clothing", label: "Clothing" },
              ]}
            />

            <FormFieldWithHelp
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              type="textarea"
              placeholder="Enter item description"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormFieldWithHelp
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                type="number"
                min="0"
                step="1"
                error={errors.quantity}
              />

              <FormFieldWithHelp
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                type="select"
                options={[
                  { value: "pieces", label: "Pieces" },
                  { value: "kg", label: "Kilograms" },
                  { value: "lbs", label: "Pounds" },
                  { value: "liters", label: "Liters" },
                  { value: "meters", label: "Meters" },
                  { value: "boxes", label: "Boxes" },
                ]}
              />
            </div>

            <FormFieldWithHelp
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              error={errors.price}
            />

            <FormFieldWithHelp
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter item location"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 btn-primary text-white rounded-md hover:btn-primary-hover"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContextualHelpDemo;
