import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";
import styles from "../styles/MoodTrendStyles";

const moods = [
  { key: "angry", label: "Angry", color: "#ef4444" },
  { key: "frustrated", label: "Frustrated", color: "#f97316" },
  { key: "worried", label: "Worried", color: "#eab308" },
  { key: "sad", label: "Sad", color: "#3b82f6" },
  { key: "calm", label: "Calm", color: "#10b981" },
  { key: "happy", label: "Happy", color: "#84cc16" },
  { key: "excited", label: "Excited", color: "#a855f7" },
  { key: "tired", label: "Tired", color: "#64748b" },
  { key: "hopeful", label: "Hopeful", color: "#22d3ee" },
];

export default function MoodTrend({ onNavigate }) {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [dayNote, setDayNote] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleMood = (key) => {
    setSelectedMoods((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    if (selectedMoods.length === 0) {
      Alert.alert("Error", "Please select at least one emotion.");
      return;
    }
    setSaving(true);
    try {
      const studentId = await AsyncStorage.getItem("studentId");
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      if (!studentId || !jwtToken) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/moods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          studentId: parseInt(studentId),
          emotions: selectedMoods,
          note: dayNote.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save mood entry.");
      }

      Alert.alert("Success", "Mood entry saved successfully!");
      onNavigate("dashboard");
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save mood entry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Mood Trend</Text>
        <Text style={styles.subtitle}>
          Select one or more emotional states and note your day.
        </Text>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.moodGrid}>
            {moods.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[
                  styles.moodCircle,
                  { backgroundColor: m.color },
                  selectedMoods.includes(m.key) && styles.moodSelected,
                ]}
                onPress={() => toggleMood(m.key)}
              >
                <Text style={styles.moodCircleText}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Reflection Day Note</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write something about your day..."
              value={dayNote}
              onChangeText={setDayNote}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "Saving..." : "Save Mood"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => onNavigate("dashboard")}
          >
            <Text style={styles.cancelButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}