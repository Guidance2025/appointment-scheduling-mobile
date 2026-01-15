import { StyleSheet } from 'react-native';

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },

  collegeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },

  loginBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  loginTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },

  formContainer: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: 0.25,
  },

  textField: {
    width: '100%',
    height: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#ffffff',
  },

  textFieldFocused: {
    borderColor: '#4A9782',
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },

  textFieldError: {
    borderColor: '#ef4444',
    borderWidth: 2,
    backgroundColor: '#fef2f2',
  },

  fieldError: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 4,
    fontWeight: '500',
  },

  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#16a34a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  buttonPressed: {
    backgroundColor: '#15803d',
    transform: [{ scale: 0.98 }],
  },

  buttonDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.6,
  },

  buttonLoading: {
    backgroundColor: '#15803d',
  },

  loginLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  forgotPasswordContainer: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },

  forgotPasswordText: {
    color: '#4A9782',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },

  title: {
    position: 'relative',
    left: 5,
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 10,
    letterSpacing: -0.5,
  },

  textFieldSuccess: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },

  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },

  inputContainer: {
    width: '100%',
    marginBottom: 4,
  },

  signupContainer: {
    flexDirection: 'row',
    marginTop: 32,
    alignItems: 'center',
  },

  signupText: {
    color: '#6b7280',
    fontSize: 14,
  },

  signupLink: {
    color: '#4A9782',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  socialButtonContainer: {
    width: '100%',
    marginTop: 24,
  },

  socialButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
  },

  socialButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },

  dividerText: {
    color: '#6b7280',
    fontSize: 14,
    paddingHorizontal: 16,
  },

  errorMessage: {
    backgroundColor: '#fee',
    borderWidth: 1,
    borderColor: '#fcc',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
errorContainer: {
  backgroundColor: '#fee2e2',
  borderRadius: 8,
  padding: 12,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: '#fecaca',
},

errorText: {
  color: '#dc2626',
  fontSize: 14,
  fontWeight: '500',
  textAlign: 'center',
  marginBottom: 4,
},

timerText: {
  color: '#991b1b',
  fontSize: 16,
  fontWeight: '700',
  textAlign: 'center',
  marginTop: 8,
  letterSpacing: 1,
},

buttonLoading: {
  backgroundColor: '#9ca3af',
  opacity: 0.6,
},

textFieldError: {
  borderColor: '#dc2626',
  borderWidth: 2,
},
  
});

export default LoginStyles;