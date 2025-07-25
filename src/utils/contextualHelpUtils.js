/**
 * Utility functions for contextual help
 */

/**
 * Field help text definitions for common fields
 */
export const fieldHelpText = {
  // Item fields
  name: "The name of the item. This should be unique and descriptive.",
  description:
    "A detailed description of the item. Include important details like color, material, etc.",
  quantity: "The current stock quantity of this item.",
  unit: "The unit of measurement for this item (e.g., pieces, kg, liters).",
  price: "The price per unit of this item.",
  minLevel:
    "The minimum stock level. You'll receive alerts when quantity falls below this.",
  location: "Where this item is stored or located.",
  tags: "Tags help categorize and find items quickly.",
  sku: "Stock Keeping Unit - a unique identifier for this item.",
  barcode: "The barcode number associated with this item.",
  notes: "Additional notes or information about this item.",
  category: "The category this item belongs to.",
  supplier: "The supplier or vendor for this item.",

  // Folder fields
  folderName:
    "The name of the folder. Use descriptive names for easy navigation.",
  parentFolder: "The parent folder that contains this folder.",

  // User fields
  email: "The email address used for login and notifications.",
  password: "Your account password. Use a strong, unique password.",
  firstName: "Your first name.",
  lastName: "Your last name.",

  // Common fields
  createdAt: "When this item was created.",
  updatedAt: "When this item was last updated.",
  createdBy: "Who created this item.",
  updatedBy: "Who last updated this item.",
};

/**
 * Validation guidance for common fields
 */
export const validationGuidance = {
  name: "Name should be 2-100 characters long and not contain special characters.",
  description: "Description can be up to 1000 characters long.",
  quantity: "Quantity must be a positive number.",
  price: "Price must be a positive number with up to 2 decimal places.",
  minLevel: "Minimum level must be a non-negative number.",
  email: "Enter a valid email address (e.g., user@example.com).",
  password:
    "Password must be at least 8 characters and include letters, numbers, and special characters.",
};

/**
 * Get help text for a field
 *
 * @param {string} fieldName - The name of the field
 * @param {string} customHelpText - Custom help text to override default
 * @returns {string} - The help text for the field
 */
export const getFieldHelpText = (fieldName, customHelpText = null) => {
  if (customHelpText) {
    return customHelpText;
  }

  return fieldHelpText[fieldName] || "";
};

/**
 * Get validation guidance for a field
 *
 * @param {string} fieldName - The name of the field
 * @param {string} customGuidance - Custom guidance to override default
 * @returns {string} - The validation guidance for the field
 */
export const getValidationGuidance = (fieldName, customGuidance = null) => {
  if (customGuidance) {
    return customGuidance;
  }

  return validationGuidance[fieldName] || "";
};

/**
 * Create a tooltip component props
 *
 * @param {string} content - The tooltip content
 * @param {string} position - The tooltip position (top, right, bottom, left)
 * @param {boolean} showIcon - Whether to show the help icon
 * @returns {Object} - The tooltip props
 */
export const createTooltipProps = (
  content,
  position = "top",
  showIcon = true
) => {
  return {
    content,
    position,
    showIcon,
  };
};

/**
 * Field examples for common fields
 */
export const fieldExamples = {
  name: "Office Chair",
  description:
    "Ergonomic office chair with adjustable height and lumbar support.",
  quantity: "10",
  price: "149.99",
  location: "Warehouse A, Shelf B3",
  tags: "office, furniture, chair",
  sku: "CHAIR-001",
  barcode: "1234567890123",
};

/**
 * Get an example value for a field
 *
 * @param {string} fieldName - The name of the field
 * @returns {string} - An example value for the field
 */
export const getFieldExample = (fieldName) => {
  return fieldExamples[fieldName] || "";
};

/**
 * Create a help object with all help information for a field
 *
 * @param {string} fieldName - The name of the field
 * @param {Object} options - Additional options
 * @returns {Object} - The help object
 */
export const createFieldHelp = (fieldName, options = {}) => {
  const {
    customHelpText = null,
    customGuidance = null,
    customExample = null,
    showExample = true,
    showGuidance = true,
  } = options;

  const helpText = getFieldHelpText(fieldName, customHelpText);
  const guidance = showGuidance
    ? getValidationGuidance(fieldName, customGuidance)
    : null;
  const example = showExample ? getFieldExample(fieldName) : null;

  return {
    helpText,
    guidance,
    example,
    fieldName,
  };
};
