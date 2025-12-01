import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import styles from "../../styles/CommentModalStyles";
import { API_BASE_URL } from "../../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CommentModal({ postId, isOpen, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load comments", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const studentId = await AsyncStorage.getItem("studentId");
      await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          studentId,
          commentText: text,
          isAnonymous: anonymous,
        }),
      });
      setText("");
      setAnonymous(false);
      loadComments();
    } catch (err) {
      console.error("Failed to submit comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadComments();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>Comments</Text>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#48BB78" />
            <Text style={styles.loadingText}>Loading comments...</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView}>
            {comments.map((c) => (
              <View key={c.commentId} style={styles.commentItem}>
                <Text style={styles.commentAuthor}>
                  {c.isAnonymous ? "Anonymous" : c.studentName}
                </Text>
                <Text style={styles.commentText}>{c.commentText}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={text}
          onChangeText={setText}
          multiline
        />

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setAnonymous(!anonymous)}
        >
          <Text style={styles.toggleText}>
            {anonymous ? "Replying Anonymously" : "Reveal Name"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={submitComment}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}