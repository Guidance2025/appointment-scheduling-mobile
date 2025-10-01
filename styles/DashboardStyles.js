import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    marginTop: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { width: 56, height: 56, borderRadius: 10 },
  body: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: "700", marginTop: 10, color: "#48BB78", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 12 },

  scrollArea: { marginTop: 6 },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLeft: { flex: 1, paddingRight: 8 },
  cardRight: { justifyContent: "center" },

  cardDate: { fontSize: 13, color: "#666", marginBottom: 6 },
  cardTopic: { fontSize: 16, fontWeight: "700", color: "#2d7a4f" },
  cardCounselor: { fontSize: 14, color: "#777", marginTop: 6 },

  openBtn: { backgroundColor: "#48BB78", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  openBtnText: { color: "#fff", fontWeight: "700" },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#48BB78",
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  navItem: { alignItems: "center" },
  navLabel: { color: "#fff", fontSize: 11, marginTop: 2 },
});
