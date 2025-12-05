import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/ExitInterviewStyles";
import { API_BASE_URL } from "../constants/api";

export default function ExitInterview({ visible, onClose, onAnswerUpdate }) {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Sync internal modal visibility with the prop
  useEffect(() => {
    setModalVisible(visible);
    if (visible) {
      // Reset state when opening
      fetchQuestions();
      setSelectedQuestion(null);
      setAnswer("");
      setSuccess(false);
    }
  }, [visible]);

  const handleCloseModal = () => {
    setModalVisible(false);
    if (onClose) onClose();
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      const data = await response.json();
      const items = Array.isArray(data) ? data : [];
      setQuestions(items);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setQuestions([]);
    }
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setAnswer("");
  };

  const handleBack = () => {
    setSelectedQuestion(null);
    setAnswer("");
  };

  const handleAnswerSubmit = async () => {
    if (!selectedQuestion) return;

    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          answer,
        }),
      });

      setLoading(false);
      setSuccess(true);
      if (onAnswerUpdate) {
        onAnswerUpdate({ questionId: selectedQuestion.id, answer });
      }
      fetchQuestions();
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setLoading(false);
    }
  };

  const renderQuestionsList = () => {
    if (questions.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#CBD5E0" />
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptySubtitle}>
            You've answered all available questions
          </Text>
        </View>
      );
    }

    return questions.map((question) => (
      <TouchableOpacity
        key={question.id}
        style={styles.questionCard}
        onPress={() => handleQuestionSelect(question)}
        activeOpacity={0.7}
      >
        <View style={styles.questionCardHeader}>
          <View style={styles.questionIconContainer}>
            <MaterialIcons name="live-help" size={28} color="#7edc9dff" />
          </View>
          <View style={styles.questionCardInfo}>
            <Text style={styles.questionCardTitle} numberOfLines={2}>
              {question.questionText || "No question text"}
            </Text>
            <Text style={styles.questionCardMeta}>
              Posted by {question?.guidanceStaff?.person?.firstName}{" "}
              {question?.guidanceStaff?.person?.lastName} •{" "}
              {new Date(question?.dateCreated).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </View>
      </TouchableOpacity>
    ));
  };

  const renderAnswerView = () => (
    <View style={styles.answerContainer}>
      <View style={styles.answerHeader}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1B5E20" />
        </TouchableOpacity>
        <Text style={styles.answerHeaderTitle}>Answer Question</Text>
      </View>

      <ScrollView
        style={styles.answerContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionDetailCard}>
          <Text style={styles.questionDetailLabel}>Question</Text>
          <Text style={styles.questionDetailText}>
            {selectedQuestion?.questionText}
          </Text>

          <View style={styles.questionDetailMeta}>
            <Ionicons name="person-outline" size={14} color="#64748B" />
            <Text style={styles.questionDetailMetaText}>
              Posted by {selectedQuestion?.guidanceStaff?.person?.firstName}{" "}
              {selectedQuestion?.guidanceStaff?.person?.lastName}
            </Text>
          </View>

          <View style={styles.questionDetailMeta}>
            <Ionicons name="calendar-outline" size={14} color="#64748B" />
            <Text style={styles.questionDetailMetaText}>
              {new Date(selectedQuestion?.dateCreated).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        <View style={styles.answerInputContainer}>
          <Text style={styles.answerInputLabel}>Your Answer *</Text>
          <TextInput
            style={styles.answerInput}
            placeholder="Type your answer here..."
            placeholderTextColor="#94A3B8"
            value={answer}
            onChangeText={setAnswer}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            editable={!loading}
          />
          <Text style={styles.answerInputHint}>
            Take your time to reflect and share your thoughts honestly.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.answerActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleBack}
          activeOpacity={0.7}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            loading && styles.submitButtonDisabled,
          ]}
          onPress={handleAnswerSubmit}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {success && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Answer submitted successfully!</Text>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {selectedQuestion ? (
          renderAnswerView()
        ) : (
          <>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Self-Assessment</Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={28} color="#1B5E20" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.questionsContainer}
              contentContainerStyle={styles.questionsContent}
              showsVerticalScrollIndicator={false}
            >
              {renderQuestionsList()}
            </ScrollView>
          </>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}