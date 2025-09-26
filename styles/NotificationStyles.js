import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5F6FF", 
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#A8E6CF",
    padding: 5,
    borderRadius: 5,
    color: "#000",
  },
  notificationCard: {
    backgroundColor: "#CFFFD4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  notificationDate: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#AEDFF7",
    borderRadius: 15,
    position: "absolute",
    bottom: 10,
    width: width - 40,
    alignSelf: "center",
  },
  navIcon: {
    fontSize: 24,
  },
});

export default styles;
