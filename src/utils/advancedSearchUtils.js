/**
 * Utility functions for advanced search operations
 */

/**
 * Parse an advanced search query into structured conditions
 * @param {string} query - The advanced search query
 * @returns {Object} - Parsed query object with conditions and logical operator
 */
export const parseAdvancedQuery = (query) => {
  if (!query) return { conditions: [], logicalOperator: "AND" };

  let logicalOperator = "AND";
  let conditions = [];

  // Determine logical operator
  if (query.includes(" OR ")) {
    logicalOperator = "OR";
    const parts = splitQueryParts(query, " OR ");
    conditions = parts.map(parseCondition).filter(Boolean);
  } else if (query.includes(" AND ")) {
    const parts = splitQueryParts(query, " AND ");
    conditions = parts.map(parseCondition).filter(Boolean);
  } else {
    const condition = parseCondition(query);
    if (condition) conditions.push(condition);
  }

  return { conditions, logicalOperator };
};

/**
 * Split query parts respecting quoted strings and parentheses
 * @param {string} query - The query to split
 * @param {string} separator - The separator to split on
 * @returns {Array} - Array of query parts
 */
const splitQueryParts = (query, separator) => {
  const parts = [];
  let currentPart = "";
  let inQuotes = false;
  let parenCount = 0;

  for (let i = 0; i < query.length; i++) {
    const char = query[i];

    // Check for quotes
    if (char === '"' && (i === 0 || query[i - 1] !== "\\")) {
      inQuotes = !inQuotes;
    }

    // Check for parentheses
    if (!inQuotes) {
      if (char === "(") parenCount++;
      if (char === ")") parenCount--;
    }

    // Check for separator
    if (
      !inQuotes &&
      parenCount === 0 &&
      query.substring(i, i + separator.length) === separator
    ) {
      parts.push(currentPart.trim());
      currentPart = "";
      i += separator.length - 1;
    } else {
      currentPart += char;
    }
  }

  if (currentPart.trim()) {
    parts.push(currentPart.trim());
  }

  return parts;
};

/**
 * Parse a single condition from a query part
 * @param {string} part - The query part to parse
 * @returns {Object|null} - Parsed condition object or null if invalid
 */
const parseCondition = (part) => {
  part = part.trim();

  // Handle negation
  let negated = false;
  if (part.startsWith("!") && part[1] !== "(") {
    negated = true;
    part = part.substring(1).trim();
  }

  // Handle field:value format
  if (part.includes(":")) {
    const [fieldPart, valuePart] = part.split(":", 2);
    const field = fieldPart.trim();

    // Handle empty value
    if (!valuePart || !valuePart.trim()) {
      return null;
    }

    let value = valuePart.trim();
    let operator = "contains";
    let valueEnd = "";

    // Handle quoted values
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
      operator = "equals";
    }

    // Handle special operators
    if (value.startsWith("=")) {
      operator = "equals";
      value = value.substring(1).trim();
    } else if (value.startsWith("!=")) {
      operator = "notEquals";
      value = value.substring(2).trim();
    } else if (value.startsWith(">")) {
      operator = "greaterThan";
      value = value.substring(1).trim();
    } else if (value.startsWith("<")) {
      operator = "lessThan";
      value = value.substring(1).trim();
    } else if (value.startsWith("^")) {
      operator = "startsWith";
      value = value.substring(1).trim();
    } else if (value.endsWith("$")) {
      operator = "endsWith";
      value = value.substring(0, value.length - 1).trim();
    } else if (value === "*") {
      operator = negated ? "notExists" : "exists";
      value = "";
    } else if (
      value.startsWith("[") &&
      value.endsWith("]") &&
      value.includes(" TO ")
    ) {
      operator = "between";
      const rangeParts = value.substring(1, value.length - 1).split(" TO ");
      value = rangeParts[0].trim();
      valueEnd = rangeParts[1].trim();
    } else if (value.startsWith("(") && value.endsWith(")")) {
      // Handle IN operator
      value = value.substring(1, value.length - 1).trim();
      if (value.includes(" OR ")) {
        operator = negated ? "notIn" : "in";
        value = value
          .split(" OR ")
          .map((v) => v.trim().replace(/^"(.*)"$/, "$1"))
          .join(", ");
      }
    }

    return { field, operator, value, valueEnd };
  }

  // Default to simple text search
  return { field: "name", operator: "contains", value: part, valueEnd: "" };
};

/**
 * Apply advanced search conditions to filter items
 * @param {Array} items - The items to filter
 * @param {Object} parsedQuery - The parsed query object
 * @returns {Array} - Filtered items
 */
export const applyAdvancedSearch = (items, parsedQuery) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return [];
  }

  if (
    !parsedQuery ||
    !parsedQuery.conditions ||
    parsedQuery.conditions.length === 0
  ) {
    return items;
  }

  const { conditions, logicalOperator } = parsedQuery;

  return items.filter((item) => {
    // Apply conditions based on logical operator
    if (logicalOperator === "AND") {
      return conditions.every((condition) => matchesCondition(item, condition));
    } else {
      return conditions.some((condition) => matchesCondition(item, condition));
    }
  });
};

