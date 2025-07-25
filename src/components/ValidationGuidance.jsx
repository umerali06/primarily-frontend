import React from "react";
import { TbAlertCircle, TbCheck, TbX } from "react-icons/tb";
import { getValidationGuidance } from "../utils/contextualHelpUtils";

/**
 * Component for displaying field-specific validation guidance
 */
const ValidationGuidance = ({
  fieldName,
  value,
  customGuidance = null,
  validationRules = [],
  showValidStatus = true,
  className = "",
}) => {
  // Get the validation guidance for the field
  const guidance = getValidationGuidance(fieldName, customGuidance);

  // Check if validation rules are provided
  const hasRules = validationRules && validationRules.length > 0;

  // Check validation rules
  const checkRules = () => {
    if (!hasRules) return [];

    return validationRules.map((rule) => ({
      ...rule,
      valid: rule.validate(value),
    }));
  };

  const rules = hasRules ? checkRules() : [];
  const allValid = hasRules ? rules.every((rule) => rule.valid) : false;

  return (
    <div className={`text-xs ${className}`}>
      {guidance && !hasRules && (
        <div className="text-gray-500 mb-1">
          <TbAlertCircle size={12} className="inline-block mr-1" />
          {guidance}
        </div>
      )}

      {hasRules && (
        <div className="space-y-1">
          {showValidStatus && value && (
            <div
              className={`flex items-center gap-1 ${
                allValid ? "text-primary" : "text-green-600"
              }`}
            >
              {allValid ? (
                <>
                  <TbCheck size={12} />
                  <span>All validation rules passed</span>
                </>
              ) : (
                <>
                  <TbX size={12} />
                  <span>Some validation rules failed</span>
                </>
              )}
            </div>
          )}

          <ul className="space-y-1">
            {rules.map((rule, index) => (
              <li
                key={index}
                className={`flex items-center gap-1 ${
                  !value
                    ? "text-gray-500"
                    : rule.valid
                    ? "text-primary"
                    : "text-green-600"
                }`}
              >
                {value &&
                  (rule.valid ? <TbCheck size={12} /> : <TbX size={12} />)}
                <span>{rule.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ValidationGuidance;
