import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A202C",
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },

  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },

  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  selectText: {
    fontSize: 15,
    color: "#2D3748",
    flex: 1,
  },
  selectPlaceholder: {
    fontSize: 15,
    color: "#A0AEC0",
    flex: 1,
  },

  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    marginTop: 8,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#2D3748",
    flex: 1,
  },

  dateTimeInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  dateTimeText: {
    fontSize: 15,
    color: "#2D3748",
    flex: 1,
  },

  textArea: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#2D3748",
    textAlignVertical: "top",
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: "#A0AEC0",
    textAlign: "right",
    marginTop: 4,
  },

  submitButton: {
    backgroundColor: "#48BB78",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#48BB78",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#A0AEC0",
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },


  hintContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FEF3C7',
  padding: 12,
  borderRadius: 8,
  marginBottom: 16,
  gap: 8,
},
hintText: {
  flex: 1,
  fontSize: 14,
  color: '#92400E',
  lineHeight: 18,
},

errorContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFF5F5',
  borderLeftWidth: 4,
  borderLeftColor: '#E53E3E',
  padding: 12,
  borderRadius: 8,
  marginBottom: 16,
},
errorText: {
  color: '#E53E3E',
  fontSize: 14,
  flex: 1,
},
charCount: {
  fontSize: 12,
  color: '#999',
  textAlign: 'right',
  marginTop: 4,
},
});