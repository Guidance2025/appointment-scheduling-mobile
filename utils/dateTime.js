export const getCurrentPHTime = () => {
  return new Date();
};

export const parseUTCToPH = (utcString) => {
  if (!utcString) return null;
  try {
    let dateString = utcString;
    
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

export const convertLocalToUTCISO = (localDate) => {
  if (!(localDate instanceof Date)) localDate = new Date(localDate);
  
  const phOffset = 8 * 60 * 60 * 1000; 
  const phDate = new Date(localDate.getTime() + phOffset);
  
  const year = phDate.getUTCFullYear();
  const month = String(phDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(phDate.getUTCDate()).padStart(2, '0');
  const hours = String(phDate.getUTCHours()).padStart(2, '0');
  const minutes = String(phDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(phDate.getUTCSeconds()).padStart(2, '0');
  
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

export const formatDateTimeLong = (utcString) => {
  const date = parseUTCToPH(utcString);
  if (!date) return "";
  const datePart = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `${datePart}`;
};