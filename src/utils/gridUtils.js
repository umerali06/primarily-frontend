/**
 * Utility function to generate grid classes based on column settings
 * This is needed because Tailwind CSS needs to know all classes at build time
 *
 * @param {Object} columnSettings - Column settings object
 * @returns {string} - Tailwind CSS grid class
 */
export const getGridClasses = (
  columnSettings = { sm: 2, md: 3, lg: 4, xl: 5 }
) => {
  // Default grid class
  let gridClass = "grid grid-cols-1 gap-4";

  // Add responsive classes based on settings
  if (columnSettings.sm === 1) gridClass += " sm:grid-cols-1";
  else if (columnSettings.sm === 2) gridClass += " sm:grid-cols-2";
  else if (columnSettings.sm === 3) gridClass += " sm:grid-cols-3";
  else if (columnSettings.sm === 4) gridClass += " sm:grid-cols-4";

  if (columnSettings.md === 1) gridClass += " md:grid-cols-1";
  else if (columnSettings.md === 2) gridClass += " md:grid-cols-2";
  else if (columnSettings.md === 3) gridClass += " md:grid-cols-3";
  else if (columnSettings.md === 4) gridClass += " md:grid-cols-4";
  else if (columnSettings.md === 5) gridClass += " md:grid-cols-5";
  else if (columnSettings.md === 6) gridClass += " md:grid-cols-6";

  if (columnSettings.lg === 1) gridClass += " lg:grid-cols-1";
  else if (columnSettings.lg === 2) gridClass += " lg:grid-cols-2";
  else if (columnSettings.lg === 3) gridClass += " lg:grid-cols-3";
  else if (columnSettings.lg === 4) gridClass += " lg:grid-cols-4";
  else if (columnSettings.lg === 5) gridClass += " lg:grid-cols-5";
  else if (columnSettings.lg === 6) gridClass += " lg:grid-cols-6";

  if (columnSettings.xl === 1) gridClass += " xl:grid-cols-1";
  else if (columnSettings.xl === 2) gridClass += " xl:grid-cols-2";
  else if (columnSettings.xl === 3) gridClass += " xl:grid-cols-3";
  else if (columnSettings.xl === 4) gridClass += " xl:grid-cols-4";
  else if (columnSettings.xl === 5) gridClass += " xl:grid-cols-5";
  else if (columnSettings.xl === 6) gridClass += " xl:grid-cols-6";
  else if (columnSettings.xl === 7) gridClass += " xl:grid-cols-7";

  return gridClass;
};
