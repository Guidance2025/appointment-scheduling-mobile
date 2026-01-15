import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavBar from "./layout/BottomNavBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";
import styles from "../styles/AppointmentStyles"; 
import { formatAppointmentDateTime } from "../utils/dateTime";

export default function Appointment({ onNavigate }) {
  const [activeScreen, setActiveScreen] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchQuery, statusFilter]);

  const fetchAppointments = async () => {
    try {
      const studentId = await AsyncStorage.getItem("studentId");
      const jwtToken = await AsyncStorage.getItem("jwtToken");

      if (!studentId || !jwtToken) {
        setLoading(false);
        Alert.alert("Error", "Please login again");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/student/appointment/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      console.log("Fetch error:", error.message);
      Alert.alert("Error", "Failed to load appointments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    filtered = filtered.filter((apt) => apt.status !== "EXPIRED");

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((apt) => {
        const firstName = apt.guidanceStaff?.person?.firstName?.toLowerCase() || "";
        const lastName = apt.guidanceStaff?.person?.lastName?.toLowerCase() || "";
        const type = apt.appointmentType?.toLowerCase() || "";
        return firstName.includes(query) || lastName.includes(query) || type.includes(query);
      });
    }

    setFilteredAppointments(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "#10B981"; 
      case "SCHEDULED":
        return "#3B82F6"; 
      case "PENDING":
        return "#F59E0B"; 
      case "CANCELLED":
        return "#EF4444"; 
      case "EXPIRED":
        return "#6B7280"; 
      default:
        return "#6B7280"; 
    }
  };

  const handleNavigation = (screen) => {
    setActiveScreen(screen);
    onNavigate(screen);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#48BB78" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
        <BottomNavBar activeScreen={activeScreen} onNavigate={handleNavigation} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Appointments</Text>
          <Text style={styles.headerSubtitle}>
            {filteredAppointments.length} {filteredAppointments.length === 1 ? "appointment" : "appointments"}
          </Text>
        </View>

        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search appointments..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={{ backgroundColor: "#E8F5E9", paddingBottom: 16 }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}
          >
            {["ALL", "PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setStatusFilter(status)}
                style={[styles.filterButton, statusFilter === status && styles.filterButtonActive]}
              >
                <Text style={[styles.filterButtonText, statusFilter === status && styles.filterButtonTextActive]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={["#48BB78"]}
              tintColor="#48BB78"
            />
          }
        >
          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={{ 
                width: 100, 
                height: 100, 
                borderRadius: 50, 
                backgroundColor: "#F1F5F9", 
                justifyContent: "center", 
                alignItems: "center" 
              }}>
                <Ionicons name="calendar-outline" size={56} color="#CBD5E0" />
              </View>
              <Text style={styles.emptyText}>No appointments found</Text>
              <Text style={styles.emptySubtext}>
                {statusFilter !== "ALL" ? "Try changing the filter" : "Your appointments will appear here"}
              </Text>
            </View>
          ) : (
            filteredAppointments.map((appointment) => {
              const counselorName = `${appointment.guidanceStaff?.person?.firstName || ""} ${appointment.guidanceStaff?.person?.lastName || ""}`.trim();
              
              const { date, timeRange } = formatAppointmentDateTime(
                appointment.scheduledDate,
                appointment.endDate
              );

              return (
                <View key={appointment.appointmentId} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.typeContainer}>
                      <Text style={styles.appointmentType}>{appointment.appointmentType}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) + "20" }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
                        {appointment.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                      <Ionicons name="person-outline" size={16} color="#64748B" />
                      <Text style={[styles.value, { marginLeft: 8 }]}>{counselorName}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={16} color="#64748B" />
                      <Text style={[styles.value, { marginLeft: 8 }]}>{date}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons name="time-outline" size={16} color="#64748B" />
                      <Text style={[styles.value, { marginLeft: 8 }]}>{timeRange}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      <BottomNavBar activeScreen={activeScreen} onNavigate={handleNavigation} />
    </SafeAreaView>
  );
}