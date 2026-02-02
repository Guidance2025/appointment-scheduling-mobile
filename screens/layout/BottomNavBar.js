import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavBar({ activeScreen, onNavigate }) {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onNavigate("dashboard")}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={activeScreen === 'dashboard' ? 'home' : 'home-outline'} 
          size={24} 
          color={activeScreen === 'dashboard' ? '#16a34a' : '#6b7280'} 
        />
        <Text style={[
          styles.navLabel,
          activeScreen === 'dashboard' && styles.navLabelActive
        ]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onNavigate("appointments")}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={activeScreen === 'appointments' ? 'calendar' : 'calendar-outline'} 
          size={24} 
          color={activeScreen === 'appointments' ? '#16a34a' : '#6b7280'} 
        />
        <Text style={[
          styles.navLabel,
          activeScreen === 'appointments' && styles.navLabelActive
        ]}>
          History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onNavigate("profile")}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={activeScreen === 'profile' ? 'person-circle' : 'person-circle-outline'} 
          size={24} 
          color={activeScreen === 'profile' ? '#16a34a' : '#6b7280'} 
        />
        <Text style={[
          styles.navLabel,
          activeScreen === 'profile' && styles.navLabelActive
        ]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 70,
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 2,
    letterSpacing: 0.3,
  },
  navLabelActive: {
    color: "#16a34a",
    fontWeight: "700",
  },
});