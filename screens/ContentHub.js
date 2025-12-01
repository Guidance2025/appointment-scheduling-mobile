import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/ContentHubStyles";
import { API_BASE_URL } from "../constants/api";
import CommentModal from "./modal/CommentModal";

export default function ContentHub({ onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [activePostId, setActivePostId] = useState(null);

  const authHeaders = async () => {
    const token = await AsyncStorage.getItem("jwtToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const headers = await authHeaders();
      const resPosts = await fetch(`${API_BASE_URL}/posts`, { headers });
      const resQuote = await fetch(`${API_BASE_URL}/posts/quote-of-the-day`, { headers });
      const postsData = await resPosts.json();
      const quoteData = resQuote.ok ? await resQuote.json() : null;
      setPosts(postsData || []);
      setQuote(quoteData);
    } catch (err) {
      console.error("Failed to load ContentHub:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkDeleting(true);
    try {
      const headers = await authHeaders();
      for (const id of ids) {
        await fetch(`${API_BASE_URL}/posts/${id}`, { method: "DELETE", headers });
      }
      await loadData();
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Bulk delete failed:", err);
    } finally {
      setBulkDeleting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Content Hub</Text>
        <Text style={styles.subtitle}>
          Guidance posts, announcements, and Quote of the Day.
        </Text>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#48BB78" />
            <Text style={styles.loadingText}>Loading posts...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Quote of the Day */}
            <View style={styles.quoteCard}>
              <Text style={styles.quoteTitle}>Quote of the Day</Text>
              <Text style={styles.quoteText}>
                {quote?.postContent || "No quote set today."}
              </Text>
              {quote?.postedDate && (
                <Text style={styles.quoteMeta}>
                  {new Date(quote.postedDate).toLocaleString()}
                </Text>
              )}
            </View>

            {/* Posts */}
            <View style={styles.postsCard}>
              <Text style={styles.sectionTitle}>Posts</Text>
              {posts.length === 0 ? (
                <Text style={styles.emptyMessage}>No posts yet.</Text>
              ) : (
                posts.map((p) => (
                    <TouchableOpacity
                    style={styles.commentButton}
                    onPress={() => {
                        setActivePostId(p.postId);
                        setCommentModalOpen(true);
                    }}
                    >
                    <View style={styles.postHeader}>
                      <Text style={styles.postAuthor}>
                        {p.postedBy || "Guidance Staff"}
                      </Text>
                      <Text style={styles.postCategory}>{p.categoryName}</Text>
                      {p.sectionName && (
                        <Text style={styles.postSection}>• {p.sectionName}</Text>
                      )}
                    </View>
                    <Text style={styles.postContent}>{p.postContent}</Text>
                    <Text style={styles.postDate}>
                      {p.postedDate ? new Date(p.postedDate).toLocaleString() : ""}
                    </Text>
                    <Text style={styles.commentButtonText}>Comments</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <CommentModal
                postId={activePostId}
                isOpen={commentModalOpen}
                onClose={() => setCommentModalOpen(false)}
                />
          </ScrollView>
        )}
      </View>
    </View>
  );
}