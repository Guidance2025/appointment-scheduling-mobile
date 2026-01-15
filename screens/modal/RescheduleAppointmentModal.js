import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
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

export default function RescheduleAppointmentModal({ visible, onClose, onSuccess, appointment }) {
  const [scheduledDate, setScheduledDate] = useState(getCurrentPHTime());
  const [endDate, setEndDate] = useState(getCurrentPHTime());
  const [reason, setReason] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [fullyBlockedDates, setFullyBlockedDates] = useState([]);
  const [isLoadingBlockedDates, setIsLoadingBlockedDates] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [conflictMessage, setConflictMessage] = useState("");
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
  const [errorFields, setErrorFields] = useState({
    date: false,
    startTime: false,
    endTime: false,
    reason: false
  });

  useEffect(() => {
    if (visible && appointment) {
      console.log("📱 Reschedule modal opened for appointment:", appointment.appointmentId);
      
      const currentStart = parseUTCToPH(appointment.scheduledDate);
      const currentEnd = parseUTCToPH(appointment.endDate);
      
      setScheduledDate(currentStart);
      setEndDate(currentEnd);
      setReason("");
      setError("");
      clearErrorFields();
      
      if (appointment.guidanceStaff?.id) {
        fetchBlockedDates(appointment.guidanceStaff.id);
      }
    }
  }, [visible, appointment]);

  useEffect(() => {
    if (visible && scheduledDate && endDate) {
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
            error.includes("same")
          ) {
            setError("");
            clearErrorFields();
          }
        }
      }
    }
  }, [scheduledDate, endDate, fullyBlockedDates, visible]);

  useEffect(() => {
    if (visible && appointment && scheduledDate && endDate) {
      checkForConflicts();
    } else {
      setHasConflict(false);
      setConflictMessage("");
    }
  }, [scheduledDate, endDate, visible]);

  const checkForConflicts = async () => {
    try {
      setIsCheckingConflicts(true);
      setHasConflict(false);
      setConflictMessage("");
      
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) return;

      const studentId = await AsyncStorage.getItem("studentId");
      if (!studentId) return;

      const response = await fetch(
        `${API_BASE_URL}/student/appointment/${studentId}`,
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
        
        const otherAppointments = appointments.filter(apt => 
          apt.appointmentId !== appointment.appointmentId
        );
        
        const conflict = otherAppointments.find(apt => {
          if (!apt.scheduledDate || !apt.endDate || !apt.guidanceStaff) return false;
          
          const aptStartDate = parseUTCToPH(apt.scheduledDate);
          const aptEndDate = parseUTCToPH(apt.endDate);
          
          if (!aptStartDate || !aptEndDate) return false;
          
          const aptStaffId = apt.guidanceStaff.id || apt.guidanceStaff.employeeNumber;
          const selectedStaffId = appointment.guidanceStaff?.id || appointment.guidanceStaff?.employeeNumber;
          
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
          const selectedStaffId = appointment.guidanceStaff?.id || appointment.guidanceStaff?.employeeNumber;
          const isSameCounselor = conflictStaffId === selectedStaffId;
          
          const conflictDateStr = `${conflictStartDate.getFullYear()}-${String(conflictStartDate.getMonth() + 1).padStart(2, '0')}-${String(conflictStartDate.getDate()).padStart(2, '0')}`;
          const selectedDateStr = `${scheduledDate.getFullYear()}-${String(scheduledDate.getMonth() + 1).padStart(2, '0')}-${String(scheduledDate.getDate()).padStart(2, '0')}`;
          const isSameDate = conflictDateStr === selectedDateStr;
          
          let message = "";
          
          if (isSameCounselor && isSameDate) {
            message = `You already have an appointment with this counselor on ${formatDatePH(conflictStartDate)}. Please choose a different date.`;
            setErrorFields(prev => ({ ...prev, date: true }));
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
      console.error(" Error checking conflicts:", err);
    } finally {
      setIsCheckingConflicts(false);
    }
  };

  const fetchBlockedDates = async (selectedStaffId) => {
    try {
      setIsLoadingBlockedDates(true);
      setFullyBlockedDates([]);
      setError("");
      
      const token = await AsyncStorage.getItem("jwtToken");
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const staffIdNumber = typeof selectedStaffId === 'string' 
        ? parseInt(selectedStaffId, 10) 
        : selectedStaffId;

      if (!staffIdNumber || isNaN(staffIdNumber)) {
        console.error("❌ Invalid staff ID:", selectedStaffId);
        setError("Invalid counselor selected. Please try again.");
        return;
      }

      const url = `${API_BASE_URL}/counselor/availability/blocks/${staffIdNumber}`;
      console.log("📡 Fetching from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Failed to fetch blocked dates:", errorText);
        
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
        } else if (response.status === 403) {
          setError("Access denied. You don't have permission to view this counselor's availability.");
        } else if (response.status === 404) {
          setError("Counselor not found. Please select a different counselor.");
        } else if (response.status >= 500) {
          setError("Server error while loading availability. Please try again later.");
        } else {
          setError("Failed to load counselor's availability. Please try again.");
        }
        return;
      }

      const blocks = await response.json();
      console.log("✅ Total blocks fetched:", blocks.length);
      
      if (!Array.isArray(blocks)) {
        console.error("❌ Invalid response format:", blocks);
        setError("Invalid data received. Please try again.");
        return;
      }
      
      const fullDayBlocks = blocks.filter(block => {
        const hasNullEnd = !block.endDate || block.endDate === null || block.endDate === "";
        return hasNullEnd;
      });
      
      const fullyBlocked = fullDayBlocks
        .map(block => {
          const dateStr = block.scheduledDate;
          
          if (!dateStr) {
            return null;
          }
          
          try {
            const phDate = parseUTCToPH(dateStr);
            if (!phDate) {
              return null;
            }
            
            const year = phDate.getFullYear();
            const month = String(phDate.getMonth() + 1).padStart(2, '0');
            const day = String(phDate.getDate()).padStart(2, '0');
            const formatted = `${year}-${month}-${day}`;
            
            return formatted;
          } catch (parseError) {
            console.error("❌ Error parsing date:", parseError);
            return null;
          }
        })
        .filter(date => date !== null);

      setFullyBlockedDates(fullyBlocked);
      
    } catch (err) {
      console.error("❌ Error fetching blocked dates:", err);
      
      if (err.message.includes("Network request failed")) {
        setError("Network error. Please check your internet connection.");
      } else if (err.message.includes("timeout")) {
        setError("Request timeout. Please try again.");
      } else {
        setError("Failed to load counselor's availability. Continuing with default availability.");
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
      
      if (schedEnd.getTime() === schedStart.getTime()) {
        setErrorFields(prev => ({ ...prev, startTime: true, endTime: true }));
        return "Start time and end time cannot be the same";
      }
      
      if (schedEnd <= schedStart) {
        setErrorFields(prev => ({ ...prev, startTime: true, endTime: true }));
        return "End time must be after start time";
      }

      const durationMinutes = (schedEnd - schedStart) / (1000 * 60);
      if (durationMinutes > 60) {
        setErrorFields(prev => ({ ...prev, startTime: true, endTime: true }));
        return "Appointment duration cannot exceed 1 hour";
      }

      const startHour = scheduledDate.getHours();
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
      console.error("❌ Error validating dates:", err);
      return "Error validating dates. Please check your input.";
    }
  };

  const updateErrorFields = (errorMessage) => {
    const newErrorFields = {
      date: false,
      startTime: false,
      endTime: false,
      reason: false
    };

    if (errorMessage.includes("date") || errorMessage.includes("weekend") || errorMessage.includes("blocked") || errorMessage.includes("past") || errorMessage.includes("available")) {
      newErrorFields.date = true;
    }
    if (errorMessage.includes("start") || errorMessage.includes("Start") || errorMessage.includes("8:00 AM") || errorMessage.includes("same")) {
      newErrorFields.startTime = true;
    }
    if (errorMessage.includes("end") || errorMessage.includes("End") || errorMessage.includes("5:00 PM") || errorMessage.includes("after") || errorMessage.includes("duration") || errorMessage.includes("exceed") || errorMessage.includes("same")) {
      newErrorFields.endTime = true;
    }

    setErrorFields(newErrorFields);
  };

  const clearErrorFields = () => {
    setErrorFields({
      date: false,
      startTime: false,
      endTime: false,
      reason: false
    });
  };

  const handleSubmit = async () => {
    setError("");
    
    try {
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
      clearErrorFields();
      
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) { 
        setError("Authentication token not found. Please log in again."); 
        return; 
      }

      const requestData = {
        appointmentId: appointment.appointmentId,
        newScheduledDate: convertLocalToUTCISO(scheduledDate),
        newEndDate: convertLocalToUTCISO(endDate),
        reason: reason.trim(),
      };

      console.log("📤 Sending reschedule request:", requestData);

      const response = await fetch(`${API_BASE_URL}/student/reschedule`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await response.text();
      console.log("📥 Response:", response.status, responseText);

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          return;
        }
        
        if (response.status === 403) {
          setError("Access denied. You don't have permission to reschedule this appointment.");
          return;
        }
        
        if (response.status === 400) {
          if (responseText.toLowerCase().includes("already been rescheduled")) {
            setError("This appointment has already been rescheduled once. No further reschedules are allowed.");
            return;
          }
          if (responseText.toLowerCase().includes("already passed") || 
              responseText.toLowerCase().includes("past")) {
            setError("Cannot reschedule an appointment that has already passed.");
            setErrorFields(prev => ({ ...prev, date: true }));
            return;
          }
          if (responseText.toLowerCase().includes("blocked") || 
              responseText.toLowerCase().includes("unavailable")) {
            setError("This time slot is blocked. Please choose a different time.");
            setErrorFields(prev => ({ ...prev, date: true, startTime: true, endTime: true }));
            return;
          }
          if (responseText.toLowerCase().includes("counselor") && 
              responseText.toLowerCase().includes("appointment")) {
            setError("This counselor already has an appointment at this time. Please choose a different time.");
            setErrorFields(prev => ({ ...prev, startTime: true, endTime: true }));
            return;
          }
          if (responseText.toLowerCase().includes("already have") || 
              responseText.toLowerCase().includes("conflict")) {
            setError("You have a conflicting appointment at this time. Please choose a different time.");
            setErrorFields(prev => ({ ...prev, date: true, startTime: true, endTime: true }));
            return;
          }
          if (responseText.toLowerCase().includes("same time") ||
              responseText.toLowerCase().includes("same as current")) {
            setError("Please select a different time from the current appointment.");
            setErrorFields(prev => ({ ...prev, startTime: true, endTime: true }));
            return;
          }
          if (responseText.toLowerCase().includes("buffer")) {
            setError("You have another appointment too close to this time (10-minute buffer required).");
            setErrorFields(prev => ({ ...prev, startTime: true, endTime: true }));
            return;
          }
          
          setError(responseText || "Invalid reschedule request. Please check your input.");
          return;
        }
        
        if (response.status === 404) {
          setError("Appointment not found. It may have been cancelled or deleted.");
          return;
        }
        
        if (response.status === 409) {
          setError("Time conflict detected. Please choose a different time.");
          setErrorFields(prev => ({ ...prev, date: true, startTime: true, endTime: true }));
          return;
        }
        
        if (response.status >= 500) {
          setError("Server error. Please try again later.");
          return;
        }
        
        setError(responseText || "Failed to reschedule appointment. Please try again.");
        return;
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse response:", parseError);
        setError("Invalid server response. Please try again.");
        return;
      }
      
      setSuccessMessage("Reschedule request sent! Waiting for counselor approval.");
      setShowSuccess(true);
      
    } catch (err) {
      console.error("❌ Error rescheduling appointment:", err);
      
      if (err.message.includes("Network request failed")) {
        setError("Network error. Please check your internet connection.");
      } else if (err.message.includes("timeout")) {
        setError("Request timeout. Please try again.");
      } else if (err.message.includes("JSON")) {
        setError("Invalid server response. Please try again.");
      } else {
        setError(err.message || "Failed to reschedule appointment. Please try again.");
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
    setScheduledDate(getCurrentPHTime());
    setEndDate(getCurrentPHTime());
    setReason("");
    setError("");
    setFullyBlockedDates([]);
    setHasConflict(false);
    setConflictMessage("");
    clearErrorFields();
  };

  const handleDateSelect = (selectedDate) => {
    try {
      console.log("📅 Date selected:", selectedDate);
      
      if (isDateBlocked(selectedDate)) {
        setError("This date is not available. Please select another date.");
        setErrorFields(prev => ({ ...prev, date: true }));
        return;
      }
      
      const now = getCurrentPHTime();
      const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      let newStartTime;
      
      if (selectedDateOnly.getTime() === todayDateOnly.getTime()) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        if (currentHour >= 16) {
          setError("Too late to reschedule for today. Please select a future date.");
          setErrorFields(prev => ({ ...prev, date: true }));
          return;
        }
        
        const nextAvailableHour = currentMinute > 0 ? currentHour + 1 : currentHour;
        const startHour = Math.max(8, Math.min(nextAvailableHour, 16));
        
        newStartTime = new Date(selectedDate);
        newStartTime.setHours(startHour, 0, 0, 0);
      } else {
        newStartTime = new Date(selectedDate);
        newStartTime.setHours(scheduledDate.getHours(), scheduledDate.getMinutes(), 0, 0);
      }
      
      setScheduledDate(newStartTime);

      const newEnd = new Date(newStartTime);
      const newEndHour = newStartTime.getHours() + 1;
      
      if (newEndHour > 17) {
        newEnd.setHours(17, 0, 0, 0);
      } else {
        newEnd.setHours(newEndHour, newStartTime.getMinutes(), 0, 0);
      }
      
      if (newEnd <= newStartTime) {
        newEnd.setTime(newStartTime.getTime() + 15 * 60 * 1000); 
        
        if (newEnd.getHours() > 17 || (newEnd.getHours() === 17 && newEnd.getMinutes() > 0)) {
          newEnd.setHours(17, 0, 0, 0);
        }
      }
      
      setEndDate(newEnd);
      setShowCalendar(false);
      
      setErrorFields(prev => ({ ...prev, date: false }));
      
      if (error && (error.includes("date") || error.includes("weekend") || error.includes("available") || error.includes("blocked"))) {
        setError("");
      }
    } catch (err) {
      console.error(" Error selecting date:", err);
      setError("Error selecting date. Please try again.");
    }
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(Platform.OS === "ios");
    if (!selectedTime) return;
    
    try {
      const newDate = new Date(scheduledDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setScheduledDate(newDate);

      const newEnd = new Date(newDate);
      const newEndHour = newDate.getHours() + 1;
      
      if (newEndHour > 17) {
        newEnd.setHours(17, 0, 0, 0);
      } else {
        newEnd.setHours(newEndHour, newDate.getMinutes(), 0, 0);
      }
      
      if (newEnd <= newDate) {
        newEnd.setTime(newDate.getTime() + 15 * 60 * 1000); 
        
        if (newEnd.getHours() > 17 || (newEnd.getHours() === 17 && newEnd.getMinutes() > 0)) {
          newEnd.setHours(17, 0, 0, 0);
        }
      }
      
      setEndDate(newEnd);
      
      setErrorFields(prev => ({ ...prev, startTime: false }));
    } catch (err) {
      console.error("❌ Error setting start time:", err);
      setError("Error setting start time. Please try again.");
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(Platform.OS === "ios");
    if (!selectedTime) return;
    
    try {
      const newDate = new Date(endDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      
      if (newDate > scheduledDate) {
        setEndDate(newDate);
        setErrorFields(prev => ({ ...prev, endTime: false }));
      } else {
        setError("End time must be after start time");
        setErrorFields(prev => ({ ...prev, endTime: true }));
      }
    } catch (err) {
      console.error("❌ Error setting end time:", err);
      setError("Error setting end time. Please try again.");
    }
  };

  const isFormValid = !error && 
                      !isLoadingBlockedDates && 
                      !hasConflict &&
                      !isCheckingConflicts;

  const today = getCurrentPHTime();
  const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  if (!appointment) return null;

  const currentStartPH = parseUTCToPH(appointment.scheduledDate);
  const currentEndPH = parseUTCToPH(appointment.endDate);

  const isSameAsOriginal =
    scheduledDate.getTime() === currentStartPH.getTime() &&
    endDate.getTime() === currentEndPH.getTime();

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
                  <Text style={styles.modalTitle}>Reschedule Appointment</Text>
                  <TouchableOpacity onPress={() => { resetForm(); onClose(); }}>
                    <Ionicons name="close" size={28} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={styles.modalBody} 
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* ✅ Current Appointment Info */}
                  <View style={styles.currentAppointmentCard}>
                    <Text style={styles.currentAppointmentTitle}>
                      Current Appointment Details
                    </Text>
                    <View style={styles.currentAppointmentRow}>
                      <Ionicons name="calendar" size={16} color="#3B82F6" />
                      <Text style={styles.currentAppointmentLabel}>Date:</Text>
                      <Text style={styles.currentAppointmentValue}>
                        {formatDatePH(currentStartPH)}
                      </Text>
                    </View>
                    <View style={styles.currentAppointmentRow}>
                      <Ionicons name="time" size={16} color="#3B82F6" />
                      <Text style={styles.currentAppointmentLabel}>Time:</Text>
                      <Text style={styles.currentAppointmentValue}>
                        {formatTimePH(currentStartPH)} - {formatTimePH(currentEndPH)}
                      </Text>
                    </View>
                  </View>

                  {error && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={20} color="#DC2626" />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  {isLoadingBlockedDates && (
                    <View style={styles.hintContainer}>
                      <ActivityIndicator size="small" color="#D97706" />
                      <Text style={styles.hintText}>Loading counselor's availability...</Text>
                    </View>
                  )}

                  {!isLoadingBlockedDates && (
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

                  {/* ✅ Conflict Warning */}
                  {hasConflict && (
                    <View style={styles.warningContainer}>
                      <Ionicons name="warning" size={20} color="#D97706" />
                      <Text style={styles.warningText}>{conflictMessage}</Text>
                    </View>
                  )}

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>
                      New Appointment Date <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity 
                      style={[
                        styles.dateTimeInput,
                        errorFields.date && styles.inputError
                      ]} 
                      onPress={() => setShowCalendar(true)} 
                      disabled={isProcessing || isLoadingBlockedDates}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="calendar-outline" size={22} color="#10B981" />
                      <Text style={styles.dateTimeText}>{formatDatePH(scheduledDate)}</Text>
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View style={styles.hintContainer}>
                      <Ionicons name="information-circle-outline" size={16} color="#D97706" />
                      <Text style={styles.hintText}>Weekends and blocked dates are not available</Text>
                    </View>
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>
                      New Start Time <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity 
                      style={[
                        styles.dateTimeInput,
                        errorFields.startTime && styles.inputError
                      ]} 
                      onPress={() => setShowStartTimePicker(true)} 
                      disabled={isProcessing}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="time-outline" size={22} color="#10B981" />
                      <Text style={styles.dateTimeText}>{formatTimePH(scheduledDate)}</Text>
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>
                      New End Time <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity 
                      style={[
                        styles.dateTimeInput,
                        errorFields.endTime && styles.inputError
                      ]} 
                      onPress={() => setShowEndTimePicker(true)} 
                      disabled={isProcessing}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="time-outline" size={22} color="#10B981" />
                      <Text style={styles.dateTimeText}>{formatTimePH(endDate)}</Text>
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Reason for Reschedule (Optional)</Text>
                    <TextInput 
                      style={[
                        styles.textArea,
                        errorFields.reason && styles.inputError
                      ]} 
                      value={reason} 
                      onChangeText={(text) => { 
                        setReason(text);
                        setErrorFields(prev => ({ ...prev, reason: false }));
                      }} 
                      placeholder="Why do you need to reschedule?" 
                      placeholderTextColor="#9CA3AF"
                      multiline 
                      numberOfLines={4} 
                      maxLength={500} 
                      editable={!isProcessing}
                      returnKeyType="done"
                      blurOnSubmit={true}
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <Text style={styles.charCount}>{reason.length}/500</Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={20} color="#D97706" />
                    <Text style={styles.infoBoxText}>
                      All reschedule requests require counselor approval
                    </Text>
                  </View>

                  <TouchableOpacity 
                    style={[
                      styles.submitButton, 
                      (!isFormValid || isProcessing || isLoadingBlockedDates || isSameAsOriginal) && styles.submitButtonDisabled
                    ]} 
                    onPress={handleSubmit} 
                    disabled={!isFormValid || isProcessing || isLoadingBlockedDates || isSameAsOriginal}
                    activeOpacity={0.8}
                  >
                    {isProcessing ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.submitButtonText}>Request Reschedule</Text>
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
        message={successMessage}
        onClose={handleSuccessClose} 
      />
    </>
  );
}