import React from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/DashboardStyles";

const counselingLogo = require("../assets/counseling_image.jpg");

export default function Dashboard({ onViewNotifications }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Logo */}
        <Image source={counselingLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.welcomeText}>Welcome to Guidance and Counseling</Text>

        {/* Shortcut Buttons */}
        <View style={styles.content}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            <TouchableOpacity style={styles.section}>
              <MaterialIcons name="schedule" size={32} color="#4CAF50" style={styles.sectionIcon} />
              <Text style={styles.title}>Appointment Scheduling</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section}>
              <Feather name="trending-up" size={32} color="#4CAF50" style={styles.sectionIcon} />
              <Text style={styles.title}>Mood Trends</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section}>
              <Ionicons name="chatbubble-outline" size={32} color="#4CAF50" style={styles.sectionIcon} />
              <Text style={styles.title}>Exit Interview</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Bottom Quote */}
        <Text style={styles.quote}>
          “A safe space where students are heard, guided, and supported for personal and academic growth.”
        </Text>

        {/* NAVBAR */}
        <View style={styles.navBar}>
          <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
            <Feather name="home" size={28} color="white" />
            <Text style={[styles.navLabel, styles.activeNavLabel]}>Homepage</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="calendar-outline" size={28} color="white" />
            <Text style={styles.navLabel}>Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-circle-outline" size={28} color="white" />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={onViewNotifications}>
            <Ionicons name="notifications-outline" size={28} color="white" />
            <Text style={styles.navLabel}>Notifications</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
