import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/DashboardStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";
import BookAppointmentModal from "./modal/BookAppointmentModal";
import BottomNavBar from "./layout/BottomNavBar";

const counselingLogo = require("../assets/counseling_image.jpg"); 

export default function Dashboard({ onNavigate }) {
  const [unread, setUnread] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentSection, setStudentSection] = useState("");
  const [showBookModal, setShowBookModal] = useState(false);
  const [activeScreen, setActiveScreen] = useState("dashboard");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 
    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${dayName}, ${month} ${day}, ${year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleUnreadCount = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      
      if (!token) {
        console.error("No JWT token found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/notification/unreadCount/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch unread count:", errorText);
        throw new Error("Failed to fetch unread count");
      }

      const data = await response.json();
      setUnread(data);

    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const studentId = await AsyncStorage.getItem('studentId');
      const token = await AsyncStorage.getItem('jwtToken');
      
      if (!studentId || !token) {
        console.error("Missing userId or token");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/student/appointment/${studentId}/SCHEDULED`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch appointments:", errorText);
        throw new Error("Failed to fetch appointments");
      }

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

  const guidanceStaffFullname = (appointment) => {
    return `${appointment.guidanceStaff?.person?.firstName} ${appointment.guidanceStaff?.person?.lastName}`
  }

  const fetchUnreadCount = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('jwtToken');
    
    if (userId && token) {
      handleUnreadCount(userId);
    }
  };

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    console.log("🔄 Refreshing data...");
    
    try {
      // Fetch both unread count and appointments in parallel
      await Promise.all([
        fetchUnreadCount(),
        fetchAppointments()
      ]);
      console.log("✅ Data refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
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
                    {unread > 99 ? '99+' : unread}
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
             {studentName || 'Student'} <Text style={styles.bulletPoint}></Text> 
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
              <Text style={styles.pullToRefreshHint}>Pull down to refresh</Text>
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
              {appointments.map((appointment) => (
                <View key={appointment.appointmentId} style={styles.appointmentCard}>
                  <View style={styles.appointmentHeader}>
                    <View style={styles.dateContainer}>
                      <Text style={styles.appointmentDate}>
                        {formatDate(appointment.scheduledDate)}
                      </Text>
                      <Text style={styles.appointmentTime}>
                        {formatTime(appointment.scheduledDate)} - {formatTime(appointment.endDate)}
                      </Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>Scheduled</Text>
                    </View>
                  </View>
                  
                  <View style={styles.appointmentDivider} />
                  
                  <View style={styles.appointmentBody}>
                    <Text style={styles.appointmentType}>
                      {appointment.appointmentType}
                    </Text>
                    <View style={styles.staffContainer}>
                      <Ionicons 
                        name="person-circle-outline" 
                        size={22} 
                        color="#8b8764ff" 
                        style={styles.staffIcon} 
                      />
                      <Text style={styles.appointmentNotes} numberOfLines={2}>
                        {guidanceStaffFullname(appointment)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Book Button */}
        <View style={styles.bookButtonContainer}>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => setShowBookModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="add-circle-outline" size={22} color="#fff" style={styles.bookButtonIcon} />
            <Text style={styles.bookButtonText}>Set Appointment</Text>
          </TouchableOpacity>
        </View>

        <BottomNavBar
          activeScreen={activeScreen}
          onNavigate={handleNavigation}
        />

        <BookAppointmentModal
          visible={showBookModal}
          onClose={() => setShowBookModal(false)}
          onSuccess={() => {
            fetchAppointments();
          }}
        />
      </View>
    </SafeAreaView>
  );
}