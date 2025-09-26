import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    paddingBottom: 100, 
  },

  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
    color: "#376839ff",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalScrollContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  section: {
    width: 150,
    height: 120,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionIcon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  quote: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 5,
  },

  // ✅ NAVBAR STYLES
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#376839ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#DEF2E9",
  },
  navLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  activeNavLabel: {
    fontWeight: "bold",
  },
});

export default styles;
