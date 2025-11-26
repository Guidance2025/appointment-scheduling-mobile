import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import styles from "../styles/ProfileStyles";
import BottomNavBar from "./layout/BottomNavBar";

const profileImage = require("../assets/counseling_image.jpg"); 
export default function Profile({ onNavigate }) {
  const [activeScreen,setActiveScreen] = useState("profile");

  const handleNavigation = (screen) => {
    setActiveScreen(screen);
    onNavigate(screen);
  }

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

        <BottomNavBar
        activeScreen={activeScreen}
        onNavigate={handleNavigation}
        />
      
    </SafeAreaView>
  );
}
