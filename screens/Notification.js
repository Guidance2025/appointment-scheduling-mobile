import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../styles/NotificationStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";
import BottomNavBar from "./layout/BottomNavBar";
import { SuccessMessage } from './modal/message/SuccessMessage';
import {
  parseUTCToPH,
  formatDatePH,
  formatRelativeTimePH,
} from "../utils/dateTime";

export default function Notification({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [activeScreen, setIsActiveScreen] = useState("notification");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [successModal, setSuccessModal] = useState({
    visible: false,
    title: '',
    message: '',
    iconName: 'checkmark-circle',
    iconColor: '#48BB78'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); 
    
    return () => clearInterval(timer);
  }, []);

  const showSuccessMessage = (title, message, iconName = 'checkmark-circle', iconColor = '#48BB78') => {
    setSuccessModal({
      visible: true,
      title,
      message,
      iconName,
      iconColor
    });
  };

  const closeSuccessMessage = () => {
    setSuccessModal({
      visible: false,
      title: '',
      message: '',
      iconName: 'checkmark-circle',
      iconColor: '#48BB78'
    });
  };

  const getRelativeTime = (createdAt) => {
    return formatRelativeTimePH(createdAt, currentTime);
  };

  const getActionTypeLabel = (actionType) => {
    const labels = {
      APPOINTMENT_REQUEST: "Appointment Request",
      APPOINTMENT_RESPONSE: "Appointment Response", 
      ACCEPT: "Appointment Accepted",
      DECLINE: "Appointment Declined",
      APPOINTMENT_REMINDER: "Appointment Reminder",
      APPOINTMENT_UPDATE: "Appointment Update",
      APPOINTMENT_CANCELLED: "Appointment Cancelled",
      APPOINTMENT_EXPIRED: "Appointment Expired",
    };
    return labels[actionType] || actionType;
  };

  const getNotificationStyle = (notif) => {
    const styles_array = [styles.notifCard];
    if (notif.isRead === 0) styles_array.push(styles.notifCardUnread);
    
    switch (notif.actionType) {
      case "ACCEPT":
        styles_array.push(styles.notifCardAccepted);
        break;
      case "DECLINE":
      case "APPOINTMENT_CANCELLED":
      case "APPOINTMENT_EXPIRED":
        styles_array.push(styles.notifCardDeclined);
        break;
      case "APPOINTMENT_REQUEST":
      case "APPOINTMENT_RESPONSE": 
        styles_array.push(styles.notifCardRequest);
        break;
      case "APPOINTMENT_REMINDER":
        styles_array.push(styles.notifCardReminder);
        break;
      case "APPOINTMENT_UPDATE":
        styles_array.push(styles.notifCardUpdate);
        break;
      default: 
        break;
    }
    return styles_array;
  };

  const getAllNotifications = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const userId = await AsyncStorage.getItem("userId");
      
      if (!token || !userId) {
        console.warn("Missing token or userId");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/notification/${userId}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      
      const now = new Date();
      const filteredData = data.filter(notif => {
        if (notif.actionType === "APPOINTMENT_EXPIRED") {
          const notifTime = parseUTCToPH(notif.createdAt);
          if (!notifTime) return false;
          const hoursSinceExpired = (now - notifTime) / (1000 * 60 * 60);
          return hoursSinceExpired < 24;
        }
        return true;
      });
      
      const sortedData = filteredData.sort((a, b) => {
        const dateA = parseUTCToPH(a.createdAt);
        const dateB = parseUTCToPH(b.createdAt);
        
        if (!dateA || !dateB) return 0;
        return dateB.getTime() - dateA.getTime(); 
      });
      
      setNotifications(sortedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getAllNotifications();
  }, [getAllNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    getAllNotifications();
  };

  const handleNavigation = (screen) => {
    setIsActiveScreen(screen);
    onNavigate(screen);
  };

  const respondToAppointment = async (appointmentId, action) => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }

      setLoading(true);
      
      const response = await fetch(
        `${API_BASE_URL}/student/${appointmentId}/response`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ action }),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing appointment:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    if (!appointmentId) return;
    
    try {
      setIsDisabled(true);
      await respondToAppointment(appointmentId, "ACCEPT");
      setSelected(null);
      await getAllNotifications();
      showSuccessMessage(
        "Appointment Accepted",
        "You have successfully accepted the appointment. The counselor has been notified.",
        "checkmark-circle",
        "#48BB78"
      );
    } catch (error) {
      showSuccessMessage(
        "Failed to Accept",
        "Failed to accept appointment. Please try again.",
        "close-circle",
        "#EF4444"
      );
    } finally {
      setIsDisabled(false);
    }
  };

  const handleDecline = async (appointmentId) => {
    if (!appointmentId) return;
    
    try {
      setIsDisabled(true);
      await respondToAppointment(appointmentId, "DECLINE");
      setSelected(null);
      await getAllNotifications();
      showSuccessMessage(
        "Appointment Declined",
        "You have declined the appointment. The counselor has been notified.",
        "close-circle",
        "#F59E0B"
      );
    } catch (error) {
      showSuccessMessage(
        "Failed to Decline",
        "Failed to decline appointment. Please try again.",
        "close-circle",
        "#EF4444"
      );
    } finally {
      setIsDisabled(false);
    }
  };

  const markAsRead = async (notificationId) => {
    if (!notificationId) return;
    
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      
      if (!token) return;

      await fetch(
        `${API_BASE_URL}/notification/markAsRead/mobile/${notificationId}`,
        {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
        }
      );
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.notificationId === notificationId 
            ? { ...notif, isRead: 1 }
            : notif
        )
      );
      
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => onNavigate("dashboard")}>
          <Feather name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {initialLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((notif) => (
            <TouchableOpacity
              key={notif.notificationId}
              style={getNotificationStyle(notif)}
              onPress={() => {
                setSelected(notif);
                if (notif.isRead === 0) {
                  markAsRead(notif.notificationId);
                }
              }}
            >
              <View style={styles.notifLeft}>
                <Text style={styles.notifType}>
                  {getActionTypeLabel(notif.actionType)}
                </Text>
                <Text style={styles.notifTitle} numberOfLines={2}>
                  {notif.message || "New notification"}
                </Text>
                <Text style={styles.notifDate}>
                  {getRelativeTime(notif.createdAt)}
                </Text>
              </View>

              <View style={styles.notifRight}>
                {notif.isRead === 0 && <View style={styles.unreadIndicator} />}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setSelected(null)}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>
            {getActionTypeLabel(selected?.actionType)}
          </Text>

          <Text style={styles.modalDate}>
            {getRelativeTime(selected?.createdAt)}
          </Text>

          <ScrollView style={{ marginTop: 10, maxHeight: 300 }}>
            <Text style={styles.modalDetails}>
              {selected?.message || "No details available"}
            </Text>
          </ScrollView>

          {selected?.actionType === "APPOINTMENT_REQUEST" &&
            selected?.appointment?.status === "PENDING" && (
              <View style={styles.actionButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.acceptButton,
                    (loading || isDisabled) && styles.acceptButtonDisabled,
                  ]}
                  onPress={() => handleAccept(selected?.appointment?.appointmentId)}
                  disabled={loading || isDisabled}
                >
                  <Text style={styles.actionButtonText}>
                    {loading ? "Processing..." : "Accept"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.declineButton,
                    (loading || isDisabled) && styles.declineButtonDisabled,
                  ]}
                  onPress={() => handleDecline(selected?.appointment?.appointmentId)}
                  disabled={loading || isDisabled}
                >
                  <Text style={styles.actionButtonText}>
                    {loading ? "Processing..." : "Decline"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          <TouchableOpacity
            style={styles.modalBackBtn}
            onPress={() => setSelected(null)}
          >
            <Text style={styles.modalBackText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <SuccessMessage
        visible={successModal.visible}
        title={successModal.title}
        message={successModal.message}
        iconName={successModal.iconName}
        iconColor={successModal.iconColor}
        onClose={closeSuccessMessage}
      />

      <BottomNavBar activeScreen={activeScreen} onNavigate={handleNavigation} />
    </SafeAreaView>
  );
}