/**
 * Check if an item matches a condition
 * @param {Object} item - The item to check
 * @param {Object} condition - The condition to match
 * @returns {boolean} - Whether the item matches the condition
 */
const matchesCondition = (item, condition) => {
  const { field, operator, value, valueEnd } = condition;

  // Get field value, handling nested fields with dot notation
  let fieldValue = field.split(".").reduce((obj, key) => obj && obj[key], item);

  // Handle array fields (like tags)
  if (Array.isArray(fieldValue)) {
    switch (operator) {
      case "contains":
        return fieldValue.some((v) =>
          v.toLowerCase().includes(value.toLowerCase())
        );
      case "equals":
        return fieldValue.some((v) => v.toLowerCase() === value.toLowerCase());
      case "notEquals":
        return !fieldValue.some((v) => v.toLowerCase() === value.toLowerCase());
      case "in":
        const valueList = value.split(",").map((v) => v.trim().toLowerCase());
        return fieldValue.some((v) => valueList.includes(v.toLowerCase()));
      case "notIn":
        const excludeList = value.split(",").map((v) => v.trim().toLowerCase());
        return !fieldValue.some((v) => excludeList.includes(v.toLowerCase()));
      case "exists":
        return fieldValue.length > 0;
      case "notExists":
        return fieldValue.length === 0;
      default:
        return false;
    }
  }

  // Handle non-array fields
  if (fieldValue === undefined || fieldValue === null) {
    return operator === "notExists";
  }

  // Convert to string for text operations
  const stringValue = String(fieldValue).toLowerCase();
  const searchValue = String(value).toLowerCase();

  switch (operator) {
    case "contains":
      return stringValue.includes(searchValue);
    case "equals":
      return stringValue === searchValue;
    case "notEquals":
      return stringValue !== searchValue;
    case "startsWith":
      return stringValue.startsWith(searchValue);
    case "endsWith":
      return stringValue.endsWith(searchValue);
    case "greaterThan":
      return Number(fieldValue) > Number(value);
    case "lessThan":
      return Number(fieldValue) < Number(value);
    case "between":
      return (
        Number(fieldValue) >= Number(value) &&
        Number(fieldValue) <= Number(valueEnd)
      );
    case "in":
      const valueList = value.split(",").map((v) => v.trim().toLowerCase());
      return valueList.includes(stringValue);
    case "notIn":
      const excludeList = value.split(",").map((v) => v.trim().toLowerCase());
      return !excludeList.includes(stringValue);
    case "exists":
      return true;
    case "notExists":
      return false;
    default:
      return false;
  }
};

/**
 * Generate a human-readable description of an advanced search query
 * @param {Object} parsedQuery - The parsed query object
 * @returns {string} - Human-readable description
 */
export const getQueryDescription = (parsedQuery) => {
  if (
    !parsedQuery ||
    !parsedQuery.conditions ||
    parsedQuery.conditions.length === 0
  ) {
    return "No search criteria";
  }

  const { conditions, logicalOperator } = parsedQuery;

  const conditionDescriptions = conditions.map((condition) => {
    const { field, operator, value, valueEnd } = condition;

    // Format field name for display
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

    switch (operator) {
      case "contains":
        return `${fieldName} contains "${value}"`;
      case "equals":
        return `${fieldName} equals "${value}"`;
      case "notEquals":
        return `${fieldName} does not equal "${value}"`;
      case "startsWith":
        return `${fieldName} starts with "${value}"`;
      case "endsWith":
        return `${fieldName} ends with "${value}"`;
      case "greaterThan":
        return `${fieldName} is greater than ${value}`;
      case "lessThan":
        return `${fieldName} is less than ${value}`;
      case "between":
        return `${fieldName} is between ${value} and ${valueEnd}`;
      case "in":
        return `${fieldName} is one of [${value}]`;
      case "notIn":
        return `${fieldName} is not one of [${value}]`;
      case "exists":
        return `${fieldName} exists`;
      case "notExists":
        return `${fieldName} does not exist`;
      default:
        return `${fieldName} matches "${value}"`;
    }
  });

  // Join with logical operator
  const joinWord = logicalOperator === "AND" ? "and" : "or";

  if (conditionDescriptions.length === 1) {
    return conditionDescriptions[0];
  } else if (conditionDescriptions.length === 2) {
    return `${conditionDescriptions[0]} ${joinWord} ${conditionDescriptions[1]}`;
  } else {
    const lastDescription = conditionDescriptions.pop();
    return `${conditionDescriptions.join(
      ", "
    )}, ${joinWord} ${lastDescription}`;
  }
};

export default {
  parseAdvancedQuery,
  applyAdvancedSearch,
  getQueryDescription,
};
