import React, { useState, useEffect } from "react";
import { 
  View, 
  TextInput, 
  Text, 
  Pressable, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import LoginStyles from "../styles/LoginStyles";
import GabayLogo from "../assets/Gabay.png";
import { login } from "../service/auth";
import { getFCMToken, registerFcmToken } from "../service/fcm";
import { setupFCMHandlers } from "../service/notification";

const LoginScreen = ({ onNavigate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  const [tokenStatus, setTokenStatus] = useState("Pending...");
  const [tokenError, setTokenError] = useState(null);
  const [error, setError] = useState("");
  
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    const init = async () => {
      const unsubscribe = setupFCMHandlers(setFcmToken, setTokenStatus);
      setTimeout(() => getFCMToken(setFcmToken, setTokenStatus, setTokenError), 1000);
      return () => unsubscribe && unsubscribe();
    };
    init();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }
    
    setError("");
    setIsLoading(true);

    try {
      const result = await login(username, password);
      const userId = result?.userId;
      
      console.log("✅ Login successful");
      
      // FCM token registration
      try {
        let tokenToRegister = fcmToken;
        
        if (!tokenToRegister) {
          console.log("⚠️ FCM token not available, requesting new token...");
          tokenToRegister = await getFCMToken(setFcmToken, setTokenStatus, setTokenError);
        }
        
        if (tokenToRegister) {
          console.log("📱 Registering FCM token for user:", userId);
          await registerFcmToken(userId, tokenToRegister);
          console.log("✅ FCM token registered successfully");
        } else {
          console.error("❌ Failed to obtain FCM token");
          Alert.alert(
            "Notification Setup",
            "Unable to set up notifications. You may not receive push notifications.",
            [{ text: "OK" }]
          );
        }
      } catch (fcmError) {
        console.error("❌ FCM token registration failed:", fcmError);
        Alert.alert(
          "Notification Setup",
          "Failed to set up notifications. You may not receive push notifications.",
          [{ text: "OK" }]
        );
      }

      onNavigate("dashboard");
      
    } catch (err) {
      let errorMessage = "An error occurred. Please try again.";
      const errorMsg = (err.message || "").toUpperCase();
      
      if (
        err.status === 401 || 
        errorMsg.includes("INCORRECT") || 
        errorMsg.includes("USERNAME/PASSWORD") ||
        errorMsg.includes("BAD CREDENTIALS") ||
        errorMsg.includes("BAD_REQUEST") ||
        errorMsg.includes("400")
      ) {
        errorMessage = "Invalid username or password. Please try again.";
        console.log("❌ Invalid credentials");
      }
      else if (err.status === 403) {
        errorMessage = "Access denied. Please check your credentials.";
        console.log("❌ Access forbidden");
      }
      else if (errorMsg.includes("NETWORK") || errorMsg.includes("FAILED TO FETCH")) {
        errorMessage = "Network error. Please check your connection.";
        console.log("❌ Network error");
      }
      else if (err.message && !err.message.includes("{")) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={LoginStyles.container}>
            <Image source={GabayLogo} style={LoginStyles.logo} />
            <Text style={LoginStyles.collegeTitle}>Rogationist College</Text>
            <Text style={LoginStyles.subtitle}>Guidance and Counseling</Text>
            
            <View style={LoginStyles.loginBox}>
              <Text style={LoginStyles.loginTitle}>LOG IN</Text>
              
              {error && (
                <View style={LoginStyles.errorContainer}>
                  <Text style={LoginStyles.errorText}>{error}</Text>
                </View>
              )}
              
              <View style={LoginStyles.formContainer}>
                <Text style={LoginStyles.label}>Student Number</Text>
                <TextInput
                  style={[
                    LoginStyles.textField,
                    usernameFocused && LoginStyles.textFieldFocused,
                    error && LoginStyles.textFieldError
                  ]}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    setError("");
                  }}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                  placeholder="Student Number"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  editable={!isLoading}
                />
                
                <Text style={LoginStyles.label}>Password</Text>
                <TextInput
                  style={[
                    LoginStyles.textField,
                    passwordFocused && LoginStyles.textFieldFocused,
                    error && LoginStyles.textFieldError
                  ]}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError("");
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!isLoading}
                />
                
                <Pressable
                  style={({ pressed }) => [
                    LoginStyles.button,
                    pressed && LoginStyles.buttonPressed,
                    isLoading && LoginStyles.buttonLoading,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={LoginStyles.loginLabel}>
                    {isLoading ? "SUBMITTING..." : "LOG IN"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;