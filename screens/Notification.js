import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import styles from "../styles/DashboardStyles";

const notifications = {
  unseen: [
    {
      date: "December 12, 2024 - 1:15 PM",
      text: "Appointment Confirmed - Your counseling session is confirmed for Sept 22 at 2:00 PM.",
    },
    {
      date: "September 9, 2024 - 10:05 AM",
      text: "Appointment Reminder - Reminder: You have an appointment with the Guidance Office tomorrow at 10:00 AM.",
    },
    { date: "August 27, 2024 - 11:40 AM", text: "Mood Tracker Alert - Don't forget to update your mood tracker today." },
  ],
  seen: [
    { date: "March 22, 2024 - 9:10 AM", text: "Wellness Seminar certificate is ready for pick-up." },
    { date: "February 14, 2024 - 4:00 PM", text: "Your request for a Good Moral Certificate is being processed." },
    { date: "January 12, 2024 - 2:10 PM", text: "Follow-up counseling recommended based on your last session." },
    { date: "December 15, 2023 - 8:20 AM", text: "You've been added to the Stress Management Workshop participants list." },
    { date: "November 29, 2023 - 1:00 PM", text: "Please update your profile information for counseling records." },
  ],
};

export default function Notification({ onGoHome }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>NOTIFICATION</Text>

        {/* Profile Section */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/68.jpg" }}
            style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 8 }}
          />
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Gina Wasahi Deleon</Text>
        </View>

        {/* Notif List */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Unseen Notifications:</Text>
            {notifications.unseen.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#EAF8EC",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                  borderLeftWidth: 4,
                  borderLeftColor: "#376839ff",
                }}
              >
                <Text style={{ fontSize: 12, color: "#555" }}>{item.date}</Text>
                <Text style={{ fontSize: 14, marginTop: 4 }}>{item.text}</Text>
              </View>
            ))}
          </View>

          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Seen Notifications:</Text>
            {notifications.seen.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                  borderLeftWidth: 4,
                  borderLeftColor: "#A5D6A7",
                }}
              >
                <Text style={{ fontSize: 12, color: "#555" }}>{item.date}</Text>
                <Text style={{ fontSize: 14, marginTop: 4 }}>{item.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* NAVBAR */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} onPress={onGoHome}>
            <Feather name="home" size={28} color="white" />
            <Text style={styles.navLabel}>Homepage</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="calendar-outline" size={28} color="white" />
            <Text style={styles.navLabel}>Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-circle-outline" size={28} color="white" />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
            <Ionicons name="notifications-outline" size={28} color="white" />
            <Text style={[styles.navLabel, styles.activeNavLabel]}>Notifications</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
