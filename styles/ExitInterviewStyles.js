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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#E8F5E9",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B5E20",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#F8FFFE",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
    marginLeft: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1E293B",
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  saveButton: {
    backgroundColor: "#48BB78",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 16,
    fontWeight: "600",
  },
});