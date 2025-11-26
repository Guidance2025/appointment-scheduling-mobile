import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
          name="home" 
          size={26} 
          color={activeScreen === 'dashboard' ? '#48BB78' : '#64748B'} 
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
          name="calendar-outline" 
          size={26} 
          color={activeScreen === 'appointments' ? '#48BB78' : '#64748B'} 
        />
        <Text style={[
          styles.navLabel,
          activeScreen === 'appointments' && styles.navLabelActive
        ]}>
          Appointments
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onNavigate("profile")}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="person-circle-outline" 
          size={26} 
          color={activeScreen === 'profile' ? '#48BB78' : '#64748B'} 
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
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingBottom: 16,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 16,
    minWidth: 70,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 4,
    letterSpacing: 0.2,
  },
  navLabelActive: {
    color: "#48BB78",
    fontWeight: "700",
  },
});