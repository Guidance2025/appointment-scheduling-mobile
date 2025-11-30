import { Platform, StyleSheet } from "react-native";

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
  },
  loadingText: {
    marginTop: 16,
    color: "#64748B",
    fontSize: 15,
    fontWeight: "600",
  },

  header: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B5E20",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
  },

  filtersContainer: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#D1FAE5",
    minWidth: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: "#48BB78",
    borderColor: "#48BB78",
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#F8FFFE",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D1FAE5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  typeContainer: {
    flex: 1,
    marginRight: 12,
  },
  appointmentType: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: 0.2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  cardBody: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
    lineHeight: 20,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
  },
});