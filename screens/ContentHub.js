import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/ContentHubStyles";
import { API_BASE_URL } from "../constants/api";

export default function ContentHub({ onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("announcements");

  const authHeaders = async () => {
    const token = await AsyncStorage.getItem("jwtToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const normalizePosts = (data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map((post) => ({
      postId: post.POST_ID || post.post_id || post.id,
      postContent: post.POST_CONTENT || post.post_content || post.content,
      categoryName: post.CATEGORY_NAME || post.category_name || post.categoryName,
      sectionName: post.SECTION_NAME || post.section_name || post.sectionName,
      postedBy: post.POSTED_BY || post.posted_by || post.postedBy || "Guidance Staff",
      postedDate: post.POSTED_DATE || post.posted_date || post.postedDate,
      organizationName: post.ORGANIZATION || post.organization_name || post.organizationName,
    }));
  };

  const normalizeQuote = (quote) => {
    if (!quote || !Object.keys(quote).length) return null;
    
    return {
      postId: quote.POST_ID || quote.post_id || quote.id,
      postContent: quote.POST_CONTENT || quote.post_content || quote.content,
      postedDate: quote.POSTED_DATE || quote.posted_date || quote.postedDate,
      sectionName: quote.SECTION_NAME || quote.section_name || quote.sectionName,
    };
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const headers = await authHeaders();
      
      // Fetch posts from correct endpoint
      const resPosts = await fetch(`${API_BASE_URL}/api/posts?limit=20`, { 
        headers,
        method: "GET",
      });
      
      // Fetch quote of the day from correct endpoint
      const resQuote = await fetch(`${API_BASE_URL}/api/posts/quote-of-the-day`, { 
        headers,
        method: "GET",
      });

      if (!resPosts.ok) {
        console.error("Failed to fetch posts:", resPosts.status, resPosts.statusText);
        setPosts([]);
      } else {
        const postsData = await resPosts.json();
        console.log("Raw posts data:", postsData);
        const normalized = normalizePosts(postsData);
        console.log("Normalized posts:", normalized);
        setPosts(normalized);
      }

      if (resQuote.ok) {
        const quoteData = await resQuote.json();
        console.log("Raw quote data:", quoteData);
        const normalized = normalizeQuote(quoteData);
        console.log("Normalized quote:", normalized);
        setQuote(normalized);
      } else {
        console.warn("Failed to fetch quote:", resQuote.status);
        setQuote(null);
      }
    } catch (err) {
      console.error("Failed to load ContentHub:", err);
      setPosts([]);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onNavigate("dashboard");
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter posts by category
  const announcementPosts = posts.filter(p =>
    p.categoryName?.toLowerCase() === "announcement" ||
    p.categoryName?.toLowerCase() === "announcements"
  );

  const eventPosts = posts.filter(p =>
    p.categoryName?.toLowerCase() === "event" ||
    p.categoryName?.toLowerCase() === "events"
  );

  const renderPostCard = (post) => (
    <TouchableOpacity
      key={post.postId}
      style={styles.postItem}
      activeOpacity={0.7}
    >
      <View style={styles.postHeader}>
        <View style={styles.postHeaderInfo}>
          <Text style={styles.postAuthor}>
            {post.postedBy || "Guidance Staff"}
          </Text>
          <Text style={styles.postCategory}>
            {post.categoryName || "General"}
          </Text>
        </View>
        <Text style={styles.postDate}>
          {post.postedDate 
            ? new Date(post.postedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            : ""}
        </Text>
      </View>

      <Text style={styles.postContent} numberOfLines={3}>
        {post.postContent}
      </Text>

      {post.sectionName && (
        <Text style={styles.postSection}>📌 {post.sectionName}</Text>
      )}
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    let tabPosts = [];
    
    if (activeTab === "announcements") {
      tabPosts = announcementPosts;
    } else if (activeTab === "events") {
      tabPosts = eventPosts;
    }

    if (tabPosts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons
            name={activeTab === "announcements" ? "notifications-none" : "event-note"}
            size={48}
            color="#CBD5E0"
          />
          <Text style={styles.emptyMessage}>
            No {activeTab} yet.
          </Text>
        </View>
      );
    }

    return (
      <View>
        {tabPosts.map(post => renderPostCard(post))}
      </View>
    );
  };

  return (
    <View style={styles.modalContainer}>
      {/* Header - Same style as ExitInterview */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Content Hub</Text>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={28} color="#1B5E20" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#1B5E20" />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quote of the Day - At Top */}
          {quote && (
            <View style={styles.quoteCard}>
              <Text style={styles.quoteTitle}>✨ Quote of the Day</Text>
              <Text style={styles.quoteText}>
                "{quote.postContent}"
              </Text>
              {quote.sectionName && (
                <Text style={styles.quoteMeta}>
                  — {quote.sectionName}
                </Text>
              )}
            </View>
          )}

          {/* Tabs for Announcements and Events */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "announcements" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("announcements")}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="notifications-active"
                size={20}
                color={activeTab === "announcements" ? "#1B5E20" : "#94A3B8"}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "announcements" && styles.tabButtonTextActive,
                ]}
              >
                Announcements
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "events" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("events")}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="event"
                size={20}
                color={activeTab === "events" ? "#1B5E20" : "#94A3B8"}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "events" && styles.tabButtonTextActive,
                ]}
              >
                Events
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.postsContainer}>
            {renderTabContent()}
          </View>
        </ScrollView>
      )}
    </View>
  );
}