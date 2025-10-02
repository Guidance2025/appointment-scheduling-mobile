import { StyleSheet} from 'react-native';


const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  formContainer: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },

  title: {
    position : "relative",
    left : 5,
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 10,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 20,
    alignSelf: 'flex-start',
    width: '100%',
    letterSpacing: 0.25,
  },

  textField: {
    width: '100%',
    height: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },

  textFieldFocused: {
    borderColor: '#4A9782',
    backgroundColor: '#ffffff',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  textFieldError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
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
    alignSelf: 'flex-start',
    width: '100%',
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4A9782',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
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
    backgroundColor: '#47caa7ff',
    transform: [{ scale: 0.98 }],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },

  buttonDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.6,
  },

  buttonLoading: {
    backgroundColor: '#6b7280',
  },

  loginLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.25,
  },

  inputContainer: {
    width: '100%',
    marginBottom: 4,
  },

  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },

  forgotPasswordText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
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
    backgroundColor: "#fee",
    borderWidth: 1,
    borderColor: "#fcc",
    padding: 10,
    borderRadius: 4,
    marginBottom: 15
  },
  errorText: {
    color: "#c33",
    fontSize: 14
  }
});


export default LoginStyles;