import api from "./api";

// Enterprise Lead Services
export const enterpriseLeadService = {
  // Submit enterprise lead form
  submit: async (leadData) => {
    try {
      const response = await api.post("/enterprise-leads", leadData);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to submit enterprise lead" }
      );
    }
  },
};

// Contact Services
export const contactService = {
  // Submit contact form
  submit: async (contactData) => {
    try {
      const response = await api.post("/contacts", contactData);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to submit contact form" }
      );
    }
  },
};

// Newsletter Services
export const newsletterService = {
  // Subscribe to newsletter
  subscribe: async (email) => {
    try {
      const response = await api.post("/newsletter/subscribe", { email });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to subscribe to newsletter" }
      );
    }
  },

  // Unsubscribe from newsletter
  unsubscribe: async (token, email) => {
    try {
      const params = new URLSearchParams();
      if (token) params.append("token", token);
      if (email) params.append("email", email);

      const response = await api.get(`/newsletter/unsubscribe?${params}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to unsubscribe from newsletter",
        }
      );
    }
  },

  // Update newsletter preferences
  updatePreferences: async (email, preferences) => {
    try {
      const response = await api.patch("/newsletter/preferences", {
        email,
        preferences,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to update newsletter preferences",
        }
      );
    }
  },
};

// Form validation utilities
export const formValidation = {
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (basic validation)
  isValidPhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  },

  // Validate required fields
  validateRequired: (data, requiredFields) => {
    const errors = {};

    requiredFields.forEach((field) => {
      if (
        !data[field] ||
        (typeof data[field] === "string" && !data[field].trim())
      ) {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Validate enterprise lead form
  validateEnterpriseLead: (data) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "country",
      "phone",
      "users",
    ];
    const validation = formValidation.validateRequired(data, requiredFields);

    // Additional validations
    if (data.email && !formValidation.isValidEmail(data.email)) {
      validation.errors.email = "Please enter a valid email address";
      validation.isValid = false;
    }

    if (data.phone && !formValidation.isValidPhone(data.phone)) {
      validation.errors.phone = "Please enter a valid phone number";
      validation.isValid = false;
    }

    if (!data.agree) {
      validation.errors.agree = "You must agree to the terms and conditions";
      validation.isValid = false;
    }

    return validation;
  },

  // Validate contact form
  validateContact: (data) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "reason",
      "message",
    ];
    const validation = formValidation.validateRequired(data, requiredFields);

    // Additional validations
    if (data.email && !formValidation.isValidEmail(data.email)) {
      validation.errors.email = "Please enter a valid email address";
      validation.isValid = false;
    }

    if (
      data.phone &&
      data.phone.trim() &&
      !formValidation.isValidPhone(data.phone)
    ) {
      validation.errors.phone = "Please enter a valid phone number";
      validation.isValid = false;
    }

    if (data.message && data.message.length > 2000) {
      validation.errors.message = "Message must be less than 2000 characters";
      validation.isValid = false;
    }

    return validation;
  },

  // Validate newsletter subscription
  validateNewsletter: (email) => {
    if (!email || !email.trim()) {
      return {
        isValid: false,
        errors: { email: "Email is required" },
      };
    }

    if (!formValidation.isValidEmail(email)) {
      return {
        isValid: false,
        errors: { email: "Please enter a valid email address" },
      };
    }

    return { isValid: true, errors: {} };
  },
};

// Form submission utilities
export const formUtils = {
  // Handle form submission with loading states and error handling
  handleSubmit: async (submitFunction, setLoading, setError, setSuccess) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await submitFunction();
      setSuccess(result.message || "Form submitted successfully");
      return result;
    } catch (error) {
      const errorMessage =
        error.message || "An error occurred while submitting the form";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  // Reset form state
  resetForm: (setFormData, initialState, setError, setSuccess) => {
    setFormData(initialState);
    setError(null);
    setSuccess(null);
  },

  // Format phone number for display
  formatPhone: (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },
};
