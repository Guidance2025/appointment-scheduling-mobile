import { StyleSheet, Dimensions, Platform } from "react-native";
const { width } = Dimensions.get("window");

export default StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#ffffffff",
      paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 23, fontWeight: "700", color: "#333" , marginBottom: 5 },

  list: { paddingHorizontal: 18, paddingBottom: 140 },

  notifCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  notifLeft: { flex: 1, paddingRight: 8 },
  notifRight: { alignItems: "flex-end", justifyContent: "space-between" },

  notifTitle: { fontSize: 15, fontWeight: "700", color: "#3a3939ff" },
  notifBrief: { fontSize: 13, color: "#555", marginTop: 6 },
  notifDate: { fontSize: 13, color: "#777",marginTop: 10 },

  
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  modalSheet: {
    position: "absolute",
    bottom: 2,
    width: width,
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 18,
    maxHeight: "100%",
  },
  modalHandle: { width: 60, height: 6, backgroundColor: "#ffffffff", alignSelf: "center", borderRadius: 6, marginBottom: 10 },
  modalTitle: { fontSize: 23, fontWeight: "700", color: "#333" },
  modalDate: { fontSize: 13, color: "#666", marginTop: 6 },
  modalDetails: { fontSize: 14, color: "#444", marginTop: 10 , marginBottom: 20, lineHeight: 23 , fontWeight: 500 },

  modalBackBtn: {
    backgroundColor: "#48BB78",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
  modalBackText: { color: "#fff", fontWeight: "700" },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#48BB78",
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: { alignItems: "center" },
  navLabel: { color: "#b9b9b9ff", fontSize: 11, marginTop: 2 },
});
