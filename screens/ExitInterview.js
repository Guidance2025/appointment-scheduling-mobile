import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/ExitInterviewStyles";
import { API_BASE_URL } from "../constants/api";

export default function ExitInterview({ onNavigate }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const res = await fetch(`${API_BASE_URL}/exit-interview/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load questions", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleChange = (qid, text) => {
    setAnswers((prev) => ({ ...prev, [qid]: text }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const studentId = await AsyncStorage.getItem("studentId");
      const token = await AsyncStorage.getItem("jwtToken");

      for (const [qid, response] of Object.entries(answers)) {
        if (!response.trim()) continue;
        await fetch(`${API_BASE_URL}/exit-interview/student/${studentId}`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionId: qid,
            responseText: response,
          }),
        });
      }
      onNavigate("dashboard");
    } catch (err) {
      console.error("Failed to submit answers", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Exit Interview</Text>
        <Text style={styles.subtitle}>
          Please provide your answers to the questions below.
        </Text>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#48BB78" />
            <Text style={styles.loadingText}>Loading questions...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {questions.map((q) => (
              <View key={q.id} style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{q.text}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Type your answer..."
                  value={answers[q.id] || ""}
                  onChangeText={(txt) => handleChange(q.id, txt)}
                  multiline
                />
              </View>
            ))}

            <TouchableOpacity
              style={[
                styles.saveButton,
                submitting && styles.saveButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.saveButtonText}>
                {submitting ? "Submitting..." : "Submit Answers"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => onNavigate("dashboard")}
            >
              <Text style={styles.cancelButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );
}