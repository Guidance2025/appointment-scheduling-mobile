import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/ExitInterviewStyles";

export default function ExitInterview({ onNavigate }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Exit Interview (Placeholder)</Text>
        <Text style={styles.subtitle}>This screen is a placeholder for calendar/exit interview features.</Text>

        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate("dashboard")}>
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
