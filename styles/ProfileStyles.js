import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  // ====================================================================
  // MAIN CONTAINER
  // ====================================================================
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: Platform.OS === 'android' ? 50 : 0,
  },
  scrollContainer: { 
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140,
  },

  // ====================================================================
  // HEADER CARD
  // ====================================================================
  header: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  headerInfo: { 
    flex: 1,
  },
  name: { 
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  role: { 
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // ====================================================================
  // INFO CARD SECTION
  // ====================================================================
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  label: { 
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  value: { 
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
    letterSpacing: 0.2,
    lineHeight: 22,
  },

  // ====================================================================
  // INPUT FIELDS (Matching Login Style)
  // ====================================================================
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    minHeight: 110,
    textAlignVertical: 'top',
    lineHeight: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // ====================================================================
  // ACTION BUTTONS (Top Row - Edit + Logout)
  // ====================================================================
  buttonRowTop: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  logoutBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#EF4444",
    borderWidth: 1.5,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // ====================================================================
  // SAVE/CANCEL BUTTONS (Edit Mode)
  // ====================================================================
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#DC2626",
    borderWidth: 1.5,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  disabledBtn: {
    opacity: 0.5,
  },

  // ====================================================================
  // LOADING STATE
  // ====================================================================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f3f4f6",
  },
  loadingText: {
    marginTop: 16,
    color: "#6b7280",
    fontSize: 15,
    fontWeight: "600",
  },

  // ====================================================================
  // ERROR STATE
  // ====================================================================
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: "#f3f4f6",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontWeight: "600",
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});