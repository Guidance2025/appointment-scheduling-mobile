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
} from "react-native";
import { Ionicons , MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/DashboardStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";
import BookAppointmentModal from "./modal/BookAppointmentModal";
import SelfAssessmentModal from "./modal/SelfAssessmentModal";
import BottomNavBar from "./layout/BottomNavBar";
import { formatAppointmentDateTime } from "../service/helper/dateHelper";
import messaging from '@react-native-firebase/messaging';

const counselingLogo = require("../assets/Gabay.png");

export default function Dashboard({ onNavigate }) {
  const [unread, setUnread] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [unansweredCount, setUnansweredCount] = useState(0);

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

  const fetchAssessmentQuestions = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      
      if (!jwtToken) return;

      const response = await fetch(
        `${API_BASE_URL}/self-assessment/questions/unanswered`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch questions');
      
      const data = await response.json();
      console.log("Unanswered questions fetched:", data); 
      console.log("First question structure:", data[0]); 
      
      setAssessmentQuestions(data);
      setUnansweredCount(data.length);
      
      console.log("Total unanswered questions:", data.length);
    } catch (error) {
      console.error("Error fetching assessment questions:", error);
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
      await Promise.all([
        fetchUnreadCount(), 
        fetchAppointments(), 
        fetchStudentInfo(),
        fetchAssessmentQuestions()
      ]);
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

  const handleNotificationAction = (actionType) => {
    console.log("Handling notification action:", actionType);
    
    switch(actionType) {
      case 'APPOINTMENT_CREATED':
      case 'APPOINTMENT_UPDATED':
      case 'APPOINTMENT_CANCELLED':
        fetchAppointments();
        break;
      case 'SELF ASSESSMENT UPDATE':
        fetchAssessmentQuestions();
        break;
      default:
        console.log("Unknown action type:", actionType);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchAppointments();
    fetchStudentInfo();
    fetchAssessmentQuestions();

    
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);
      
      setUnread(prev => prev + 1);
      
      if (remoteMessage.data?.actionType) {
        handleNotificationAction(remoteMessage.data.actionType);
      }
      
    });


    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        console.log('App came to foreground, refreshing notification count...');
        fetchUnreadCount();
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
            Welcome to{'\n'}Guidance & Counseling
          </Text>
          <View style={styles.studentInfoContainer}>
            <Text style={styles.welcomeSubtitle}>
             {`Hello, ${studentName || 'Student'}`}
            </Text>
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

                  return (
                    <View key={appointment.appointmentId} style={styles.appointmentCard}>
                      <View style={styles.cardHeader}>
                        <View style={styles.typeContainer}>
                          <Text style={styles.appointmentType}>{appointment.appointmentType}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>{appointment.status}</Text>
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
          onSuccess={() => fetchAppointments()}
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