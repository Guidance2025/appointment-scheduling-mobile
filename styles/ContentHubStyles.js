import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  // Outer container for the screen
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // Header bar with title and close button - same as ExitInterview
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 60,
    paddingBottom: 20,
    backgroundColor: "#E8F5E9",
    borderBottomWidth: 1,
    borderBottomColor: "#D1FAE5",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1B5E20",
    letterSpacing: 0.5,
  },

  closeButton: {
    padding: 4,
  },

  // Scroll view styling
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },

  // Quote of the Day styling
  quoteCard: {
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },

  quoteTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 8,
  },

  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 24,
  },

  quoteMeta: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
  },

  // Tabs styling
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },

  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 6,
  },

  tabButtonActive: {
    backgroundColor: "#D1FAE5",
  },

  tabButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
  },

  tabButtonTextActive: {
    color: "#1b5e20",
  },

  // Posts container
  postsContainer: {
    marginBottom: 20,
  },

  postItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  postHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  postHeaderInfo: {
    marginBottom: 8,
  },

  postAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },

  postCategory: {
    fontSize: 12,
    fontWeight: "500",
    color: "#7c3aed",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  postDate: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 8,
  },

  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#334155",
    marginBottom: 12,
  },

  postSection: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 12,
    fontWeight: "500",
  },

  commentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    gap: 6,
  },

  commentButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1b5e20",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  emptyMessage: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 12,
    fontWeight: "500",
  },
});