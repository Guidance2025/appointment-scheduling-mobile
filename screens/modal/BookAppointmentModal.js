import React, { useState, useEffect } from "react";
import {Modal,View,Text,TextInput, TouchableOpacity,ScrollView,ActivityIndicator,Alert,Platform,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../constants/api";
import styles from "./../../styles/BookAppointmentModalStyles"

export default function BookAppointmentModal({ visible, onClose, onSuccess }) {
  const [appointmentType, setAppointmentType] = useState("");
  const [guidanceStaffId, setGuidanceStaffId] = useState("");
  const [guidanceStaffList, setGuidanceStaffList] = useState([]);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showAppointmentTypes, setShowAppointmentTypes] = useState(false);
  const [showGuidanceStaff, setShowGuidanceStaff] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);

  const appointmentTypes = [
    "Counseling",
    "Academic Advising",
    "Career Guidance",
    "Personal Issue",
  ];

  useEffect(() => {
    if (visible) {
      fetchGuidanceStaff();
    }
  }, [visible]);

  const fetchGuidanceStaff = async () => {
    try {
      setLoadingStaff(true);
      const token = await AsyncStorage.getItem("jwtToken");
      
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/counselor/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch guidance staff");
      }

      const data = await response.json();
      setGuidanceStaffList(data);
    } catch (err) {
      console.error("Error fetching guidance staff:", err);
      setError("Failed to load guidance staff");
    } finally {
      setLoadingStaff(false);
    }
  };

  const validateDates = () => {
    const now = new Date();
    
    if (scheduledDate < now) {
      return "Start time cannot be in the past";
    }
    
    if (endDate <= scheduledDate) {
      return "End time must be after start time";
    }

    const startHour = scheduledDate.getHours();
    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();

    if (startHour < 8 || startHour >= 17) {
      return "Start time must be between 8:00 AM and 4:59 PM";
    }
    
    if (endHour > 17 || (endHour === 17 && endMinute > 0)) {
      return "End time must be no later than 5:00 PM";
    }

    const day = scheduledDate.getDay();
    if (day === 0 || day === 6) {
      return "Appointments cannot be scheduled on weekends";
    }

    return "";
  };

  const handleSubmit = async () => {
    setError("");

    if (!appointmentType) {
      setError("Please select an appointment type");
      return;
    }

    if (!guidanceStaffId) {
      setError("Please select a counselor");
      return;
    }

    const validationError = validateDates();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsProcessing(true);
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const requestData = {
        guidanceStaff: { id: guidanceStaffId },
        scheduledDate: scheduledDate.toISOString(),
        endDate: endDate.toISOString(),
        appointmentType,
        notes: notes.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/student/create-appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (errorText.includes("STUDENT ALREADY HAS AN APPOINTMENT") || 
            errorText.includes("AppointmentAlreadyExistException")) {
          setError("You already have a pending or scheduled appointment");
          return;
        }
        
        throw new Error(errorText || "Failed to create appointment");
      }

      Alert.alert(
        "Success",
        "Appointment request sent successfully! Please wait for counselor confirmation.",
        [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              onClose();
              if (onSuccess) onSuccess();
            },
          },
        ]
      );
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError(err.message || "Failed to create appointment");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setAppointmentType("");
    setGuidanceStaffId("");
    setScheduledDate(new Date());
    setEndDate(new Date());
    setNotes("");
    setError("");
    setShowAppointmentTypes(false);
    setShowGuidanceStaff(false);
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(scheduledDate.getHours());
      newDate.setMinutes(scheduledDate.getMinutes());
      setScheduledDate(newDate);

      const newEndDate = new Date(selectedDate);
      newEndDate.setHours(endDate.getHours());
      newEndDate.setMinutes(endDate.getMinutes());
      setEndDate(newEndDate);

      setError(""); 
    }
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      const newDate = new Date(scheduledDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setScheduledDate(newDate);

      const newEndDate = new Date(newDate);
      newEndDate.setHours(newEndDate.getHours() + 1);
      setEndDate(newEndDate);

      setError(""); 
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      const newDate = new Date(endDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setEndDate(newDate);

      setError(""); 
    }
  };

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${dayName}, ${month} ${day}, ${year}`;
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${hours}:${minutes} ${ampm}`;
  };

  const getSelectedStaffName = () => {
    const staff = guidanceStaffList.find(s => s.id === guidanceStaffId);
    if (staff && staff.person) {
      return `${staff.person.firstName} ${staff.person.lastName}`;
    }
    return "Select Counselor";
  };

  const isFormValid = appointmentType && guidanceStaffId && !error;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); 
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Book Appointment</Text>
            <TouchableOpacity onPress={() => { resetForm(); onClose(); }}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Appointment Type <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowAppointmentTypes(!showAppointmentTypes)}
                disabled={isProcessing}
              >
                <Text style={appointmentType ? styles.selectText : styles.selectPlaceholder}>
                  {appointmentType || "Select Appointment Type"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
              
              {showAppointmentTypes && (
                <View style={styles.dropdown}>
                  {appointmentTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setAppointmentType(type);
                        setShowAppointmentTypes(false);
                        setError(""); 
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Counselor <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowGuidanceStaff(!showGuidanceStaff)}
                disabled={isProcessing || loadingStaff}
              >
                <Text style={guidanceStaffId ? styles.selectText : styles.selectPlaceholder}>
                  {loadingStaff ? "Loading..." : getSelectedStaffName()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
              
              {showGuidanceStaff && (
                <View style={styles.dropdown}>
                  {guidanceStaffList.map((staff) => (
                    <TouchableOpacity
                      key={staff.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setGuidanceStaffId(staff.id);
                        setShowGuidanceStaff(false);
                        setError(""); 
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {staff.person?.firstName} {staff.person?.lastName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Appointment Date <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dateTimeInput}
                onPress={() => setShowStartDatePicker(true)}
                disabled={isProcessing}
              >
                <Ionicons name="calendar-outline" size={20} color="#48BB78" />
                <Text style={styles.dateTimeText}>{formatDate(scheduledDate)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Start Time <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dateTimeInput}
                onPress={() => setShowStartTimePicker(true)}
                disabled={isProcessing}
              >
                <Ionicons name="time-outline" size={20} color="#48BB78" />
                <Text style={styles.dateTimeText}>{formatTime(scheduledDate)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                End Time <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dateTimeInput}
                onPress={() => setShowEndTimePicker(true)}
                disabled={isProcessing}
              >
                <Ionicons name="time-outline" size={20} color="#48BB78" />
                <Text style={styles.dateTimeText}>{formatTime(endDate)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={styles.textArea}
                value={notes}
                onChangeText={(text) => { setNotes(text); setError(""); }}
                placeholder="Additional notes or concerns..."
                multiline
                numberOfLines={4}
                maxLength={500}
                editable={!isProcessing}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isFormValid || isProcessing) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid || isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Set Appointment</Text>
              )}
            </TouchableOpacity>
          </ScrollView>

          {showStartDatePicker && (
            <DateTimePicker
              value={scheduledDate}
              mode="date"
              display="default"
              onChange={onStartDateChange}
              minimumDate={startOfMonth} 
              maximumDate={endOfMonth}   
            />
          )}

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
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
