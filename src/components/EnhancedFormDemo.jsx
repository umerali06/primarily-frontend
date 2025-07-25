import React, { useState } from "react";
import EnhancedFormField from "./EnhancedFormField";
import { TbCheck, TbX } from "react-icons/tb";

/**
 * Demo component for enhanced form fields with contextual help and validation guidance
 */
const EnhancedFormDemo = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    location: "",
    unit: "pieces",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  // Validation rules for fields
  const validationRules = {
    name: [
      {
        validate: (value) => value && value.length >= 2,
        message: "Name must be at least 2 characters long",
      },
      {
        validate: (value) => value && value.length <= 100,
        message: "Name must be less than 100 characters",
      },
      {
        validate: (value) => !value || /^[a-zA-Z0-9\\s\\-_]+$/.test(value),
        message: "Name should not contain special characters",
      },
    ],
    quantity: [
      {
        validate: (value) => !value || parseFloat(value) >= 0,
        message: "Quantity must be a positive number",
      },
      {
        validate: (value) => !value || Number.isInteger(parseFloat(value)),
        message: "Quantity must be a whole number",
      },
    ],
    price: [
      {
        validate: (value) => !value || parseFloat(value) >= 0,
        message: "Price must be a positive number",
      },
      {
        validate: (value) => !value || /^\d+(\.\d{1,2})?$/.test(value),
        message: "Price must have at most 2 decimal places",
      },
    ],
    email: [
      {
        validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Email must be a valid email address",
      },
    ],
    password: [
      {
        validate: (value) => !value || value.length >= 8,
        message: "Password must be at least 8 characters long",
      },
      {
        validate: (value) => !value || /[A-Z]/.test(value),
        message: "Password must contain at least one uppercase letter",
      },
      {
        validate: (value) => !value || /[a-z]/.test(value),
        message: "Password must contain at least one lowercase letter",
      },
      {
        validate: (value) => !value || /[0-9]/.test(value),
        message: "Password must contain at least one number",
      },
      {
        validate: (value) => !value || /[^A-Za-z0-9]/.test(value),
        message: "Password must contain at least one special character",
      },
    ],
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.quantity && parseFloat(formData.quantity) < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }

    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = "Price cannot be negative";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setFormSubmitted(true);
      console.log("Form data:", formData);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Enhanced Form with Contextual Help
        </h2>
        <p className="text-gray-600">
          This demo showcases form fields with contextual help and validation
          guidance. Focus on a field to see validation rules, and hover over
          help icons for more information.
        </p>
      </div>

      {formSubmitted && (
        <div className="mb-6 p-4 bg-primary-light border border-[var(--bg-primary)] rounded-lg">
          <div className="flex items-center gap-2 text-primary font-medium">
            <TbCheck size={20} className="text-primary" />
            <span>Form submitted successfully!</span>
          </div>
          <p className="mt-2 text-primary text-sm">
            Your form data has been processed. Check the console for details.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EnhancedFormField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter item name"
            required
            error={errors.name}
            validationRules={validationRules.name}
          />

          <EnhancedFormField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            type="email"
            error={errors.email}
            validationRules={validationRules.email}
          />

          <EnhancedFormField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            type="password"
            error={errors.password}
            validationRules={validationRules.password}
          />

          <EnhancedFormField
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

          <EnhancedFormField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            type="textarea"
            placeholder="Enter item description"
          />

          <div className="grid grid-cols-2 gap-4">
            <EnhancedFormField
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              type="number"
              min="0"
              step="1"
              error={errors.quantity}
              validationRules={validationRules.quantity}
            />

            <EnhancedFormField
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

          <EnhancedFormField
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            min="0"
            step="0.01"
            error={errors.price}
            validationRules={validationRules.price}
          />

          <EnhancedFormField
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
            onClick={() =>
              setFormData({
                name: "",
                description: "",
                quantity: "",
                price: "",
                location: "",
                unit: "pieces",
                email: "",
                password: "",
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 btn-primary text-white rounded-md hover:btn-primary-hover"
          >
            Submit
          </button>
        </div>
      </form>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Features Implemented
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Tooltips with contextual help for each field</li>
          <li>Field-specific validation guidance</li>
          <li>Real-time validation feedback</li>
          <li>Password visibility toggle</li>
          <li>Accessible form controls with ARIA attributes</li>
          <li>Responsive layout for different screen sizes</li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedFormDemo;
