import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/ExitInterviewStyles";
import { API_BASE_URL } from "../constants/api";

// ─── View modes ──────────────────────────────────────────────────────────────
const VIEW_LIST   = "list";
const VIEW_ANSWER = "answer";

// ─── Component ───────────────────────────────────────────────────────────────
const ExitInterview = ({ navigation }) => {
  const [view, setView]             = useState(VIEW_LIST);
  const [questions, setQuestions]   = useState([]);
  const [selected, setSelected]     = useState(null);   // currently-open question
  const [answer, setAnswer]         = useState("");
  const [loading, setLoading]       = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────

  const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem("jwtToken");
    if (!token) return null;
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Fetch unanswered questions (visibility-filtered by backend)
  // The endpoint /questions/unanswered returns only questions this student
  // is allowed to see AND has not yet answered.
  // ─────────────────────────────────────────────────────────────────────────

  const fetchQuestions = useCallback(async (showRefresh = false) => {
    try {
      showRefresh ? setRefreshing(true) : setLoading(true);
      const headers = await getAuthHeader();
      if (!headers) {
        Alert.alert("Session Expired", "Please log in again.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/exit-interview/questions/unanswered`, {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        Alert.alert("Session Expired", "Please log in again.");
        return;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("fetchQuestions error:", error);
      Alert.alert("Error", "Could not load exit interview questions. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Auto-refresh when screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchQuestions();
      return () => {};
    }, [fetchQuestions])
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Submit answer
  // ─────────────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!answer.trim()) {
      Alert.alert("Empty Answer", "Please write your answer before submitting.");
      return;
    }

    Alert.alert(
      "Submit Answer",
      "Are you sure you want to submit this answer? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          style: "default",
          onPress: async () => {
            try {
              setSubmitting(true);
              const headers = await getAuthHeader();
              if (!headers) {
                Alert.alert("Session Expired", "Please log in again.");
                return;
              }

              const payload = {
                questionId: selected.id,
                responseText: answer.trim(),
              };

              const res = await fetch(`${API_BASE_URL}/exit-interview/submit-answer`, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
              });

              if (!res.ok) {
                const errText = await res.text().catch(() => "");
                throw new Error(errText || `HTTP ${res.status}`);
              }

              Alert.alert(
                "✓ Submitted",
                "Your answer has been submitted successfully!",
                [{ text: "OK", onPress: () => goBackToList(true) }]
              );
            } catch (error) {
              console.error("submit error:", error);
              const msg = error.message?.toLowerCase();
              if (msg?.includes("already answered")) {
                Alert.alert("Already Answered", "You have already answered this question.", [
                  { text: "OK", onPress: () => goBackToList(true) },
                ]);
              } else {
                Alert.alert("Submission Failed", "Could not submit your answer. Please try again.");
              }
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Navigation helpers
  // ─────────────────────────────────────────────────────────────────────────

  const openQuestion = (question) => {
    setSelected(question);
    setAnswer("");
    setView(VIEW_ANSWER);
  };

  const goBackToList = (refresh = false) => {
    setView(VIEW_LIST);
    setSelected(null);
    setAnswer("");
    if (refresh) fetchQuestions();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown date";
    try {
      return new Date(dateStr).toLocaleDateString("en-PH", {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Question List
  // ─────────────────────────────────────────────────────────────────────────

  if (view === VIEW_LIST) {
    return (
      <View style={styles.modalContainer}>

        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Exit Interview</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation?.goBack?.()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color="#1B5E20" />
          </TouchableOpacity>
        </View>

        {/* Body */}
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#48BB78" />
            <Text style={[styles.emptySubtitle, { marginTop: 12 }]}>Loading questions…</Text>
          </View>
        ) : (
          <FlatList
            style={styles.questionsContainer}
            contentContainerStyle={[
              styles.questionsContent,
              questions.length === 0 && { flex: 1 },
            ]}
            data={questions}
            keyExtractor={(item) => String(item.id)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchQuestions(true)}
                colors={["#48BB78"]}
                tintColor="#48BB78"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="checkmark-circle-outline" size={64} color="#86EFAC" />
                <Text style={styles.emptyTitle}>All Caught Up!</Text>
                <Text style={styles.emptySubtitle}>
                  You have no pending exit interview questions.{"\n"}
                  Pull down to refresh.
                </Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.questionCard}
                onPress={() => openQuestion(item)}
                activeOpacity={0.75}
              >
                <View style={styles.questionCardHeader}>
                  <View style={styles.questionIconContainer}>
                    <Ionicons name="document-text-outline" size={20} color="#16a34a" />
                  </View>
                  <View style={styles.questionCardInfo}>
                    <Text style={styles.questionCardTitle} numberOfLines={2}>
                      {item.questionText}
                    </Text>
                    <Text style={styles.questionCardMeta}>
                      Posted by {item.guidanceStaff?.person?.firstName ?? ""}{" "}
                      {item.guidanceStaff?.person?.lastName ?? ""} · {formatDate(item.dateCreated)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Answer Screen
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.answerContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.answerHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => goBackToList(false)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={26} color="#1B5E20" />
        </TouchableOpacity>
        <Text style={styles.answerHeaderTitle}>Exit Interview</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.answerContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Question card */}
        <View style={styles.questionDetailCard}>
          <Text style={styles.questionDetailLabel}>Question</Text>
          <Text style={styles.questionDetailText}>{selected?.questionText}</Text>

          <View style={styles.questionDetailMeta}>
            <Ionicons name="person-outline" size={14} color="#64748B" />
            <Text style={styles.questionDetailMetaText}>
              {selected?.guidanceStaff?.person?.firstName ?? ""}{" "}
              {selected?.guidanceStaff?.person?.lastName ?? ""}
            </Text>
          </View>

          <View style={styles.questionDetailMeta}>
            <Ionicons name="calendar-outline" size={14} color="#64748B" />
            <Text style={styles.questionDetailMetaText}>
              {formatDate(selected?.dateCreated)}
            </Text>
          </View>
        </View>

        {/* Answer input */}
        <View style={styles.answerInputContainer}>
          <Text style={styles.answerInputLabel}>Your Answer</Text>
          <TextInput
            style={styles.answerInput}
            placeholder="Write your honest answer here…"
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            value={answer}
            onChangeText={setAnswer}
            editable={!submitting}
            maxLength={500}
          />
          <Text style={styles.answerInputHint}>
            {answer.length}/500 characters · Be honest and thoughtful in your response
          </Text>
        </View>
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.answerActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => goBackToList(false)}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, (submitting || !answer.trim()) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting || !answer.trim()}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send-outline" size={18} color="#fff" />
          )}
          <Text style={styles.submitButtonText}>
            {submitting ? "Submitting…" : "Submit Answer"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ExitInterview;