import React, { useState, useEffect } from "react";
import {
  TbPlus,
  TbTrash,
  TbSearch,
  TbTag,
  TbFolder,
  TbBox,
  TbUser,
  TbCalendar,
  TbCurrencyDollar,
  TbBarcode,
  TbInfoCircle,
  TbArrowRight,
  TbFilter,
  TbX,
} from "react-icons/tb";

/**
 * Advanced search builder component for creating complex search queries
 */
const AdvancedSearchBuilder = ({
  onSearch,
  onClose,
  initialQuery = "",
  className = "",
}) => {
  // Available search fields
  const searchFields = [
    { id: "name", label: "Name", icon: <TbBox size={16} /> },
    {
      id: "description",
      label: "Description",
      icon: <TbInfoCircle size={16} />,
    },
    { id: "tags", label: "Tags", icon: <TbTag size={16} /> },
    { id: "category", label: "Category", icon: <TbFolder size={16} /> },
    { id: "location", label: "Location", icon: <TbUser size={16} /> },
    { id: "barcode", label: "Barcode/SKU", icon: <TbBarcode size={16} /> },
    {
      id: "price",
      label: "Price",
      icon: <TbCurrencyDollar size={16} />,
      type: "number",
    },
    {
      id: "quantity",
      label: "Quantity",
      icon: <TbBox size={16} />,
      type: "number",
    },
    {
      id: "updatedAt",
      label: "Updated Date",
      icon: <TbCalendar size={16} />,
      type: "date",
    },
  ];

  // Available operators
  const operators = [
    { id: "contains", label: "contains", textOnly: true },
    { id: "equals", label: "equals" },
    { id: "notEquals", label: "does not equal" },
    { id: "startsWith", label: "starts with", textOnly: true },
    { id: "endsWith", label: "ends with", textOnly: true },
    { id: "greaterThan", label: "greater than", numericOnly: true },
    { id: "lessThan", label: "less than", numericOnly: true },
    { id: "between", label: "between", numericOnly: true, requiresRange: true },
    { id: "in", label: "is one of", requiresList: true },
    { id: "notIn", label: "is not one of", requiresList: true },
    { id: "exists", label: "exists", noValue: true },
    { id: "notExists", label: "does not exist", noValue: true },
  ];

  // Logical operators
  const logicalOperators = [
    { id: "AND", label: "AND (Match all conditions)" },
    { id: "OR", label: "OR (Match any condition)" },
  ];

  // State for search conditions
  const [conditions, setConditions] = useState([
    { field: "name", operator: "contains", value: initialQuery, valueEnd: "" },
  ]);

  // State for logical operator
  const [logicalOperator, setLogicalOperator] = useState("AND");

  // State for preview query
  const [previewQuery, setPreviewQuery] = useState("");

  // Update preview query when conditions change
  useEffect(() => {
    updatePreviewQuery();
  }, [conditions, logicalOperator]);

  // Parse initial query if provided
  useEffect(() => {
    if (initialQuery) {
      try {
        // Simple parsing for basic queries
        if (!initialQuery.includes(":")) {
          setConditions([
            {
              field: "name",
              operator: "contains",
              value: initialQuery,
              valueEnd: "",
            },
          ]);
          return;
        }

        // Try to parse advanced query
        const parsedConditions = [];
        let currentLogicalOp = "AND";

        if (initialQuery.includes(" OR ")) {
          currentLogicalOp = "OR";
          const parts = initialQuery.split(" OR ");
          parts.forEach((part) => {
            const condition = parseCondition(part.trim());
            if (condition) parsedConditions.push(condition);
          });
        } else if (initialQuery.includes(" AND ")) {
          const parts = initialQuery.split(" AND ");
          parts.forEach((part) => {
            const condition = parseCondition(part.trim());
            if (condition) parsedConditions.push(condition);
          });
        } else {
          const condition = parseCondition(initialQuery.trim());
          if (condition) parsedConditions.push(condition);
        }

        if (parsedConditions.length > 0) {
          setConditions(parsedConditions);
          setLogicalOperator(currentLogicalOp);
        }
      } catch (error) {
        console.error("Error parsing query:", error);
      }
    }
  }, [initialQuery]);

  // Parse a single condition from text
  const parseCondition = (text) => {
    // Check for field:value format
    if (text.includes(":")) {
      const [fieldPart, valuePart] = text.split(":", 2);
      const field = fieldPart.trim();
      const value = valuePart.trim().replace(/^"(.*)"$/, "$1"); // Remove quotes if present

      // Determine operator
      let operator = "contains";
      if (value.startsWith("=")) {
        operator = "equals";
        value = value.substring(1).trim();
      } else if (value.startsWith(">")) {
        operator = "greaterThan";
        value = value.substring(1).trim();
      } else if (value.startsWith("<")) {
        operator = "lessThan";
        value = value.substring(1).trim();
      }

      return { field, operator, value, valueEnd: "" };
    }

    // Default to name contains for simple queries
    return { field: "name", operator: "contains", value: text, valueEnd: "" };
  };

  // Add a new condition
  const addCondition = () => {
    setConditions([
      ...conditions,
      { field: "name", operator: "contains", value: "", valueEnd: "" },
    ]);
  };

  // Remove a condition
  const removeCondition = (index) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  // Update a condition
  const updateCondition = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };

    // Reset value if changing operator type
    if (field === "operator") {
      const operatorObj = operators.find((op) => op.id === value);
      if (operatorObj?.noValue) {
        newConditions[index].value = "";
        newConditions[index].valueEnd = "";
      } else if (!operatorObj?.requiresRange) {
        newConditions[index].valueEnd = "";
      }
    }

    // Reset operator if changing field type
    if (field === "field") {
      const fieldObj = searchFields.find((f) => f.id === value);
      const currentOperator = newConditions[index].operator;
      const operatorObj = operators.find((op) => op.id === currentOperator);

      if (
        (fieldObj?.type === "number" && operatorObj?.textOnly) ||
        (fieldObj?.type !== "number" && operatorObj?.numericOnly)
      ) {
        newConditions[index].operator = "contains";
      }
    }

    setConditions(newConditions);
  };

  // Build and update the preview query
  const updatePreviewQuery = () => {
    const queryParts = conditions
      .map((condition) => {
        const { field, operator, value, valueEnd } = condition;

        // Skip empty conditions
        if (
          !field ||
          !operator ||
          (!value &&
            valueEnd === "" &&
            !operators.find((op) => op.id === operator)?.noValue)
        ) {
          return null;
        }

        // Handle different operator types
        switch (operator) {
          case "contains":
            return `${field}:"${value}"`;
          case "equals":
            return `${field}:=${value}`;
          case "notEquals":
            return `${field}:!=${value}`;
          case "startsWith":
            return `${field}:^${value}`;
          case "endsWith":
            return `${field}:${value}$`;
          case "greaterThan":
            return `${field}:>${value}`;
          case "lessThan":
            return `${field}:<${value}`;
          case "between":
            return `${field}:[${value} TO ${valueEnd}]`;
          case "in":
            return `${field}:(${value
              .split(",")
              .map((v) => `"${v.trim()}"`)
              .join(" OR ")})`;
          case "notIn":
            return `${field}:!(${value
              .split(",")
              .map((v) => `"${v.trim()}"`)
              .join(" OR ")})`;
          case "exists":
            return `${field}:*`;
          case "notExists":
            return `!${field}:*`;
          default:
            return `${field}:"${value}"`;
        }
      })
      .filter(Boolean);

    // Join with logical operator
    const query = queryParts.join(` ${logicalOperator} `);
    setPreviewQuery(query);
  };

  // Execute search
  const handleSearch = () => {
    if (previewQuery) {
      onSearch(previewQuery);
    }
  };

  // Get input type based on field
  const getInputType = (fieldId) => {
    const field = searchFields.find((f) => f.id === fieldId);
    return field?.type || "text";
  };

  // Filter operators based on field type
  const getAvailableOperators = (fieldId) => {
    const field = searchFields.find((f) => f.id === fieldId);
    const fieldType = field?.type || "text";

    return operators.filter((op) => {
      if (fieldType === "number" && op.textOnly) return false;
      if (fieldType !== "number" && op.numericOnly) return false;
      return true;
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Advanced Search</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <TbX size={20} />
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Match Type
        </label>
        <select
          value={logicalOperator}
          onChange={(e) => setLogicalOperator(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
        >
          {logicalOperators.map((op) => (
            <option key={op.id} value={op.id}>
              {op.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4 mb-4">
        {conditions.map((condition, index) => {
          const availableOperators = getAvailableOperators(condition.field);
          const selectedOperator = operators.find(
            (op) => op.id === condition.operator
          );
          const inputType = getInputType(condition.field);

          return (
            <div
              key={index}
              className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Condition {index + 1}
                </span>
                {conditions.length > 1 && (
                  <button
                    onClick={() => removeCondition(index)}
                    className="text-green-500 hover:text-green-700"
                    aria-label="Remove condition"
                  >
                    <TbTrash size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Field selector */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Field
                  </label>
                  <select
                    value={condition.field}
                    onChange={(e) =>
                      updateCondition(index, "field", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                  >
                    {searchFields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Operator selector */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Operator
                  </label>
                  <select
                    value={condition.operator}
                    onChange={(e) =>
                      updateCondition(index, "operator", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                  >
                    {availableOperators.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Value input(s) */}
                <div
                  className={
                    selectedOperator?.requiresRange
                      ? "grid grid-cols-2 gap-2"
                      : ""
                  }
                >
                  {!selectedOperator?.noValue && (
                    <>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {selectedOperator?.requiresRange ? "From" : "Value"}
                        </label>
                        <input
                          type={inputType}
                          value={condition.value}
                          onChange={(e) =>
                            updateCondition(index, "value", e.target.value)
                          }
                          placeholder={
                            selectedOperator?.requiresList
                              ? "Value1, Value2, ..."
                              : "Enter value"
                          }
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                        />
                      </div>

                      {selectedOperator?.requiresRange && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            To
                          </label>
                          <input
                            type={inputType}
                            value={condition.valueEnd}
                            onChange={(e) =>
                              updateCondition(index, "valueEnd", e.target.value)
                            }
                            placeholder="Enter end value"
                            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6">
        <button
          onClick={addCondition}
          className="flex items-center text-primary hover:text-[var(--primary-dark)]"
        >
          <TbPlus size={16} className="mr-1" />
          <span>Add Condition</span>
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Query Preview
        </label>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-mono break-all">
          {previewQuery || (
            <span className="text-gray-400">No query built yet</span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSearch}
          className="px-4 py-2 btn-primary text-white rounded-md hover:btn-primary-hover flex items-center"
          disabled={!previewQuery}
        >
          <TbSearch size={16} className="mr-1" />
          Search
        </button>
      </div>
    </div>
  );
};

export default AdvancedSearchBuilder;
