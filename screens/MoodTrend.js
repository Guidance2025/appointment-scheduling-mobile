import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
    if (selectedMoods.length === 0) return;
    setSaving(true);
    try {
      console.log("Saving moods:", { selectedMoods, dayNote });
      onNavigate("dashboard");
    } catch (err) {
      console.error("Failed to save moods", err);
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