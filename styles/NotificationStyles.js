import { StyleSheet, Dimensions, Platform } from "react-native";
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  
  headerTitle: { 
    flex: 1, 
    textAlign: "center", 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#111827",
    letterSpacing: 0.2,
  },

  list: { 
    paddingHorizontal: 0, 
    paddingBottom: 140,
  },

  notifCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  
  notifLeft: { 
    flex: 1, 
    paddingRight: 20,
  },
  
  notifRight: { 
    alignItems: "flex-end", 
    justifyContent: "flex-start",
    paddingTop: 4,
  },

  notifTitle: { 
    fontSize: 14, 
    fontWeight: "500", 
    color: "#111827",
    lineHeight: 21,
    marginBottom: 6,
  },
  
  notifBrief: { 
    fontSize: 13, 
    color: "#6b7280", 
    marginTop: 2,
    lineHeight: 18,
  },
  
  notifDate: { 
    fontSize: 12, 
    color: "#9ca3af",
    marginTop: 2,
    lineHeight: 16,
  },

  notifType: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    marginTop: 2,
  },
  
  modalBackdrop: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  
  modalSheet: {
    position: "absolute",
    bottom: 0,
    width: width,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  
  modalHandle: { 
    width: 40, 
    height: 4, 
    backgroundColor: "#d1d5db", 
    alignSelf: "center", 
    borderRadius: 2, 
    marginBottom: 16,
  },
  
  modalTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#111827",
    marginBottom: 4,
  },
  
  modalDate: { 
    fontSize: 12, 
    color: "#9ca3af", 
    marginBottom: 16,
  },
  
  modalDetails: { 
    fontSize: 14, 
    color: "#374151", 
    lineHeight: 21,
    marginBottom: 20,
  },

  actionButtonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },

  acceptButton: {
    flex: 1,
    backgroundColor: "#5dd174",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 4,
  },

  acceptButtonDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.6,
  },

  declineButton: {
    flex: 1,
    backgroundColor: "#e3726a",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 4,
  },

  declineButtonDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.6,
  },

  actionButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },

  modalBackBtn: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  
  modalBackText: { 
    color: "#374151", 
    fontWeight: "600",
    fontSize: 14,
  },

  notifCardUnread: {
    backgroundColor: "#d9ecf9ff",
  },

  notifCardAccepted: {
    backgroundColor: "#def5e8ff",
  },

  notifCardDeclined: {
    backgroundColor: "#fef1f0",
  },

  notifCardRequest: {
    backgroundColor: "#e3f2fd",
  },
  notifCardReminder: {
    backgroundColor: "#f3f59bff",
  },

  emptyContainer: {
    padding: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 20,
  },

  loadingContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#48BB78",
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  
  navItem: { 
    alignItems: "center",
  },
  
  navLabel: { 
    color: "#b9b9b9ff", 
    fontSize: 11, 
    marginTop: 2,
  },
});