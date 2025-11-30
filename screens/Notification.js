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
  const [activeScreen,setIsActiveScreen] = useState("notification")

  const getAllNotifications = async () => {
    try {
      const token =  await AsyncStorage.getItem("jwtToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        console.error("No token or userId found");
        return;
      }

      console.log("Fetching notifications for user:", userId);

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
      console.log("Notifications received:", data);
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

  }
  

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
          body: JSON.stringify({
            action: action,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to respond: ${errorText}`);
      }

      const data = await response.json();
      console.log("Response successful:", data);

      return data;
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
    }finally{
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
    } finally{
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
       await fetch(`${API_BASE_URL}/notification/markAsRead/mobile/${notificationId}`,
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
  }
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate("dashboard")}>
            <Feather name="arrow-left" size={22} color="#333" />
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
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#0066cc" />
              <Text style={{ marginTop: 10, color: "#666" }}>
                Loading notifications...
              </Text>
            </View>
          ) : notifications.length === 0 ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#666", fontSize: 16 }}>
                No notifications yet
              </Text>
            </View>
          ) : (
            notifications.map((notif) => (
              <TouchableOpacity
                key={notif.notificationId}
                style={[
                  styles.notifCard,
                  notif.isRead === 0 && { backgroundColor: "#e3f2fd" },
                  notif.actionType === "DECLINE" && {backgroundColor : "#f6dad8fc", color : "white"} ,
                  notif.actionType === "ACCEPT" && {backgroundColor : "#bfe7d1ff" , color : "#e3f2fd"}
                ]}
                onPress={() => {
                  setSelected(notif);
                  markAsRead(notif.notificationId);
                }}  
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle} numberOfLines={2}>
                    {notif.message || "New notification"}
                  </Text>
                  <Text style={styles.notifDate}>
                    {formatDate(notif.createdAt)}
                  </Text>
                </View>
                <View style={styles.notifRight}>
                  {notif.isRead === 0 && (
                    <View
                      style={{
                        position : "absolute",
                        right:-13,
                        top: -4,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#0066cc",
                        marginRight: 8,
                      }}
                    />
                  )}
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
              {selected?.actionType || "Notification"}
            </Text>
            <Text style={styles.modalDate}>
              {formatDate(selected?.createdAt)}
            </Text>
            <ScrollView style={{ marginTop: 10 }}>
              <Text style={styles.modalDetails}>
                {selected?.message || "No details available"}
              </Text>
            </ScrollView>

            {selected?.actionType === "APPOINTMENT_REQUEST" && (
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  style={[
                    styles.modalBackBtn,
                    { backgroundColor: (loading || isDisabled || selected.appointment?.status !== "PENDING") ?  "#535353ff" : "#4CAF50",
                     flex: 1, 
                     marginRight: 5, 
                     opacity: (loading || isDisabled || selected?.appointment?.status !== "PENDING") ? 0.5 : 1
                     },
                  ]}
                  onPress={() =>
                    handleAccept(selected?.appointment.appointmentId)
                  }
                  disabled={loading 
                  || isDisabled ||
                  selected?.appointment?.status !== "PENDING"
                  }
                >
                  <Text style={styles.modalBackText}>
                    {loading ? "Processing..." : "Accept"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalBackBtn,
                    {
                       backgroundColor: (loading|| isDisabled || selected?.appointment?.status !== "PENDING") ?  "#535353ff" :"#f44336", 
                       flex: 1, 
                       marginLeft: 5, 
                       opacity: (loading|| isDisabled || selected?.appointment?.status !== "PENDING") ? 0.5 : 1
                       },
                  ]}
                  onPress={() =>
                    handleDecline(selected?.appointment.appointmentId)
                  }
                  disabled={loading || isDisabled || selected?.appointment?.status !== "PENDING" }
                >
                  <Text style={styles.modalBackText}>
                    {loading ? "Processing..." : "Decline"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.modalBackBtn, { marginTop: 10 }]}
              onPress={() => setSelected(null)}
            >
              <Text style={styles.modalBackText}>Back</Text>
            </TouchableOpacity>
          </View>
        </Modal>
       <BottomNavBar
         activeScreen={activeScreen}
         onNavigate={handleNavigation}     
        />
        
      </SafeAreaView>
    );
  };

