/**
 * Date and Time Helper Functions
 * Handles UTC to Philippine Time conversion for appointments
 */

/**
 * Parses a UTC string and returns a Date object
 * Ensures the string is in ISO format with 'Z' suffix
 * @param {string} utcString - UTC date string from backend
 * @returns {Date|null} - Date object or null if invalid
 */
export const parseUTCToPH = (utcString) => {
  if (!utcString) return null;

  // Ensure the string has 'Z' suffix for proper UTC parsing
  const isoString = utcString.includes("Z") ? utcString : utcString + "Z";
  const date = new Date(isoString);

  // Validate the date
  if (isNaN(date.getTime())) return null;

  return date;
};

/**
 * Formats appointment date and time range in Philippine Time
 * @param {string} scheduledDate - UTC start date string
 * @param {string} endDate - UTC end date string
 * @returns {Object} - { date: string, timeRange: string }
 */
export const formatAppointmentDateTime = (scheduledDate, endDate) => {
  const startDate = parseUTCToPH(scheduledDate);
  if (!startDate) return { date: "N/A", timeRange: "N/A" };

  const actualEndDate = endDate ? parseUTCToPH(endDate) : null;

  // Format date in Philippine Time
  const formattedDate = startDate.toLocaleDateString("en-US", {
    timeZone: "Asia/Manila",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format start time in Philippine Time
  const startTime = startDate.toLocaleTimeString("en-US", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // If no end date, return just the start time
  if (!actualEndDate) return { date: formattedDate, timeRange: startTime };

  // Format end time in Philippine Time
  const endTime = actualEndDate.toLocaleTimeString("en-US", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date: formattedDate, timeRange: `${startTime} - ${endTime}` };
};

/**
 * Formats a single date to Philippine Time
 * @param {string} dateString - UTC date string
 * @returns {string} - Formatted date string
 */
export const formatDatePH = (dateString) => {
  const date = parseUTCToPH(dateString);
  if (!date) return "N/A";

  return date.toLocaleDateString("en-US", {
    timeZone: "Asia/Manila",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats a single time to Philippine Time
 * @param {string} dateString - UTC date string
 * @returns {string} - Formatted time string
 */
export const formatTimePH = (dateString) => {
  const date = parseUTCToPH(dateString);
  if (!date) return "N/A";

  return date.toLocaleTimeString("en-US", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};