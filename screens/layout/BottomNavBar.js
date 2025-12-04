import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavBar({ activeScreen, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (screen) => {
    setMenuOpen(false);
    onNavigate(screen);
  };

  return (
    <View style={styles.navBar}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onNavigate("dashboard")}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="home" 
          size={23} 
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
          size={23} 
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
          size={23} 
          color={activeScreen === 'profile' ? '#48BB78' : '#64748B'} 
        />
        <Text style={[
          styles.navLabel,
          activeScreen === 'profile' && styles.navLabelActive
        ]}>
          Profile
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setMenuOpen((v) => !v)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="ellipsis-horizontal"
          size={23}
          color={menuOpen ? '#48BB78' : '#64748B'}
        />
        <Text style={[styles.navLabel, menuOpen && styles.navLabelActive]}>
          Menu
        </Text>
      </TouchableOpacity>

      {/* Popover menu */}
      {menuOpen && (
        <>
          <TouchableOpacity
            style={styles.menuBackdrop}
            activeOpacity={1}
            onPress={() => setMenuOpen(false)}
          />
          <View style={styles.menuSheet}>
            {/* Exit Interview */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => go('exitInterview')}
              activeOpacity={0.7}
            >
              <Ionicons name="clipboard-outline" size={20} color="#1f2937" />
              <Text style={styles.menuItemText}>Exit Interview</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Mood Trend */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => go('moodTrend')}
              activeOpacity={0.7}
            >
              <Ionicons name="pulse-outline" size={20} color="#1f2937" />
              <Text style={styles.menuItemText}>Mood Trend</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* ContentHub */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => go('contentHub')}
              activeOpacity={0.7}
            >
              <Ionicons name="newspaper-outline" size={20} color="#1f2937" />
              <Text style={styles.menuItemText}>Content Hub</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 70,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 4,
    letterSpacing: 0.2,
  },
  navLabelActive: {
    color: "#48BB78",
    fontWeight: "700",
  },
  menuBackdrop: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "transparent",
  },
  menuSheet: {
    position: "absolute",
    right: 12,
    bottom: 70,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
    overflow: "hidden",
    minWidth: 180,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  menuItemText: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 8,
  },
});