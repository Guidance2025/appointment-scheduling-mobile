import React, { useState } from "react";
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
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";
import styles from "../styles/ExitInterviewStyles";
import { SuccessMessage } from './modal/message/SuccessMessage';

export default function ExitInterview({
  visible,
  onClose,
  questions,
  onAnswerSubmitted,
}) {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setAnswer("");
  };

  const handleBack = () => {
    setSelectedQuestion(null);
    setAnswer("");
  };

  const handleSuccessClose = () => {
    setOnSuccess(false);
    handleBack();
    if (onAnswerSubmitted) {
      onAnswerSubmitted();
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      Alert.alert("Error", "Please enter your answer before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        Alert.alert("Error", "Authentication required");
        setSubmitting(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/exit-interview/submit-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionId: selectedQuestion.id,
            responseText: answer.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit answer");
      }

      setSubmitting(false);
      setOnSuccess(true);
    

    } catch (error) {
      console.error("Error submitting answer:", error);
      setSubmitting(false);
      
      if (error.message.includes("already answered")) {
        Alert.alert("Already Answered", "You have already answered this question.");
        handleBack();
        if (onAnswerSubmitted) {
          onAnswerSubmitted();
        }
      } else {
        Alert.alert("Error", "Failed to submit answer. Please try again.");
      }
    }
  };

  const renderQuestionsList = () => {
    if (questions.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="checkmark-circle-outline"
            size={64}
            color="#CBD5E0"
          />
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptySubtitle}>
            You've answered all available questions
          </Text>
        </View>
      );
    }

    const sortedQuestions = [...questions].sort((a, b) => {
      const dateA = new Date(a.dateCreated);
      const dateB = new Date(b.dateCreated);
      return dateB - dateA; 
    });

    return sortedQuestions.map((question) => (
      <TouchableOpacity
        key={question.id}
        style={styles.questionCard}
        onPress={() => handleSelectQuestion(question)}
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

  const renderAnswerView = () => {
    return (
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
                  }
                )}
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
              editable={!submitting}
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
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitAnswer}
            activeOpacity={0.7}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Submit Answer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        {onSuccess && (
          <SuccessMessage 
            visible={onSuccess} 
            onClose={handleSuccessClose} 
            message="Your answer has been submitted successfully!" 
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {selectedQuestion ? (
          renderAnswerView()
        ) : (
          <>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Exit Interview</Text>
              <TouchableOpacity
                onPress={onClose}
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