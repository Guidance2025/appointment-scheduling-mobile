import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalBackdrop: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 12,
    textAlign: "center",
  },
  scrollView: {
    marginBottom: 12,
  },
  commentItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 6,
  },
  commentAuthor: {
    fontWeight: "600",
    color: "#334155",
  },
  commentText: {
    fontSize: 14,
    color: "#1E293B",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  toggleButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  toggleText: {
    fontSize: 13,
    color: "#64748B",
  },
  submitButton: {
    backgroundColor: "#48BB78",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "600",
  },
  centerContent: {
    alignItems: "center",
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    color: "#64748B",
  },
});