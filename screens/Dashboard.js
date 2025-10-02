import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles/DashboardStyles";

const counselingLogo = require("../assets/counseling_image.jpg"); 

const appointments = [
  { id: 1, date: "Oct 05, 2025 • 10:00 AM", topic: "Career Guidance", counselor: "Ms. Ramirez" },
  { id: 2, date: "Oct 12, 2025 • 02:30 PM", topic: "Personal Counseling", counselor: "Mr. Santos" },
  { id: 3, date: "Oct 18, 2025 • 09:00 AM", topic: "Group Session — Stress Mgmt", counselor: "Ms. Flores" },
  { id: 4, date: "Oct 25, 2025 • 11:15 AM", topic: "Exit Interview", counselor: "Mr. Mendoza" },
];

export default function Dashboard({ onNavigate }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top */}
      <View style={styles.header}>
        <Image source={counselingLogo} style={styles.logo} />
        <TouchableOpacity onPress={() => onNavigate("notification")}>
          <Ionicons name="notifications-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Welcome to Guidance & Counseling</Text>
        <Text style={styles.subtitle}>Your upcoming sessions</Text>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          {appointments.map((a) => (
            <View key={a.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardDate}>{a.date}</Text>
                <Text style={styles.cardTopic}>{a.topic}</Text>
                <Text style={styles.cardCounselor}>Counselor: {a.counselor}</Text>
              </View>
              <View style={styles.cardRight}>
                <TouchableOpacity style={styles.openBtn} onPress={() => onNavigate("notification")}>
                  <Text style={styles.openBtnText}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate("dashboard")}>
          <Feather name="home" size={24} color="#fff" />
        
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => { /* placeholder */ }}>
          <Ionicons name="calendar-outline" size={24} color="#fff" />
          
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => { /* placeholder */ }}>
          <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color="#fff" />
        
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate("profile")}>
          <Ionicons name="person-circle-outline" size={26} color="#fff" />
         
        </TouchableOpacity>
      </View> 
    </SafeAreaView>
  );
}
