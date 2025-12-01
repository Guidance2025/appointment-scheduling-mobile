import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B5E20",
    textAlign: "center",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#334155",
    textAlign: "center",
    marginBottom: 16,
    marginHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
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
    marginBottom: 20,
  },
  quoteTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 15,
    color: "#1E293B",
    marginBottom: 8,
  },
  quoteMeta: {
    fontSize: 12,
    color: "#64748B",
  },
  postsCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  postItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  postSelected: {
    borderColor: "#48BB78",
    borderWidth: 2,
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
    color: "#334155",
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
});