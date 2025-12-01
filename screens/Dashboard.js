import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/DashboardStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";
import BookAppointmentModal from "./modal/BookAppointmentModal";
import BottomNavBar from "./layout/BottomNavBar";
import { formatAppointmentDateTime } from "../service/helper/dateHelper";

const counselingLogo = require("../assets/Gabay.png");

export default function Dashboard({ onNavigate }) {
  const [unread, setUnread] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [showBookModal, setShowBookModal] = useState(false);
  const [activeScreen, setActiveScreen] = useState("dashboard");


const fetchStudentInfo = async () => {
  try {
    const studentId = await AsyncStorage.getItem("studentId");
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    
    if(!studentId || !jwtToken) {
      console.log("Student id or Token is missing");
      return; 
    }
    
    const response = await fetch(
      `${API_BASE_URL}/student/retrieve/profile/${studentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setStudentName(`${data?.person?.firstName} ${data?.person?.lastName}`);

  } catch(error) { 
    console.log("Failed Loading Dashboard Info:", error);
  }
};
  const handleUnreadCount = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) return;

      const response = await fetch(
        `${API_BASE_URL}/notification/unreadCount/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setUnread(data);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const studentId = await AsyncStorage.getItem("studentId");
      const token = await AsyncStorage.getItem("jwtToken");
      if (!studentId || !token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/student/appointment/${studentId}/SCHEDULED`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setAppointments(data);

      if (data.length > 0 && data[0].student?.person) {
        const person = data[0].student.person;
        setStudentName(`${person.firstName} ${person.lastName}`);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    }
  };

  const guidanceStaffFullname = (appointment) =>
    `${appointment.guidanceStaff?.person?.firstName || ''} ${appointment.guidanceStaff?.person?.lastName || ''}`.trim();

  const fetchUnreadCount = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) handleUnreadCount(userId);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchUnreadCount(), fetchAppointments(), fetchStudentInfo()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNavigation = (screen) => {
    setActiveScreen(screen);
    onNavigate(screen);
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchAppointments();
    fetchStudentInfo();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={counselingLogo} style={styles.headerLogo} />
          <TouchableOpacity
            onPress={() => {
              fetchUnreadCount();
              onNavigate("notification");
            }}
            activeOpacity={0.7}
          >
            <View style={styles.notificationIconContainer}>
              <Ionicons name="notifications-outline" size={30} color="#1B5E20" />
              {unread > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unread > 99 ? "99+" : unread}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome to{'\n'}Guidance & Counseling
          </Text>
          <View style={styles.studentInfoContainer}>
            <Ionicons name="person" size={16} color="#64748B" style={styles.studentIcon} />
            <Text style={styles.welcomeSubtitle}>
              {studentName || "Student"}
            </Text>
          </View>
        </View>

        <View style={styles.appointmentsContainer}>
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#48BB78" />
              <Text style={styles.loadingText}>Loading appointments...</Text>
            </View>
          ) : appointments.length === 0 ? (
            <ScrollView
              contentContainerStyle={styles.centerContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#48BB78"]}
                  tintColor="#48BB78"
                />
              }
            >
              <View style={styles.emptyIconContainer}>
                <Ionicons name="calendar-outline" size={56} color="#CBD5E0" />
              </View>
              <Text style={styles.emptyTitle}>No Upcoming Appointments</Text>
              <Text style={styles.emptySubtitle}>
                Book your first appointment to get started
              </Text>
            </ScrollView>
          ) : (
            <ScrollView
              style={styles.appointmentsList}
              contentContainerStyle={styles.appointmentsListContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#48BB78"]}
                  tintColor="#48BB78"
                />
              }
            >
              {appointments.map((appointment) => {
                const counselorName = guidanceStaffFullname(appointment);
                const { date, timeRange } = formatAppointmentDateTime(
                  appointment.scheduledDate,
                  appointment.endDate
                );

                return (
                  <View key={appointment.appointmentId} style={styles.appointmentCard}>
                    <Text style={styles.appointmentDateHeader}>
                      {date.toUpperCase()}
                    </Text>
                    
                    <View style={styles.timeRow}>
                      <Ionicons name="time-outline" size={18} color="#334155" />
                      <Text style={styles.appointmentTime}>
                        {timeRange}
                      </Text>
                    </View>

                    <Text style={styles.counselorName}>
                      {counselorName}
                    </Text>

                    <View style={styles.appointmentTypeBadge}>
                      <Text style={styles.appointmentTypeText}>
                        {appointment.appointmentType}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>

        <View style={styles.bookButtonContainer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => setShowBookModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color="#fff"
              style={styles.bookButtonIcon}
            />
            <Text style={styles.bookButtonText}>Set Appointment</Text>
          </TouchableOpacity>
        </View>

        <BottomNavBar activeScreen={activeScreen} onNavigate={handleNavigation} />

        <BookAppointmentModal
          visible={showBookModal}
          onClose={() => setShowBookModal(false)}
          onSuccess={() => fetchAppointments()}
        />
      </View>
    </SafeAreaView>
  );
}