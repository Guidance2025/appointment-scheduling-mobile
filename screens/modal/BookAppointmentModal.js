import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../constants/api";
import styles from "./../../styles/BookAppointmentModalStyles";
import { SuccessMessage } from "./message/SuccessMessage";
import { 
  getCurrentPHTime,
  formatDatePH,
  formatTimePH,
  convertLocalToUTCISO,
  parseUTCToPH
} from "../../utils/dateTime";
import { CustomCalendar } from "./CustomCalendar";

const getInitialStartTime = () => {
  const date = getCurrentPHTime();
  const currentHour = date.getHours();
  const currentMinute = date.getMinutes();
  
  if (currentHour < 8) {
    date.setHours(8, 0, 0, 0);
  } else if (currentHour >= 16) {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    return tomorrow;
  } else {
    const nextHour = currentMinute > 0 ? currentHour + 1 : currentHour;
    date.setHours(nextHour, 0, 0, 0);
  }
  
  return date;
};

const getInitialEndTime = () => {
  const startTime = getInitialStartTime();
  const endTime = new Date(startTime);
  endTime.setHours(Math.min(startTime.getHours() + 1, 17), 0, 0, 0);
  return endTime;
};

export default function BookAppointmentModal({ visible, onClose, onSuccess }) {
  const [appointmentType, setAppointmentType] = useState("");
  const [guidanceStaffId, setGuidanceStaffId] = useState(null);
  const [guidanceStaffList, setGuidanceStaffList] = useState([]);
  const [scheduledDate, setScheduledDate] = useState(getInitialStartTime());
  const [endDate, setEndDate] = useState(getInitialEndTime());
  const [notes, setNotes] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showAppointmentTypes, setShowAppointmentTypes] = useState(false);
  const [showGuidanceStaff, setShowGuidanceStaff] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fullyBlockedDates, setFullyBlockedDates] = useState([]);
  const [isLoadingBlockedDates, setIsLoadingBlockedDates] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [conflictMessage, setConflictMessage] = useState("");
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
  const [errorFields, setErrorFields] = useState({
    appointmentType: false,
    counselor: false,
    date: false,
    startTime: false,
    endTime: false,
    notes: false
  });

  const appointmentTypes = ["Counseling", "Academic Advising", "Career Guidance", "Personal Issue"];

  const clearFieldError = (fieldName) => {
    setErrorFields(prev => ({ ...prev, [fieldName]: false }));
    
    if (error) {
      const errorLower = error.toLowerCase();
      const shouldClearError = (
        (fieldName === 'appointmentType' && errorLower.includes('appointment type')) ||
        (fieldName === 'counselor' && errorLower.includes('counselor')) ||
        (fieldName === 'date' && (errorLower.includes('date') || errorLower.includes('weekend') || errorLower.includes('blocked') || errorLower.includes('past') || errorLower.includes('available') || errorLower.includes('too late'))) ||
        (fieldName === 'startTime' && (errorLower.includes('start') || errorLower.includes('8:00 am') || errorLower.includes('time has already passed') || errorLower.includes('after'))) ||
        (fieldName === 'endTime' && (errorLower.includes('end') || errorLower.includes('5:00 pm') || errorLower.includes('after'))) ||
        (fieldName === 'notes' && errorLower.includes('notes'))
      );
      
      if (shouldClearError) {
        setError('');
      }
    }
  };

  useEffect(() => {
    if (visible) {
      fetchGuidanceStaff();
      setScheduledDate(getInitialStartTime());
      setEndDate(getInitialEndTime());
    }
  }, [visible]);

  useEffect(() => {
    if (guidanceStaffId !== null && guidanceStaffId !== undefined) {
      fetchBlockedDates(guidanceStaffId);
    } else {
      setFullyBlockedDates([]);
    }
  }, [guidanceStaffId]);

  useEffect(() => {
    if (guidanceStaffId && scheduledDate && endDate) {
      checkForConflicts();
    } else {
      setHasConflict(false);
      setConflictMessage("");
    }
  }, [guidanceStaffId, scheduledDate, endDate]);

  useEffect(() => {
    if (scheduledDate && endDate) {
      const validationError = validateDates();
      if (validationError) {
        setError(validationError);
        updateErrorFields(validationError);
      } else {
        if (error && !error.includes("already have an appointment") && !error.includes("Scheduling conflict")) {
          if (error.includes("time") || 
            error.includes("date") || 
            error.includes("past") || 
            error.includes("weekend") || 
            error.includes("available") ||
            error.includes("5:00 PM") ||
            error.includes("8:00 AM") ||
            error.includes("after") ||
            error.includes("duration") || 
            error.includes("exceed") ||
            error.includes("blocked") ||
            error.includes("not available") ||
            error.includes("Too late")
          ) {
            setError("");
            clearErrorFields();
          }
        }
      }
    }
  }, [scheduledDate, endDate, fullyBlockedDates]);

  const checkForConflicts = async () => {
    try {
      setIsCheckingConflicts(true);
      setHasConflict(false);
      setConflictMessage("");
      
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) return;

      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const response = await fetch(
        `${API_BASE_URL}/student/appointments/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const appointments = await response.json();
        
        const conflict = appointments.find(apt => {
          if (!apt.scheduledDate || !apt.endDate || !apt.guidanceStaff) return false;
          
          const aptStartDate = parseUTCToPH(apt.scheduledDate);
          const aptEndDate = parseUTCToPH(apt.endDate);
          
          if (!aptStartDate || !aptEndDate) return false;
          
          const aptStaffId = apt.guidanceStaff.id || apt.guidanceStaff.employeeNumber;
          const selectedStaffId = guidanceStaffId;
          
          const isActiveStatus = apt.status === 'PENDING' || apt.status === 'SCHEDULED';
          
          if (!isActiveStatus) return false;
          
          const isSameCounselor = aptStaffId === selectedStaffId;
          
          const aptDateStr = `${aptStartDate.getFullYear()}-${String(aptStartDate.getMonth() + 1).padStart(2, '0')}-${String(aptStartDate.getDate()).padStart(2, '0')}`;
          const selectedDateStr = `${scheduledDate.getFullYear()}-${String(scheduledDate.getMonth() + 1).padStart(2, '0')}-${String(scheduledDate.getDate()).padStart(2, '0')}`;
          const isSameDate = aptDateStr === selectedDateStr;
          
          if (isSameCounselor && isSameDate) {
            return true; 
          }
          
          const selectedStart = scheduledDate.getTime();
          const selectedEnd = endDate.getTime();
          const aptStart = aptStartDate.getTime();
          const aptEnd = aptEndDate.getTime();
          const hasTimeOverlap = (selectedStart < aptEnd) && (selectedEnd > aptStart);
          
          if (hasTimeOverlap) {
            return true; 
          }
          
          return false;
        });

        if (conflict) {
          setHasConflict(true);
          const conflictStartDate = parseUTCToPH(conflict.scheduledDate);
          const conflictEndDate = parseUTCToPH(conflict.endDate);
          
          const conflictStaffId = conflict.guidanceStaff.id || conflict.guidanceStaff.employeeNumber;
          const isSameCounselor = conflictStaffId === guidanceStaffId;
          
          const conflictDateStr = `${conflictStartDate.getFullYear()}-${String(conflictStartDate.getMonth() + 1).padStart(2, '0')}-${String(conflictStartDate.getDate()).padStart(2, '0')}`;
          const selectedDateStr = `${scheduledDate.getFullYear()}-${String(scheduledDate.getMonth() + 1).padStart(2, '0')}-${String(scheduledDate.getDate()).padStart(2, '0')}`;
          const isSameDate = conflictDateStr === selectedDateStr;
          
          let message = "";
          
          if (isSameCounselor && isSameDate) {
            message = `You already have an appointment with this counselor on ${formatDatePH(conflictStartDate)}. Please choose a different date or counselor.`;
            setErrorFields(prev => ({ ...prev, counselor: true, date: true }));
          } else {
            const conflictCounselorName = conflict.guidanceStaff.person 
              ? `${conflict.guidanceStaff.person.firstName} ${conflict.guidanceStaff.person.lastName}`
              : "another counselor";
            
            message = `Scheduling conflict: You have an appointment with ${conflictCounselorName} from ${formatTimePH(conflictStartDate)} to ${formatTimePH(conflictEndDate)} on ${formatDatePH(conflictStartDate)}. Please choose a different time.`;
            setErrorFields(prev => ({ ...prev, date: true, startTime: true, endTime: true }));
          }
          
          setConflictMessage(message);
          setError(message);
        } else {
          if (error.includes("already have an appointment") || error.includes("Scheduling conflict")) {
            setError("");
            clearErrorFields();
          }
        }
      }
    } catch (err) {
      console.error("Error checking conflicts:", err);
    } finally {
      setIsCheckingConflicts(false);
    }
  };

  const fetchGuidanceStaff = async () => {
    try {
      setLoadingStaff(true);
      setError("");
      
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) { 
        setError("Authentication token not found. Please log in again."); 
        return; 
      }

      const response = await fetch(`${API_BASE_URL}/counselor/all`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
        } else if (response.status === 403) {
          setError("Access denied. You don't have permission to view counselors.");
        } else if (response.status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to load guidance staff. Please try again.");
        }
        return;
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        setError("No counselors available at the moment.");
        return;
      }
      
      setGuidanceStaffList(data);
    } catch (err) {
      if (err.message.includes("Network request failed")) {
        setError("Network error. Please check your internet connection.");
      } else if (err.message.includes("timeout")) {
        setError("Request timeout. Please try again.");
      } else {
        setError("Failed to load guidance staff. Please try again.");
      }
    } finally {
      setLoadingStaff(false);
    }
  };

  const fetchBlockedDates = async (selectedStaffId) => {
    try {
      setIsLoadingBlockedDates(true);
      setFullyBlockedDates([]);
      
      const token = await AsyncStorage.getItem("jwtToken");
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const staffIdNumber = typeof selectedStaffId === 'string' 
        ? parseInt(selectedStaffId, 10) 
        : selectedStaffId;

      if (!staffIdNumber || isNaN(staffIdNumber)) {
        setError("Invalid counselor selected. Please try again.");
        return;
      }

      const url = `${API_BASE_URL}/counselor/availability/blocks/${staffIdNumber}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
        } else if (response.status === 403) {
          setError("Access denied. You don't have permission to view this counselor's availability.");
        } else if (response.status === 404) {
          setError("Counselor not found. Please select a different counselor.");
        } else if (response.status >= 500) {
          setError("Server error while loading availability. Please try again later.");
        }
        return;
      }

      const blocks = await response.json();
      
      if (!Array.isArray(blocks)) {
        return;
      }
      
      const fullDayBlocks = blocks.filter(block => {
        const hasNullEnd = !block.endDate || block.endDate === null || block.endDate === "";
        return hasNullEnd;
      });
      
      const fullyBlocked = fullDayBlocks
        .map(block => {
          const dateStr = block.scheduledDate;
          
          if (!dateStr) return null;
          
          try {
            const phDate = parseUTCToPH(dateStr);
            if (!phDate) return null;
            
            const year = phDate.getFullYear();
            const month = String(phDate.getMonth() + 1).padStart(2, '0');
            const day = String(phDate.getDate()).padStart(2, '0');
            const formatted = `${year}-${month}-${day}`;
            
            return formatted;
          } catch (parseError) {
            return null;
          }
        })
        .filter(date => date !== null);

      setFullyBlockedDates(fullyBlocked);
    } catch (err) {
      if (err.message.includes("Network request failed")) {
        setError("Network error. Please check your internet connection.");
      } else if (err.message.includes("timeout")) {
        setError("Request timeout. Please try again.");
      }
      
      setFullyBlockedDates([]);
    } finally {
      setIsLoadingBlockedDates(false);
    }
  };

  const isDateBlocked = (date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) return true;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${dayOfMonth}`;
    
    return fullyBlockedDates.includes(dateString);
  };

  const validateDates = () => {
    try {
      const now = getCurrentPHTime();
      now.setSeconds(0, 0);
      
      const schedStart = new Date(scheduledDate);
      schedStart.setSeconds(0, 0);
      
      const schedEnd = new Date(endDate);
      schedEnd.setSeconds(0, 0);
      
      const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const schedDateOnly = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate());
      
      if (isDateBlocked(scheduledDate)) {
        setErrorFields(prev => ({ ...prev, date: true }));
        return "This date is blocked by the counselor and not available for appointments";
      }

      if (schedDateOnly < nowDateOnly) {
        setErrorFields(prev => ({ ...prev, date: true }));
        return "Appointment date cannot be in the past. Please select today or a future date.";
      }
      
      if (schedDateOnly.getTime() === nowDateOnly.getTime()) {
        if (schedStart <= now) {
          setErrorFields(prev => ({ ...prev, startTime: true }));
          return "Appointment time has already passed. Please select a future time.";
        }
      }

      if (schedEnd <= schedStart) {
        setErrorFields(prev => ({ ...prev, startTime: true, endTime: true }));
        return "End time must be after start time";
      }

      const startHour = scheduledDate.getHours();
      const startMinute = scheduledDate.getMinutes();
      const endHour = endDate.getHours();
      const endMinute = endDate.getMinutes();
      
      if (startHour < 8) {
        setErrorFields(prev => ({ ...prev, startTime: true }));
        return "Appointments cannot start before 8:00 AM";
      }
      if (startHour >= 17) {
        setErrorFields(prev => ({ ...prev, startTime: true }));
        return "Appointments cannot start at or after 5:00 PM";
      }

      if (endHour > 17 || (endHour === 17 && endMinute > 0)) {
        setErrorFields(prev => ({ ...prev, endTime: true }));
        return "Appointments must end by 5:00 PM";
      }

      const day = scheduledDate.getDay();
      if (day === 0 || day === 6) {
        setErrorFields(prev => ({ ...prev, date: true }));
        return "Appointments cannot be scheduled on weekends";
      }

      return "";
    } catch (err) {
      return "Error validating dates. Please check your input.";
    }
  };

  const updateErrorFields = (errorMessage) => {
    const newErrorFields = {
      appointmentType: false,
      counselor: false,
      date: false,
      startTime: false,
      endTime: false,
      notes: false
    };

    if (errorMessage.includes("appointment type")) {
      newErrorFields.appointmentType = true;
    }
    if (errorMessage.includes("counselor") || errorMessage.includes("Counselor")) {
      newErrorFields.counselor = true;
    }
    if (errorMessage.includes("date") || errorMessage.includes("weekend") || errorMessage.includes("blocked") || errorMessage.includes("past")) {
      newErrorFields.date = true;
    }
    if (errorMessage.includes("start") || errorMessage.includes("Start") || errorMessage.includes("8:00 AM") || errorMessage.includes("after")) {
      newErrorFields.startTime = true;
    }
    if (errorMessage.includes("end") || errorMessage.includes("End") || errorMessage.includes("5:00 PM") || errorMessage.includes("after")) {
      newErrorFields.endTime = true;
    }

    setErrorFields(newErrorFields);
  };

  const clearErrorFields = () => {
    setErrorFields({
      appointmentType: false,
      counselor: false,
      date: false,
      startTime: false,
      endTime: false,
      notes: false
    });
  };

  const handleSubmit = async () => {
    if (!appointmentType) { 
      setError("Please select an appointment type");
      setErrorFields(prev => ({ ...prev, appointmentType: true }));
      return; 
    }
    if (!guidanceStaffId) { 
      setError("Please select a counselor");
      setErrorFields(prev => ({ ...prev, counselor: true }));
      return; 
    }

    const validationError = validateDates();
    if (validationError) { 
      setError(validationError);
      updateErrorFields(validationError);
      return; 
    }

    if (hasConflict) {
      return;
    }

    setIsProcessing(true);
    setError("");
    clearErrorFields();
    
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) { 
        setError("Authentication token not found. Please log in again."); 
        return; 
      }

      const scheduledUTC = convertLocalToUTCISO(scheduledDate);
      const endUTC = convertLocalToUTCISO(endDate);

      const requestData = {
        guidanceStaff: { id: guidanceStaffId },
        scheduledDate: scheduledUTC,
        endDate: endUTC,
        appointmentType,
        notes: notes.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/student/create-appointment`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await response.text();

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          return;
        }
        
        if (response.status === 403) {
          setError("Access denied. You don't have permission to create appointments.");
          return;
        }
        
        if (response.status === 400) {
          if (responseText.includes("STUDENT ALREADY HAS AN APPOINTMENT")) {
            setError("You already have a pending or scheduled appointment");
            return;
          }
          if (responseText.includes("YOU HAVE REACHED THE MAXIMUM LIMIT")) {
            setError("You have reached the maximum limit of appointments.");
            return;
          }
          if (responseText.toLowerCase().includes("you already have an appointment with this counselor on this day")) {
            setError("You already have an appointment with this counselor on this day. Please choose a different date or counselor.");
            setErrorFields(prev => ({ ...prev, counselor: true, date: true }));
            return;
          }
          if (responseText.toLowerCase().includes("guidance staff has an appointment")) {
            setError("This counselor already has an appointment at this time. Please choose a different time.");
            setErrorFields(prev => ({ ...prev, startTime: true, endTime: true }));
            return;
          }
          if (responseText.toLowerCase().includes("time slot")) {
            setError("This time slot is not available. Please choose a different time.");
            setErrorFields(prev => ({ ...prev, startTime: true, endTime: true }));
            return;
          }
          if (responseText.toLowerCase().includes("invalid")) {
            setError("Invalid appointment details. Please check your input.");
            return;
          } 
          setError(responseText || "Invalid appointment details. Please check your input.");
          return;
        }
        
        if (response.status === 404) {
          setError("Counselor not found. Please select a different counselor.");
          setErrorFields(prev => ({ ...prev, counselor: true }));
          return;
        }
        
        if (response.status === 409) {
          if (responseText.includes("YOU ALREADY HAVE AN APPOINTMENT WITH THIS COUNSELOR")) {
            setError("You already have an appointment with this counselor on this day. Please choose a different date or counselor.");
            setErrorFields(prev => ({ ...prev, counselor: true, date: true }));
            return;
          }
          if (responseText.toLowerCase().includes("time conflict") || responseText.toLowerCase().includes("overlapping")) {
            setError("Time conflict detected. Please choose a different time.");
            setErrorFields(prev => ({ ...prev, startTime: true, endTime: true }));
            return;
          }
          setError("Scheduling conflict. Please choose a different time or date.");
          setErrorFields(prev => ({ ...prev, date: true, startTime: true, endTime: true }));
          return;
        }
        
        if (response.status >= 500) {
          setError("Server error. Please try again later.");
          return;
        }
        
        setError(responseText || "Failed to create appointment. Please try again.");
        return;
      }

      setShowSuccess(true);
      
    } catch (err) {
      if (err.message.includes("Network request failed")) {
        setError("Network error. Please check your internet connection.");
      } else if (err.message.includes("timeout")) {
        setError("Request timeout. Please try again.");
      } else if (err.message.includes("JSON")) {
        setError("Invalid server response. Please try again.");
      } else {
        setError(err.message || "Failed to create appointment. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    resetForm();
    onClose();
    if (onSuccess) onSuccess();
  };

  const resetForm = () => {
    setAppointmentType("");
    setGuidanceStaffId(null);
    setScheduledDate(getInitialStartTime());
    setEndDate(getInitialEndTime());
    setNotes("");
    setError("");
    setShowAppointmentTypes(false);
    setShowGuidanceStaff(false);
    setFullyBlockedDates([]);
    setHasConflict(false);
    setConflictMessage("");
    clearErrorFields();
  };

  const handleCounselorSelect = (staff) => {
    try {
      const staffId = staff.id || staff.employeeNumber;
      
      if (!staffId) {
        setError("Invalid counselor data. Please try again.");
        return;
      }
      
      if (staffId !== guidanceStaffId) {
        setGuidanceStaffId(staffId);
        setShowGuidanceStaff(false);
        
        setError('');
        clearErrorFields();
      } else {
        setShowGuidanceStaff(false);
      }
    } catch (err) {
      setError("Error selecting counselor. Please try again.");
    }
  };

  const handleDateSelect = (selectedDate) => {
    try {
      const now = getCurrentPHTime();
      const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const currentDateOnly = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate());
      const isSameDate = selectedDateOnly.getTime() === currentDateOnly.getTime();
      
      if (isDateBlocked(selectedDate)) {
        setError("This date is blocked by the counselor and not available for appointments");
        setErrorFields(prev => ({ ...prev, date: true }));
        return;
      }
      
      let newStartTime;
      
      if (selectedDateOnly.getTime() === todayDateOnly.getTime()) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        if (currentHour >= 16) {
          setError("Too late to book appointments today. Please select a future date.");
          setErrorFields(prev => ({ ...prev, date: true }));
          return;
        }
        
        const nextAvailableHour = currentMinute > 0 ? currentHour + 1 : currentHour;
        const startHour = Math.max(8, Math.min(nextAvailableHour, 16));
        
        newStartTime = new Date(selectedDate);
        newStartTime.setHours(startHour, 0, 0, 0);
      } else {
        newStartTime = new Date(selectedDate);
        newStartTime.setHours(8, 0, 0, 0);
      }
      
      setScheduledDate(newStartTime);

      const newEndTime = new Date(newStartTime);
      newEndTime.setHours(Math.min(newStartTime.getHours() + 1, 17), 0, 0, 0);
      setEndDate(newEndTime);
      
      setShowCalendar(false);
      
      if (!isSameDate) {
        setError('');
        clearErrorFields();
      }
    } catch (err) {
      setError("Error selecting date. Please try again.");
    }
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(Platform.OS === "ios");
    if (!selectedTime) return;
    
    try {
      const currentHour = scheduledDate.getHours();
      const currentMinute = scheduledDate.getMinutes();
      const selectedHour = selectedTime.getHours();
      const selectedMinute = selectedTime.getMinutes();
      
      const timeChanged = currentHour !== selectedHour || currentMinute !== selectedMinute;
      
      const newDate = new Date(scheduledDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setScheduledDate(newDate);

      const newEnd = new Date(newDate);
      newEnd.setHours(Math.min(newDate.getHours() + 1, 17), 0, 0, 0);
      setEndDate(newEnd);
      
      if (timeChanged) {
        clearFieldError('startTime');
        
        if (errorFields.endTime) {
          clearFieldError('endTime');
        }
      }
    } catch (err) {
      setError("Error setting start time. Please try again.");
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(Platform.OS === "ios");
    if (!selectedTime) return;
    
    try {
      const currentHour = endDate.getHours();
      const currentMinute = endDate.getMinutes();
      const selectedHour = selectedTime.getHours();
      const selectedMinute = selectedTime.getMinutes();
      
      const timeChanged = currentHour !== selectedHour || currentMinute !== selectedMinute;
      
      const newDate = new Date(endDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      if (newDate > scheduledDate) {
        setEndDate(newDate);
        
        if (timeChanged) {
          clearFieldError('endTime');
          
          if (errorFields.startTime) {
            clearFieldError('startTime');
          }
        }
      }
    } catch (err) {
      setError("Error setting end time. Please try again.");
    }
  };

  const getSelectedStaffName = () => {
    try {
      const staff = guidanceStaffList.find(s => s.id === guidanceStaffId || s.employeeNumber === guidanceStaffId);
      return staff?.person 
        ? `${staff.person.firstName} ${staff.person.lastName}` 
        : "Select Counselor";
    } catch (err) {
      return "Select Counselor";
    }
  };

  const isFormValid = appointmentType && 
                      guidanceStaffId && 
                      !error && 
                      !isLoadingBlockedDates && 
                      !hasConflict &&
                      !isCheckingConflicts;

  const today = getCurrentPHTime();
  const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Book Appointment</Text>
                  <TouchableOpacity onPress={() => { resetForm(); onClose(); }}>
                    <Ionicons name="close" size={28} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={styles.modalBody} 
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Show error at top only if it's NOT a start/end time error */}
                  {error && !errorFields.startTime && !errorFields.endTime && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={20} color="#DC2626" />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Appointment Type <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity 
                      style={[
                        styles.selectInput,
                        errorFields.appointmentType && styles.inputError
                      ]} 
                      onPress={() => {
                        setShowAppointmentTypes(!showAppointmentTypes);
                      }} 
                      disabled={isProcessing}
                      activeOpacity={0.7}
                    >
                      <Text style={appointmentType ? styles.selectText : styles.selectPlaceholder}>
                        {appointmentType || "Select Appointment Type"}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    {showAppointmentTypes && (
                      <View style={styles.dropdown}>
                        {appointmentTypes.map(type => (
                          <TouchableOpacity 
                            key={type} 
                            style={styles.dropdownItem} 
                            onPress={() => { 
                              setAppointmentType(type); 
                              setShowAppointmentTypes(false); 
                              clearFieldError('appointmentType');
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.dropdownItemText}>{type}</Text>
                            {appointmentType === type && (
                              <Ionicons name="checkmark" size={20} color="#48BB78" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Counselor <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity 
                      style={[
                        styles.selectInput,
                        errorFields.counselor && styles.inputError
                      ]} 
                      onPress={() => {
                        setShowGuidanceStaff(!showGuidanceStaff);
                      }} 
                      disabled={isProcessing || loadingStaff}
                      activeOpacity={0.7}
                    >
                      <Text style={guidanceStaffId ? styles.selectText : styles.selectPlaceholder}>
                        {loadingStaff ? "Loading..." : getSelectedStaffName()}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    {showGuidanceStaff && (
                      <ScrollView style={styles.dropdown} nestedScrollEnabled>
                        {guidanceStaffList.length > 0 ? (
                          guidanceStaffList.map(staff => {
                            const staffId = staff.id || staff.employeeNumber;
                            return (
                              <TouchableOpacity 
                                key={staffId} 
                                style={styles.dropdownItem} 
                                onPress={() => handleCounselorSelect(staff)}
                                activeOpacity={0.7}
                              >
                                <Text style={styles.dropdownItemText}>
                                  {staff.person?.firstName} {staff.person?.lastName}
                                </Text>
                                {guidanceStaffId === staffId && (
                                  <Ionicons name="checkmark" size={20} color="#48BB78" />
                                )}
                              </TouchableOpacity>
                            );
                          })
                        ) : (
                          <View style={styles.dropdownItem}>
                            <Text style={styles.dropdownItemText}>No counselors available</Text>
                          </View>
                        )}
                      </ScrollView>
                    )}
                  </View>

                  {isLoadingBlockedDates && (
                    <View style={styles.hintContainer}>
                      <ActivityIndicator size="small" color="#D97706" />
                      <Text style={styles.hintText}>Loading counselor's availability...</Text>
                    </View>
                  )}

                  {guidanceStaffId && !isLoadingBlockedDates && (
                    <View style={[styles.hintContainer, styles.hintContainerSuccess]}>
                      <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                      <Text style={[styles.hintText, styles.hintTextSuccess]}>
                        {fullyBlockedDates.length > 0 
                          ? `${fullyBlockedDates.length} dates unavailable` 
                          : "All dates available"}
                      </Text>
                    </View>
                  )}

                  {isCheckingConflicts && (
                    <View style={styles.hintContainer}>
                      <ActivityIndicator size="small" color="#3B82F6" />
                      <Text style={styles.hintText}>Checking for conflicts...</Text>
                    </View>
                  )}

                  {hasConflict && (
                    <View style={styles.warningContainer}>
                      <Ionicons name="warning" size={20} color="#D97706" />
                      <Text style={styles.warningText}>{conflictMessage}</Text>
                    </View>
                  )}

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Appointment Date <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity 
                      style={[
                        styles.dateTimeInput,
                        errorFields.date && styles.inputError
                      ]} 
                      onPress={() => {
                        setShowCalendar(true);
                      }} 
                      disabled={isProcessing || isLoadingBlockedDates || !guidanceStaffId}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="calendar-outline" size={22} color="#10B981" />
                      <Text style={styles.dateTimeText}>{formatDatePH(scheduledDate)}</Text>
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View style={styles.hintContainer}>
                      <Ionicons name="information-circle-outline" size={16} color="#D97706" />
                      <Text style={styles.hintText}>
                        {!guidanceStaffId 
                          ? "Please select a counselor first" 
                          : "Weekends and blocked dates are not available"}
                      </Text>
                    </View>
                  </View>

                  {/* Show error above Start Time if it's a start/end time error */}
                  {error && (errorFields.startTime || errorFields.endTime) && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={20} color="#DC2626" />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Start Time <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity 
                      style={[
                        styles.dateTimeInput,
                        errorFields.startTime && styles.inputError
                      ]} 
                      onPress={() => {
                        setShowStartTimePicker(true);
                      }} 
                      disabled={isProcessing}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="time-outline" size={22} color="#10B981" />
                      <Text style={styles.dateTimeText}>{formatTimePH(scheduledDate)}</Text>
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>End Time <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity 
                      style={[
                        styles.dateTimeInput,
                        errorFields.endTime && styles.inputError
                      ]} 
                      onPress={() => {
                        setShowEndTimePicker(true);
                      }} 
                      disabled={isProcessing}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="time-outline" size={22} color="#10B981" />
                      <Text style={styles.dateTimeText}>{formatTimePH(endDate)}</Text>
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Notes (Optional)</Text>
                    <TextInput 
                      style={styles.textArea} 
                      value={notes} 
                      onChangeText={(text) => {
                        setNotes(text);
                        clearFieldError('notes');
                      }} 
                      placeholder="Additional notes or concerns..." 
                      placeholderTextColor="#9CA3AF"
                      multiline 
                      numberOfLines={4} 
                      maxLength={500} 
                      editable={!isProcessing}
                      returnKeyType="done"
                      blurOnSubmit={true}
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <Text style={styles.charCount}>{notes.length}/500</Text>
                  </View>

                  <TouchableOpacity 
                    style={[
                      styles.submitButton, 
                      (!isFormValid || isProcessing) && styles.submitButtonDisabled
                    ]} 
                    onPress={handleSubmit} 
                    disabled={!isFormValid || isProcessing}
                    activeOpacity={0.8}
                  >
                    {isProcessing ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.submitButtonText}>Set Appointment</Text>
                    )}
                  </TouchableOpacity>
                </ScrollView>

                {showCalendar && (
                  <CustomCalendar
                    visible={showCalendar}
                    selectedDate={scheduledDate}
                    onDateSelect={handleDateSelect}
                    onClose={() => setShowCalendar(false)}
                    minDate={today}
                    maxDate={endOfNextMonth}
                    blockedDates={fullyBlockedDates}
                  />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {showStartTimePicker && (
        <DateTimePicker 
          value={scheduledDate} 
          mode="time" 
          display="default" 
          onChange={onStartTimeChange} 
        />
      )}
      {showEndTimePicker && (
        <DateTimePicker 
          value={endDate} 
          mode="time" 
          display="default" 
          onChange={onEndTimeChange} 
          minimumDate={scheduledDate} 
        />
      )}

      <SuccessMessage 
        visible={showSuccess} 
        title="Success" 
        message="Appointment request sent successfully! Please wait for counselor confirmation." 
        onClose={handleSuccessClose} 
      />
    </>
  );
}