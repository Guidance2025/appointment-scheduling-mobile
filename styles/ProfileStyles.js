import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { paddingHorizontal: 18, paddingTop: 30, paddingBottom: 140 },
  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  avatar: { width: 72, height: 72, borderRadius: 12 },
  name: { fontSize: 18, fontWeight: "700", color: "#333" },
  role: { fontSize: 13, color: "#666", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  label: { fontSize: 13, color: "#777", marginTop: 8 },
  value: { fontSize: 15, color: "#111", marginTop: 4 },

  editBtn: { marginTop: 18, alignSelf: "flex-start" },
  editText: { color: "#48BB78", fontWeight: "700" },

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
  navLabel: { color: "#fff", fontSize: 11, marginTop: 2 },
});
