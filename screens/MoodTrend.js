import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";
import styles from "../styles/MoodTrendStyles";
import { SuccessMessage } from "./modal/message/SuccessMessage";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleMood = (key) => {
    setSelectedMoods((prev) => {
      if (prev.includes(key)) {
        return prev.filter((m) => m !== key);
      } else {
        if (prev.length >= 2) {
          setErrorMessage("You can only select up to 2 emotions.");
          setShowErrorModal(true);
          return prev;
        }
        return [...prev, key];
      }
    });
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedMoods([]);
    setDayNote("");
    onNavigate("dashboard");
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleSave = async () => {
    if (selectedMoods.length === 0) {
      setErrorMessage("Please select at least one emotion.");
      setShowErrorModal(true);
      return;
    }
    
    setSaving(true);
    try {
      const studentId = await AsyncStorage.getItem("studentId");
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      
      if (!studentId || !jwtToken) {
        setErrorMessage("User not authenticated. Please log in again.");
        setShowErrorModal(true);
        setSaving(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/moods/save`, {
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
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save mood entry.");
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Save error:", error);
      setErrorMessage(error.message || "Failed to save mood entry. Please try again.");
      setShowErrorModal(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.safeArea}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Mood Trend</Text>
          <Text style={styles.subtitle}>
            Select up to 2 emotional states and note your day.
          </Text>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.moodGrid}>
              {moods.map((m) => {
                const isSelected = selectedMoods.includes(m.key);
                return (
                  <TouchableOpacity
                    key={m.key}
                    style={[
                      styles.moodCircle,
                      { backgroundColor: isSelected ? "#48BB78" : m.color },
                      isSelected && styles.moodSelected,
                    ]}
                    onPress={() => toggleMood(m.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.moodCircleText}>{m.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Reflection Day Note</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write something about your day..."
                placeholderTextColor="#9CA3AF"
                value={dayNote}
                onChangeText={setDayNote}
                multiline
                numberOfLines={4}
                maxLength={500}
                editable={!saving}
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={Keyboard.dismiss}
              />
              <Text style={styles.charCount}>{dayNote.length}/500</Text>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {saving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => onNavigate("dashboard")}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      <SuccessMessage 
        visible={showSuccessModal} 
        title="Success" 
        message="Mood entry saved successfully!" 
        onClose={handleSuccessClose} 
      />

      <SuccessMessage 
        visible={showErrorModal} 
        title="Error" 
        message={errorMessage}
        onClose={handleErrorClose}
        iconName="close-circle"
        iconColor="#ef4444"
        buttonText="Close"
      />
    </KeyboardAvoidingView>
  );
}