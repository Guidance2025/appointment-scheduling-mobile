import React, { useState, useEffect } from "react";
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
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "../styles/NotificationStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";
import BottomNavBar from "./layout/BottomNavBar";

export default function Notification({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [activeScreen, setIsActiveScreen] = useState("notification");

  const getActionTypeLabel = (actionType) => {
    const labels = {
      APPOINTMENT_REQUEST: "Appointment Request",
      ACCEPT: "Appointment Accepted",
      DECLINE: "Appointment Declined",
    };
    return labels[actionType] || actionType;
  };

  const getNotificationStyle = (notif) => {
    const styles_array = [styles.notifCard];
    
    if (notif.isRead === 0) {
      styles_array.push(styles.notifCardUnread);
    }
    
    if (notif.actionType === "ACCEPT") {
      styles_array.push(styles.notifCardAccepted);
    } else if (notif.actionType === "DECLINE") {
      styles_array.push(styles.notifCardDeclined);
    } else if (notif.actionType === "APPOINTMENT_REQUEST") {
      styles_array.push(styles.notifCardRequest);
    }else if (notif.actionType === "APPOINTMENT_REMINDER") {
      styles_array.push(styles.notifCardReminder);
    }
    
    return styles_array;
  };

  const getAllNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        console.error("No token or userId found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/notification/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch notifications: ${errorText}`);
      }

      const data = await response.json();
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getAllNotifications();
  };

  const handleNavigation = (screen) => {
    setIsActiveScreen(screen);
    onNavigate(screen);
  };

  const respondToAppointment = async (appointmentId, action) => {
    const token = await AsyncStorage.getItem("jwtToken");

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/counselor/${appointmentId}/response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to respond: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error responding to appointment:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      setIsDisabled(true);
      await respondToAppointment(appointmentId, "ACCEPT");
      alert("Appointment accepted successfully");
      setSelected(null);
      getAllNotifications();
    } catch (error) {
      alert("Failed to accept appointment");
    } finally {
      setIsDisabled(false);
    }
  };

  const handleDecline = async (appointmentId) => {
    try {
      setIsDisabled(true);
      await respondToAppointment(appointmentId, "DECLINE");
      alert("Appointment declined successfully");
      setSelected(null);
      getAllNotifications();
    } catch (error) {
      alert("Failed to decline appointment");
    } finally {
      setIsDisabled(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      await fetch(
        `${API_BASE_URL}/notification/markAsRead/mobile/${notificationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getAllNotifications();
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
                markAsRead(notif.notificationId);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.notifLeft}>
                <Text style={styles.notifType}>
                  {getActionTypeLabel(notif.actionType)}
                </Text>
                <Text style={styles.notifTitle} numberOfLines={2}>
                  {notif.message || "New notification"}
                </Text>
                <Text style={styles.notifDate}>
                  {formatDate(notif.createdAt)}
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
            {formatDate(selected?.createdAt)}
          </Text>
          <ScrollView style={{ marginTop: 10 }}>
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
                  onPress={() =>
                    handleAccept(selected?.appointment.appointmentId)
                  }
                  disabled={loading || isDisabled}
                  activeOpacity={0.8}
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
                  onPress={() =>
                    handleDecline(selected?.appointment.appointmentId)
                  }
                  disabled={loading || isDisabled}
                  activeOpacity={0.8}
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
            activeOpacity={0.7}
          >
            <Text style={styles.modalBackText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <BottomNavBar
        activeScreen={activeScreen}
        onNavigate={handleNavigation}
      />
    </SafeAreaView>
  );
}