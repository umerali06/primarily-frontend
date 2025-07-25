// Validation utilities for inline editing

export const validators = {
  required: (value) => {
    if (!value || value.toString().trim() === "") {
      return "This field is required";
    }
    return "";
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return "";
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return "";
  },

  number: (value) => {
    if (value && isNaN(Number(value))) {
      return "Must be a valid number";
    }
    return "";
  },

  positiveNumber: (value) => {
    const num = Number(value);
    if (value && (isNaN(num) || num < 0)) {
      return "Must be a positive number";
    }
    return "";
  },

  integer: (value) => {
    const num = Number(value);
    if (value && (isNaN(num) || !Number.isInteger(num))) {
      return "Must be a whole number";
    }
    return "";
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return "Must be a valid email address";
    }
    return "";
  },

  url: (value) => {
    try {
      if (value) {
        new URL(value);
      }
      return "";
    } catch {
      return "Must be a valid URL";
    }
  },

  price: (value) => {
    const num = Number(value);
    if (value && (isNaN(num) || num < 0)) {
      return "Must be a valid price (0 or greater)";
    }
    if (value && num > 999999.99) {
      return "Price cannot exceed $999,999.99";
    }
    return "";
  },

  quantity: (value) => {
    const num = Number(value);
    if (value && (isNaN(num) || num < 0 || !Number.isInteger(num))) {
      return "Must be a whole number (0 or greater)";
    }
    if (value && num > 999999) {
      return "Quantity cannot exceed 999,999";
    }
    return "";
  },

  sku: (value) => {
    if (value && !/^[A-Z0-9-_]+$/i.test(value)) {
      return "SKU can only contain letters, numbers, hyphens, and underscores";
    }
    if (value && value.length > 50) {
      return "SKU cannot exceed 50 characters";
    }
    return "";
  },

  barcode: (value) => {
    if (value && !/^\d+$/.test(value)) {
      return "Barcode can only contain numbers";
    }
    if (value && (value.length < 8 || value.length > 18)) {
      return "Barcode must be between 8 and 18 digits";
    }
    return "";
  },
};

// Combine multiple validators
export const combineValidators = (...validatorFuncs) => {
  return (value) => {
    for (const validator of validatorFuncs) {
      const error = validator(value);
      if (error) {
        return error;
      }
    }
    return "";
  };
};

// Common validation combinations
export const commonValidations = {
  requiredText: combineValidators(validators.required, validators.minLength(1)),
  requiredNumber: combineValidators(validators.required, validators.number),
  requiredPositiveNumber: combineValidators(
    validators.required,
    validators.positiveNumber
  ),
  requiredInteger: combineValidators(validators.required, validators.integer),
  optionalEmail: (value) => (value ? validators.email(value) : ""),
  optionalUrl: (value) => (value ? validators.url(value) : ""),
  itemName: combineValidators(
    validators.required,
    validators.minLength(2),
    validators.maxLength(100)
  ),
  itemDescription: validators.maxLength(500),
  itemPrice: validators.price,
  itemQuantity: combineValidators(validators.required, validators.quantity),
  itemSku: validators.sku,
  itemBarcode: validators.barcode,
  itemLocation: validators.maxLength(100),
  itemNotes: validators.maxLength(1000),
};

// Format display values
export const formatters = {
  currency: (value) => {
    const num = Number(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  },

  number: (value) => {
    const num = Number(value);
    if (isNaN(num)) return value;
    return num.toLocaleString();
  },

  percentage: (value) => {
    const num = Number(value);
    if (isNaN(num)) return value;
    return `${num}%`;
  },

  date: (value) => {
    if (!value) return value;
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  },

  datetime: (value) => {
    if (!value) return value;
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  },

  truncate:
    (maxLength = 50) =>
    (value) => {
      if (!value || value.length <= maxLength) return value;
      return `${value.substring(0, maxLength)}...`;
    },

  capitalize: (value) => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  },

  upperCase: (value) => {
    if (!value) return value;
    return value.toUpperCase();
  },
};

export default {
  validators,
  combineValidators,
  commonValidations,
  formatters,
};
