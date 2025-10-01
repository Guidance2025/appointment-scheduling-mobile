import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "../styles/NotificationStyles";

const notifications = [
  {
    id: 1,
    date: "Oct 03, 2025 • 3:30 PM",
    title: "Counseling Reminder",
    brief: "You have a follow-up session with Ms. Reyes.",
    details:
      "Follow-up counseling to check on academic stress and coping. Please bring reflection notes.",
  },
  {
    id: 2,
    date: "Oct 05, 2025 • 11:00 AM",
    title: "Exit Interview Scheduled",
    brief: "Exit interview with Mr. Cruz.",
    details: "Bring required clearance forms and be prepared with exit feedback.",
  },
  {
    id: 3,
    date: "Oct 12, 2025 • 2:30 PM",
    title: "Group Session: Stress Mgmt",
    brief: "Peer support group on stress management.",
    details: "Interactive group session. Comfortable clothing recommended.",
  },
];

export default function Notification({ onNavigate }) {
  const [selected, setSelected] = useState(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => onNavigate("dashboard")}>
          <Feather name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {notifications.map((n) => (
          <TouchableOpacity key={n.id} style={styles.notifCard} onPress={() => setSelected(n)}>
            <View style={styles.notifLeft}>
              <Text style={styles.notifTitle}>{n.title}</Text>
              <Text style={styles.notifBrief}>{n.brief}</Text>
            </View>

            <View style={styles.notifRight}>
              <Text style={styles.notifDate}>{n.date}</Text>
              <Text style={styles.viewMore}>View More</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Slide-up modal */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setSelected(null)}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{selected?.title}</Text>
          <Text style={styles.modalDate}>{selected?.date}</Text>
          <ScrollView style={{ marginTop: 10 }}>
            <Text style={styles.modalDetails}>{selected?.details}</Text>
          </ScrollView>

          <TouchableOpacity style={styles.modalBackBtn} onPress={() => setSelected(null)}>
            <Text style={styles.modalBackText}>Back</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate("dashboard")}>
          <Feather name="home" size={24} color="#fff" />
         
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar-outline" size={24} color="#fff" />
      
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="happy-outline" size={24} color="#fff" />
       
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate("profile")}>
          <Ionicons name="person-circle-outline" size={26} color="#fff" />
         
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
