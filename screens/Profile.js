import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "../styles/ProfileStyles";

const profileImage = require("../assets/counseling_image.jpg"); // reuse asset

export default function Profile({ onNavigate }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Image source={profileImage} style={styles.avatar} />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.name}>Gina Wasahi Deleon</Text>
            <Text style={styles.role}>BSIT - 4th Year</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Student Number</Text>
          <Text style={styles.value}>CT22-0163</Text>

          <Text style={[styles.label, { marginTop: 16 }]}>E-mail Address</Text>
          <Text style={styles.value}>gina0909@gmail.com</Text>

          <Text style={[styles.label, { marginTop: 16 }]}>Phone Number</Text>
          <Text style={styles.value}>+63 912 345 6789</Text>

          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate("dashboard")}>
          <Feather name="home" size={24} color="#fff" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar-outline" size={24} color="#fff" />
          <Text style={styles.navLabel}>Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="happy-outline" size={24} color="#fff" />
          <Text style={styles.navLabel}>Mood</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate("notification")}>
          <Ionicons name="notifications-outline" size={26} color="#fff" />
          <Text style={styles.navLabel}>Notifications</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
