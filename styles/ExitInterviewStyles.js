import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  // Outer container for the modal
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // Header bar with title and close button
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

  // Container for questions list
  questionsContainer: {
    flex: 1,
  },
  questionsContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Individual question card styling
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  questionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  questionCardInfo: {
    flex: 1,
  },
  questionCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  questionCardMeta: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },

  // Empty state when no questions
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },

  // Container for answering a question
  answerContainer: {
    flex: 1,
  },

  // Header with back and title
  answerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 60,
    paddingBottom: 20,
    backgroundColor: "#E8F5E9",
    borderBottomWidth: 1,
    borderBottomColor: "#D1FAE5",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  answerHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B5E20",
    letterSpacing: 0.3,
  },

  // Scrollable content inside answer view
  answerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Question details card
  questionDetailCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionDetailLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#48BB78",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  questionDetailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    lineHeight: 24,
    marginBottom: 16,
  },
  questionDetailMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  questionDetailMetaText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 6,
    fontWeight: "500",
  },

  // Answer input styling
  answerInputContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  answerInputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  answerInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#1E293B",
    minHeight: 160,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontWeight: "500",
    lineHeight: 22,
  },
  answerInputHint: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 8,
    fontStyle: "italic",
    fontWeight: "500",
  },

  // Action buttons at bottom
  answerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1FAE5",
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#48BB78",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },

  // Success message overlay
  successMessage: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    backgroundColor: "#d4edda",
    padding: 20,
    alignItems: "center",
    borderRadius: 8,
  },
  successText: {
    color: "#155724",
    fontSize: 16,
  },

  openButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});