import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#E8F5E9",
  }, 
  headerLogo: {
    width: 70,
  height: 70,
  borderRadius: 14,
  overflow: 'hidden'
  },
  notificationIconContainer: {
    position: 'relative',
    padding: 8,
    
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 2.5,
    borderColor: "#E8F5E9",
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: "#E8F5E9",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B5E20",
    lineHeight: 36,
    marginBottom: 12,
    letterSpacing: 0.9,
  },
  studentInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  studentIcon: {
    marginRight: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#4A5568",
    fontWeight: "400",
    letterSpacing: 0.1,
  },
  bulletPoint: {
    color: "#94A3B8",
    fontWeight: "400",
  },

  // Appointments Container
  appointmentsContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 28,
    marginTop: 4,
  },
  appointmentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentsListContent: {
    paddingBottom: 180,
  },

  // Appointment Card - IMPROVED
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  dateContainer: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    letterSpacing: 0.1,
  },
  statusBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E40AF",
    letterSpacing: 0.3,
  },
  appointmentDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 14,
  },
  appointmentBody: {
    paddingTop: 2,
  },
  appointmentType: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 12,
    lineHeight: 26,
    letterSpacing: 0.1,
  },
  staffContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  staffIcon: {
    marginRight: 10,
  },
  appointmentNotes: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
    flex: 1,
    lineHeight: 22,
  },

  // Book Button - IMPROVED
  bookButtonContainer: {
    position: "absolute",
    bottom: 88,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bookButton: {
    backgroundColor: "#48BB78",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#48BB78",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  bookButtonIcon: {
    marginRight: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Bottom Navigation Bar
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 70,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 5,
    letterSpacing: 0.3,
  },
  navLabelActive: {
    color: "#48BB78",
    fontWeight: "700",
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
  },
  loadingText: {
    marginTop: 16,
    color: "#64748B",
    fontSize: 15,
    fontWeight: "600",
  },
});