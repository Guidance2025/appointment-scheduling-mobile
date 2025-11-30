import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scrollContainer: { 
    paddingHorizontal: 18, 
    paddingTop: 30, 
    paddingBottom: 140 
  },
  topRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 18 
  },
  avatar: { 
    width: 72, 
    height: 72, 
    borderRadius: 12 
  },
  name: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#333", 
  },
  role: { 
    fontSize: 13, 
    color: "#666", 
    marginTop: 4 
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  label: { 
    fontSize: 13, 
    color: "#777", 
    marginTop: 8 
  },
  value: { 
    fontSize: 15, 
    color: "#111", 
    marginTop: 4 
  },

  editBtn: {
    backgroundColor: '#6bdc83ff',
    borderColor : "#fcfcfcff",
    borderWidth : 1,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5fcc77ff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  editText: {
    color: '#eef5f0ff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  saveBtn: {
    backgroundColor: ' rgb(46, 184, 53)',
    borderColor : "#5fcc77ff",
    borderWidth : 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5fcc77ff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveText: {
    color: '#f1f5f2ff',
    fontSize: 14,
    fontWeight: '600',
  },

  cancelBtn: {
   backgroundColor: '#ffffffff',
    borderColor : "#e64e4eff",
    borderWidth : 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#dc3545',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelText: {
    color: '#e64e4eff',
    fontSize: 14,
    fontWeight: '600',
  },

  logoutBtn: {
    backgroundColor: '#ffffffff',
    borderColor : "#e64e4eff",
    borderWidth : 1,
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#dc3545',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutText: {
    color: '#df4646ff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
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
    alignItems: "center" 
  },
  navLabel: { 
    color: "#949494ff", 
    fontSize: 11, 
    marginTop: 2 
  },
});