import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1B5E20",
    textAlign: "center",
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#334155",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#64748B",
  },
  quoteCard: {
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 6,
  },
  quoteText: {
    fontSize: 15,
    color: "#1E293B",
  },
  quoteMeta: {
    fontSize: 12,
    color: "#64748B",
  },
  postsCard: {
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 6,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  postItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  postSelected: {
    borderColor: "#34D399",
    borderWidth: 2,
  },
  postsCard: {
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  postAuthor: {
    fontWeight: "600",
    color: "#1B5E20",
    marginRight: 6,
  },
  postCategory: {
    color: "#374151",
    marginRight: 6,
  },
  postSection: {
    color: "#64748B",
  },
  postContent: {
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 6,
  },
  postDate: {
    fontSize: 12,
    color: "#64748B",
  },
  commentButtonText: {
    marginTop: 6,
    fontSize: 14,
    color: "#10B981",
    fontWeight: "700",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 90,
    backgroundColor: "#fff",
    
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 16,
    fontWeight: "600",
  },
});