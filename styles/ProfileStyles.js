import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    paddingTop: Platform.OS === 'android' ? 50 : 0,
  },
  scrollContainer: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 140 
  },

  header: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#48BB78",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
    letterSpacing: 0.5,
  },

  headerInfo: { flex: 1 },

  name: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#1E293B",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  role: { 
    fontSize: 14, 
    color: "#64748B",
    fontWeight: "500",
  },

  // Card Section
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  label: { 
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  value: { 
    fontSize: 15, 
    color: "#1E293B",
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  input: {
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "500",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F0FDF4",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // ⭐ Horizontal Buttons (Edit Profile + Logout)
  buttonRowTop: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },

  editBtn: {
    flex: 1,
    backgroundColor: '#63bd88f1',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#48BB78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  logoutBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: "#ef44445d",
    borderWidth: 2,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },

  saveBtn: {
    flex: 1,
    backgroundColor: '#63bd88f1',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#48BB78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: "#ef44445d",
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#EF4444',
    fontSize: 15,
    letterSpacing: 0.5,
  },

  // Loading & Error
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#48BB78',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#48BB78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
