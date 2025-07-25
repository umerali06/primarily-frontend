import React, { useState } from "react";
import EnhancedInlineEditField from "./EnhancedInlineEditField";
import { createOptimisticUpdateHandler } from "../utils/optimisticUpdateUtils";
import {
  createLoadingStateHandler,
  createErrorStateHandler,
} from "../utils/loadingStateUtils";
import { createApiErrorHandler } from "../utils/errorHandlingUtils";
import toast from "react-hot-toast";

/**
 * Demo component for the EnhancedInlineEditField with optimistic updates
 */
const EnhancedInlineEditFieldDemo = () => {
  const [item, setItem] = useState({
    id: "123",
    name: "Sample Item",
    description: "This is a sample item description",
    quantity: 10,
    price: 99.99,
    location: "Warehouse A",
    tags: ["sample", "demo"],
  });

  const [loadingState, setLoadingState] = useState({});
  const [errorState, setErrorState] = useState({});

  // Create loading and error state handlers
  const loadingHandler = createLoadingStateHandler(setLoadingState);
  const errorHandler = createErrorStateHandler(setErrorState);

  // Create API error handler
  const handleApiError = createApiErrorHandler(
    toast.error,
    errorHandler.setError
  );

  // Simulate an API call with a delay and random success/failure
  const simulateApiCall = async (itemId, updateData) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate random failure (20% chance)
    if (Math.random() < 0.2) {
      throw new Error("Network error: Failed to update item");
    }

    // Return the updated item
    return {
      ...item,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
  };

  // Create optimistic update handler
  const updateItem = createOptimisticUpdateHandler(
    simulateApiCall,
    (updateData) => {
      // Success handler - update the item state
      setItem((prev) => ({
        ...prev,
        ...updateData,
        updatedAt: new Date().toISOString(),
      }));
      toast.success("Item updated successfully");
    },
    (error, updateData) => {
      // Error handler
      handleApiError(error, { field: Object.keys(updateData)[0] });
    },
    (updateData) => {
      // Start handler - set loading state
      const field = Object.keys(updateData)[0];
      loadingHandler.startLoading(field);
      errorHandler.clearError(field);
    },
    () => {
      // End handler - reset loading state
      loadingHandler.resetLoading();
    }
  );

  // Handle field update
  const handleFieldUpdate = async (field, value) => {
    try {
      await updateItem(item.id, { [field]: value }, true); // Use optimistic update
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Enhanced Inline Edit Field Demo
      </h2>

      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Basic Fields
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <EnhancedInlineEditField
                value={item.name}
                onSave={(value) => handleFieldUpdate("name", value)}
                required={true}
                validation={(value) =>
                  value.length < 3 ? "Name must be at least 3 characters" : ""
                }
                helpText="The name of the item"
                className="text-lg font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <EnhancedInlineEditField
                value={item.description}
                onSave={(value) => handleFieldUpdate("description", value)}
                multiline={true}
                helpText="A detailed description of the item"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Numeric Fields
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <EnhancedInlineEditField
                value={item.quantity}
                onSave={(value) =>
                  handleFieldUpdate("quantity", parseInt(value))
                }
                type="number"
                validation={(value) =>
                  value < 0 ? "Quantity cannot be negative" : ""
                }
                helpText="The current stock quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <EnhancedInlineEditField
                value={item.price}
                onSave={(value) =>
                  handleFieldUpdate("price", parseFloat(value))
                }
                type="number"
                validation={(value) =>
                  value < 0 ? "Price cannot be negative" : ""
                }
                displayFormatter={(value) => `$${parseFloat(value).toFixed(2)}`}
                helpText="The price in USD"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Other Fields
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <EnhancedInlineEditField
                value={item.location}
                onSave={(value) => handleFieldUpdate("location", value)}
                helpText="Where the item is stored"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <EnhancedInlineEditField
                value={item.unit || "pieces"}
                onSave={(value) => handleFieldUpdate("unit", value)}
                type="select"
                options={[
                  { value: "pieces", label: "Pieces" },
                  { value: "kg", label: "Kilograms" },
                  { value: "lbs", label: "Pounds" },
                  { value: "liters", label: "Liters" },
                  { value: "meters", label: "Meters" },
                  { value: "boxes", label: "Boxes" },
                ]}
                helpText="The unit of measurement"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Current Item State
          </h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(item, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default EnhancedInlineEditFieldDemo;
