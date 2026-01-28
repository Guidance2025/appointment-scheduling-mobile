import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
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

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setMenuOpen((v) => !v)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={menuOpen ? 'grid' : 'grid-outline'}
          size={24}
          color={menuOpen ? '#16a34a' : '#6b7280'}
        />
        <Text style={[styles.navLabel, menuOpen && styles.navLabelActive]}>
          More
        </Text>
      </TouchableOpacity>

      {menuOpen && (
        <>
          <TouchableOpacity
            style={styles.menuBackdrop}
            activeOpacity={1}
            onPress={() => setMenuOpen(false)}
          />
          <View style={styles.menuSheet}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => go('exitInterview')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="clipboard-outline" size={20} color="#16a34a" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemText}>Exit Interview</Text>
                <Text style={styles.menuItemSubtext}>Complete your interview</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Mood Trend */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => go('moodTrend')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="pulse-outline" size={20} color="#16a34a" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemText}>Mood Trend</Text>
                <Text style={styles.menuItemSubtext}>Track your wellness</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Content Hub */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => go('contentHub')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="newspaper-outline" size={20} color="#16a34a" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemText}>Content Hub</Text>
                <Text style={styles.menuItemSubtext}>Announcements</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
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
  menuBackdrop: {
    position: "absolute",
    top: -1000,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  menuSheet: {
    position: "absolute",
    right: 16,
    bottom: Platform.OS === 'ios' ? 90 : 75,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
    minWidth: 240,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 2,
  },
  menuItemSubtext: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "400",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 12,
  },
});