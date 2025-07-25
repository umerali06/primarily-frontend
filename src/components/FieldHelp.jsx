import React from "react";
import Tooltip from "./Tooltip";
import { createFieldHelp } from "../utils/contextualHelpUtils";

/**
 * Field help component for displaying contextual help for form fields
 */
const FieldHelp = ({
  fieldName,
  customHelpText = null,
  customGuidance = null,
  customExample = null,
  showExample = true,
  showGuidance = true,
  position = "top",
  type = "help",
  iconSize = 14,
  maxWidth = 250,
  className = "",
  children = null,
}) => {
  const fieldHelp = createFieldHelp(fieldName, {
    customHelpText,
    customGuidance,
    customExample,
    showExample,
    showGuidance,
  });

  // Format the tooltip content
  const formatTooltipContent = () => {
    const parts = [];

    if (fieldHelp.helpText) {
      parts.push(fieldHelp.helpText);
    }

    if (fieldHelp.guidance) {
      parts.push(
        `<div class="mt-1 pt-1 border-t border-gray-700"><strong>Validation:</strong> ${fieldHelp.guidance}</div>`
      );
    }

    if (fieldHelp.example) {
      parts.push(
        `<div class="mt-1"><strong>Example:</strong> ${fieldHelp.example}</div>`
      );
    }

    return <div dangerouslySetInnerHTML={{ __html: parts.join("") }} />;
  };

  return (
    <Tooltip
      content={formatTooltipContent()}
      position={position}
      type={type}
      iconSize={iconSize}
      maxWidth={maxWidth}
      className={className}
      interactive={true}
    >
      {children}
    </Tooltip>
  );
};

export default FieldHelp;
