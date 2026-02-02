import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#f3f4f6",
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
    borderColor: "#f3f4f6",
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
    backgroundColor: "#f3f4f6",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 36,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  studentInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  studentIcon: {
    marginRight: 6,
  },
  welcomeSubtitle: {
    position: "relative",
    left: 5,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  // Quick Access Carousel Styles
  carouselContainer: {
    marginBottom: 16,
  },
  quickAccessCarousel: {
    paddingRight: 20,
  },
  quickAccessCard: {
    width: width - 40, // Same width as assessment button
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 0,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAccessIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  quickAccessTextContainer: {
    flex: 1,
  },
  quickAccessCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  quickAccessCardSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "400",
  },

  // Swipe Indicator Dots
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
    gap: 6,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d1d5db",
  },
  indicatorDotActive: {
    backgroundColor: "#16a34a",
    width: 20,
  },

  cardActions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  rescheduleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },

  rescheduleButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#DC2626",
  },

  cancelButtonText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
  },

  pendingRescheduleInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0E7FF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 16,
    borderRadius: 8,
    gap: 6,
  },

  pendingRescheduleText: {
    color: "#4F46E5",
    fontSize: 13,
    fontWeight: "600",
  },

  infoValue: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    flex: 1,
    fontWeight: "500",
  },

  typeContainer: {
    flex: 1,
  },

  appointmentType: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  cardBody: {
    gap: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  appointmentsContainer: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: 0,
  },
  appointmentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentsListContent: {
    paddingTop: 12,
    paddingBottom: 180,
    gap: 16,
  },

  assessmentButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FCD34D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  assessmentButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  assessmentButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    letterSpacing: 0.2,
  },

  appointmentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#3B82F620",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: "#3B82F6",
  },

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
    position: "relative",
    bottom: 20,
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#16a34a",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  bookButtonIcon: {
    marginRight: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

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
    color: "#16a34a",
    fontWeight: "700",
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyAppointmentsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 16,
    color: "#6b7280",
    fontSize: 15,
    fontWeight: "600",
  },
});