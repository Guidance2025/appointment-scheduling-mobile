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
  AppState,
  Alert,
} from "react-native";
import { Ionicons , MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/DashboardStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";
import BookAppointmentModal from "./modal/BookAppointmentModal";
import RescheduleAppointmentModal from "./modal/RescheduleAppointmentModal";
import SelfAssessmentModal from "./modal/SelfAssessmentModal";
import BottomNavBar from "./layout/BottomNavBar";
import messaging from "@react-native-firebase/messaging";
import { formatAppointmentDateTime, getCurrentPHTime, parseUTCToPH } from "../utils/dateTime";

const counselingLogo = require("../assets/Gabay.png");

export default function Dashboard({ onNavigate }) {
  const [unread, setUnread] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [showBookModal, setShowBookModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [statuses] = useState(["PENDING", "SCHEDULED", "ONGOING", "RESCHEDULE_PENDING"]);

  const canRescheduleAppointment = (appointment) => {
    if (!appointment) {
      return { canReschedule: false, reason: 'Invalid appointment' };
    }

    const rescheduleCount = appointment.rescheduleCount ?? 0;
    
    console.log(`🔍 Checking appointment ${appointment.appointmentId}:`);
    console.log(`   Raw rescheduleCount: ${appointment.rescheduleCount}`);
    console.log(`   Normalized count: ${rescheduleCount}`);
    console.log(`   Status: ${appointment.status}`);
    
    if (rescheduleCount > 0) {
      return { 
        canReschedule: false, 
        reason: 'This appointment has already been rescheduled once. No further reschedules allowed.' 
      };
    }

    if (appointment.status !== 'SCHEDULED') {
      return { 
        canReschedule: false, 
        reason: `Cannot reschedule ${appointment.status.toLowerCase()} appointments` 
      };
    }

    try {
      const appointmentTime = parseUTCToPH(appointment.scheduledDate);
      const now = getCurrentPHTime();
      const minutesUntil = (appointmentTime - now) / (1000 * 60);

      console.log(`   Minutes until: ${minutesUntil.toFixed(0)}`);

      if (minutesUntil < 30) {
        return { 
          canReschedule: false, 
          reason: 'Cannot reschedule appointments within 30 minutes of scheduled time' 
        };
      }
    } catch (error) {
      console.error('Error checking appointment time:', error);
      return { canReschedule: false, reason: 'Error validating appointment time' };
    }

    try {
      const appointmentTime = parseUTCToPH(appointment.scheduledDate);
      const now = getCurrentPHTime();
      
      if (appointmentTime < now) {
        return { 
          canReschedule: false, 
          reason: 'Cannot reschedule past appointments' 
        };
      }
    } catch (error) {
      console.error('Error checking if appointment passed:', error);
      return { canReschedule: false, reason: 'Error validating appointment' };
    }

    return { canReschedule: true, reason: '' };
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "PENDING":
        return {
          container: {
            backgroundColor: "#FEF3C7",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          },
          text: {
            color: "#D97706",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          },
        };
      case "SCHEDULED":
        return {
          container: {
            backgroundColor: "#DBEAFE",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          },
          text: {
            color: "#1D4ED8",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          },
        };
      case "RESCHEDULE_PENDING":
        return {
          container: {
            backgroundColor: "#E0E7FF",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          },
          text: {
            color: "#4F46E5",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          },
        };
      case "ONGOING":
        return {
          container: {
            backgroundColor: "#D1FAE5",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          },
          text: {
            color: "#047857",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          },
        };
      case "COMPLETED":
        return {
          container: {
            backgroundColor: "#E5E7EB",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          },
          text: {
            color: "#4B5563",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          },
        };
      case "CANCELLED":
        return {
          container: {
            backgroundColor: "#FEE2E2",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          },
          text: {
            color: "#DC2626",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          },
        };
      default:
        return {
          container: {
            backgroundColor: "#F3F4F6",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          },
          text: {
            color: "#6B7280",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          },
        };
    }
  };

  const fetchStudentInfo = async () => {
    try {
      const studentId = await AsyncStorage.getItem("studentId");
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      if (!studentId || !jwtToken) return;

      const res = await fetch(`${API_BASE_URL}/student/retrieve/profile/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch student info");

      const data = await res.json();
      setStudentName(`${data?.person?.firstName || ""} ${data?.person?.lastName || ""}`);
    } catch (err) {
      console.error("Error fetching student info:", err);
    }
  };

  const fetchAssessmentQuestions = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      if (!jwtToken) return;

      const res = await fetch(`${API_BASE_URL}/self-assessment/questions/unanswered`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwtToken}` },
      });

      if (!res.ok) throw new Error("Failed to fetch assessment questions");
      const data = await res.json();
      setAssessmentQuestions(data);
      setUnansweredCount(data.length);
    } catch (err) {
      console.error("Error fetching assessment questions:", err);
    }
  };

  const handleUnreadCount = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/notification/unreadCount/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUnread(data);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const studentId = await AsyncStorage.getItem("studentId");
      const token = await AsyncStorage.getItem("jwtToken");
      if (!studentId || !token) return setLoading(false);

      const statusParam = statuses.join(",");

      console.log(`URL: ${API_BASE_URL}/student/appointment/${studentId}/by-status?statuses=${statusParam}`);
      
      const res = await fetch(
        `${API_BASE_URL}/student/appointment/${studentId}/by-status?statuses=${statusParam}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      
      
      setAppointments(data);
    } catch (err) {
      console.error(" Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const guidanceStaffFullname = (appointment) =>
    `${appointment.guidanceStaff?.person?.firstName || ""} ${
      appointment.guidanceStaff?.person?.lastName || ""
    }`.trim();

  const fetchUnreadCount = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) handleUnreadCount(userId);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchUnreadCount(),
        fetchAppointments(),
        fetchStudentInfo(),
        fetchAssessmentQuestions(),
      ]);
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNavigation = (screen) => {
    setActiveScreen(screen);
    onNavigate(screen);
  };

  const handleNotificationAction = (actionType) => {
 
    
    switch (actionType) {
      case "APPOINTMENT_CREATED":
      case "APPOINTMENT_UPDATED":
      case "APPOINTMENT_CANCELLED":
      case "APPOINTMENT_RESCHEDULED":
      case "RESCHEDULE_REQUEST":
      case "RESCHEDULE_APPROVED":
      case "RESCHEDULE_DECLINED":
        console.log("🔄 Triggering appointment refresh...");
        fetchAppointments();
        break;
      case "SELF ASSESSMENT UPDATE":
        fetchAssessmentQuestions();
        break;
      default:
        console.log(" Unknown action type");
    }
  };

  const handleRescheduleClick = (appointment) => {
    const rescheduleCheck = canRescheduleAppointment(appointment);
    
    if (!rescheduleCheck.canReschedule) {
      Alert.alert(
        "Cannot Reschedule",
        rescheduleCheck.reason,
        [{ text: "OK" }]
      );
      return;
    }
    
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleRescheduleSuccess = () => {
    fetchAppointments();
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchAppointments();
    fetchStudentInfo();
    fetchAssessmentQuestions();

    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      setUnread((prev) => prev + 1);
      if (remoteMessage.data?.actionType) {
        handleNotificationAction(remoteMessage.data.actionType);
      }
    });

    const appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        fetchUnreadCount();
        fetchAppointments();
      }
    });

    return () => {
      unsubscribeForeground();
      appStateSubscription.remove();
    };
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
            Welcome to{"\n"}Guidance & Counseling
          </Text>
          <View style={styles.studentInfoContainer}>
            <Text style={styles.welcomeSubtitle}>{`Hello, ${studentName || "Student"}`}</Text>
          </View>
        </View>

        <View style={styles.appointmentsContainer}>
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#48BB78" />
              <Text style={styles.loadingText}>Loading appointments...</Text>
            </View>
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
              {unansweredCount > 0 && (
                <TouchableOpacity
                  style={styles.assessmentButton}
                  onPress={() => setShowAssessmentModal(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.assessmentButtonContent}>
                    <Ionicons name="clipboard-outline" size={20} color="#F59E0B" />
                    <Text style={styles.assessmentButtonText}>
                      Self-Assessments ({unansweredCount})
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#64748B" />
                </TouchableOpacity>
              )}

              {appointments.length === 0 ? (
                <View style={styles.emptyAppointmentsContainer}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons name="calendar-outline" size={56} color="#CBD5E0" />
                  </View>
                  <Text style={styles.emptyTitle}>No Upcoming Appointments</Text>
                  <Text style={styles.emptySubtitle}>
                    Book your first appointment to get started
                  </Text>
                </View>
              ) : (
                appointments.map((appointment) => {
                  const counselorName = guidanceStaffFullname(appointment);
                  const { date, timeRange } = formatAppointmentDateTime(
                    appointment.scheduledDate,
                    appointment.endDate
                  );
                  const statusStyles = getStatusStyles(appointment.status);
                  
                  const rescheduleCheck = canRescheduleAppointment(appointment);
                  const canReschedule = rescheduleCheck.canReschedule;
                  const isReschedulePending = appointment.status === "RESCHEDULE_PENDING";
                  
                  const showActionSection = canReschedule || isReschedulePending;

                  return (
                    <View key={appointment.appointmentId} style={styles.appointmentCard}>
                      <View style={styles.cardHeader}>
                        <View style={styles.typeContainer}>
                          <Text style={styles.appointmentType}>
                            {appointment.appointmentType}
                          </Text>
                        </View>
                        <View style={statusStyles.container}>
                          <Text style={statusStyles.text}>{appointment.status}</Text>
                        </View>
                      </View>

                      <View style={styles.cardBody}>
                        <View style={styles.infoRow}>
                          <Ionicons name="person-outline" size={16} color="#64748B" />
                          <Text style={styles.infoValue}>{counselorName}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Ionicons name="calendar-outline" size={16} color="#64748B" />
                          <Text style={styles.infoValue}>{date}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Ionicons name="time-outline" size={16} color="#64748B" />
                          <Text style={styles.infoValue}>{timeRange}</Text>
                        </View>
                      </View>

                      {showActionSection && (
                        <View style={styles.cardActions}>
                          {canReschedule && (
                            <TouchableOpacity
                              style={styles.rescheduleButton}
                              onPress={() => handleRescheduleClick(appointment)}
                              activeOpacity={0.7}
                            >
                              <Ionicons
                                name="calendar-outline"
                                size={16}
                                color="#fff"
                                style={{ marginRight: 6 }}
                              />
                              <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                            </TouchableOpacity>
                          )}

                          {isReschedulePending && (
                            <View style={styles.pendingRescheduleInfo}>
                              <Ionicons name="information-circle" size={16} color="#4F46E5" />
                              <Text style={styles.pendingRescheduleText}>
                                Waiting for counselor approval
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })
              )}
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
          onSuccess={fetchAppointments}
        />

        <RescheduleAppointmentModal
          visible={showRescheduleModal}
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
          }}
          onSuccess={handleRescheduleSuccess}
          appointment={selectedAppointment}
        />

        <SelfAssessmentModal
          visible={showAssessmentModal}
          onClose={() => setShowAssessmentModal(false)}
          questions={assessmentQuestions}
          onAnswerSubmitted={() => {
            fetchAssessmentQuestions();
            setShowAssessmentModal(false);
          }}
        />

        <SelfAssessmentModal
          visible={showAssessmentModal}
          onClose={() => setShowAssessmentModal(false)}
          questions={assessmentQuestions}
          onAnswerSubmitted={() => {
            fetchAssessmentQuestions();
            setShowAssessmentModal(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
}