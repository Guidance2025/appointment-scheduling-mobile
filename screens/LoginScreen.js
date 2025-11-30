import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Pressable, Image } from "react-native";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

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
      let tokenToRegister = fcmToken || (await getFCMToken(setFcmToken, setTokenStatus, setTokenError));
    
      if (tokenToRegister) {
        await registerFcmToken(userId, tokenToRegister);
      }

      onNavigate("dashboard");
    } catch (err) {
      console.error("Login error:", err);
      
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (err.message) {
        
        if (err.message.includes("USERNAME/PASSWORD IS INCORRECT") || 
            err.message.includes("BAD_REQUEST") ||
            err.message.includes("400")) {
          errorMessage = "Invalid username or password. Please try again.";
        }
        else if (err.message.includes("ACCOUNT_LOCKED") || 
                 err.message.includes("YOUR ACCOUNT HAS BEEN LOCKED")) {
          errorMessage = "Your account has been locked. Please contact support.";
        }
        else if (err.message.includes("Network") || 
                 err.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection.";
        }
        
        else if (err.message && !err.message.includes("{")) {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={LoginStyles.container}>
      <Image source={GabayLogo} style={{ width: 120, height: 120 }} />
      <Text style={LoginStyles.title}>GABAY</Text>
      {error && (
        <View style={LoginStyles.errorMessage}>
          <Text style={LoginStyles.errorText}>{error}</Text>
        </View>
      )}
      <View style={LoginStyles.formContainer}>
        <Text style={LoginStyles.label}>Username</Text>
        <TextInput
          style={LoginStyles.textField}
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setError(""); 
          }}
          placeholder="Enter your username"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={LoginStyles.label}>Password</Text>
        <TextInput
          style={LoginStyles.textField}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(""); 
          }}
          secureTextEntry
          placeholder="Enter your password"
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
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;
