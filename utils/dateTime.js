// utils/dateTime.js

export const getCurrentPHTime = () => {
  return new Date();
};

export const parseUTCToPH = (utcString) => {
  if (!utcString) return null;
  try {
    let dateString = utcString;
    
    // Backend sends timestamps without 'Z' but they ARE in UTC
    // If the string doesn't have a timezone indicator, append 'Z' to force UTC parsing
    if (!dateString.includes('Z') && !dateString.includes('+') && !dateString.match(/-\d{2}:\d{2}$/)) {
      dateString = dateString + 'Z';
    }
    
    const utcDate = new Date(dateString);
    
    if (isNaN(utcDate.getTime())) return null;
    
    return utcDate;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

export const formatRelativeTimePH = (utcString, currentTime = null) => {
  const utcDate = parseUTCToPH(utcString);
  if (!utcDate) return "";

  const now = currentTime || new Date();
  
  const diffMs = now.getTime() - utcDate.getTime();
  const diff = Math.floor(diffMs / 1000);

  if (diff < 0) return "just now";

  if (diff < 60) {
    return "just now";
  }
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
  if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
  if (diff < 2592000) {
    const weeks = Math.floor(diff / 604800);
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  }
  const months = Math.floor(diff / 2592000);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
};

export const formatAppointmentDateTime = (scheduledDateUTC, endDateUTC) => {
  if (!scheduledDateUTC || !endDateUTC) return { date: "", timeRange: "" };

  const start = parseUTCToPH(scheduledDateUTC);
  const end = parseUTCToPH(endDateUTC);
  
  if (!start || !end) return { date: "", timeRange: "" };

  const date = start.toLocaleDateString("en-PH", { 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit" 
  });
  
  const startTime = start.toLocaleTimeString("en-PH", { 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: true 
  });
  
  const endTime = end.toLocaleTimeString("en-PH", { 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: true 
  });

  return { date, timeRange: `${startTime} - ${endTime}` };
};

// ✅ FIXED: Convert RN DatePicker output to backend-expected format
// ✅ CORRECTED: Convert RN DatePicker output to backend-expected format
export const convertLocalToUTCISO = (localDate) => {
  if (!(localDate instanceof Date)) localDate = new Date(localDate);
  
  // React Native DateTimePicker quirk:
  // - User picks "8:30 AM PH" on Jan 7
  // - RN stores it as: 2026-01-07T00:30:00.000Z (midnight UTC, displays as 8:30 AM locally)
  // - We need to send: "2026-01-07T08:30:00" (8:30 AM PH local time)
  // - Backend will interpret this as PH time and convert to UTC (subtracting 8 hours back to 00:30 UTC)
  
  // The visual display time is what the user intended
  // So we need to ADD 8 hours to the UTC time to get the PH local time value
  const phOffset = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
  const phDate = new Date(localDate.getTime() + phOffset);
  
  // Extract components from the adjusted date
  const year = phDate.getUTCFullYear();
  const month = String(phDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(phDate.getUTCDate()).padStart(2, '0');
  const hours = String(phDate.getUTCHours()).padStart(2, '0');
  const minutes = String(phDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(phDate.getUTCSeconds()).padStart(2, '0');
  
  // Return as ISO string WITHOUT 'Z' (backend interprets as PH local time)
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const combineDateAndTimePH = (date, time) => {
  const combined = new Date(date);
  combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return combined;
};

export const formatDatePH = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-PH", { 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit" 
  });
};

export const formatTimePH = (date) => {
  if (!date) return "";
  return date.toLocaleTimeString("en-PH", { 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: true 
  });
};