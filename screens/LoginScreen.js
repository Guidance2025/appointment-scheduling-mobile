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
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  
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

  useEffect(() => {
    const loadLockState = async () => {
      try {
        const savedLockTime = await AsyncStorage.getItem('accountLockTime');
        
        if (savedLockTime) {
          const lockTime = parseInt(savedLockTime, 10);
          const now = Date.now();
          
          if (lockTime > now) {
          
            setIsLocked(true);
            setLockTimer(lockTime);
            setError("Your account has been locked due to 5 failed login attempts. Please wait 15 minutes.");
            console.log(" Account is locked until:", new Date(lockTime));
          } else {
            await AsyncStorage.removeItem('accountLockTime');
            console.log(" Lock time expired, clearing storage");
          }
        }
      } catch (err) {
        console.error("Error loading lock state:", err);
      }
    };
    
    loadLockState();
  }, []);

  useEffect(() => {
    let intervalId = null;
    
    if (isLocked && lockTimer) {
      intervalId = setInterval(() => {
        const remaining = lockTimer - Date.now();
        
        if (remaining <= 0) {
          setIsLocked(false);
          setLockTimer(null);
          setRemainingTime(null);
          setError("");
          AsyncStorage.removeItem('accountLockTime');
          console.log(" Account automatically unlocked");
        } else {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLocked, lockTimer]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }
    
   
    if (isLocked) {
      Alert.alert(
        "Account Locked",
        `Your account is locked. Please wait ${remainingTime || "15 minutes"} before trying again.`,
        [{ text: "OK" }]
      );
      return;
    }
    
    setError("");
    setIsLoading(true);

    try {
      const result = await login(username, password);
      const userId = result?.userId;
      
      await AsyncStorage.removeItem('accountLockTime');
      console.log(" Login successful, cleared lock state");
      
      
      let tokenToRegister = fcmToken || (await getFCMToken(setFcmToken, setTokenStatus, setTokenError));
    
      if (tokenToRegister) {
        await registerFcmToken(userId, tokenToRegister);
      }

      onNavigate("dashboard");
      
    } catch (err) {
      
      let errorMessage = "An error occurred. Please try again.";
      let accountLocked = false;
      
      const errorMsg = (err.message || "").toUpperCase();
      
      if (err.status === 423) {
      
        errorMessage = "Your account has been locked due to 5 failed login attempts. Please wait 15 minutes.";
        accountLocked = true;
        console.log(" Account locked detected via status 423");
      }
      else if (
        errorMsg.includes("LOCKED") || 
        errorMsg.includes("ACCOUNT HAS BEEN LOCKED") ||
        errorMsg.includes("MULTIPLE FAILED LOGIN ATTEMPTS") ||
        errorMsg.includes("TOO MANY") ||
        errorMsg.includes("MAX LOGIN ATTEMPTS")
      ) {
        errorMessage = "Your account has been locked due to 5 failed login attempts. Please wait 15 minutes.";
        accountLocked = true;
        console.log(" Account locked detected via error message");
      }
      else if (errorMsg.includes("DISABLED") || errorMsg.includes("ACCOUNT HAS BEEN DISABLED")) {
        errorMessage = "Your account has been disabled. Please contact support.";
        accountLocked = true;
        console.log(" Account disabled detected");
      }
      else if (
        err.status === 401 || 
        errorMsg.includes("INCORRECT") || 
        errorMsg.includes("USERNAME/PASSWORD") ||
        errorMsg.includes("BAD CREDENTIALS") ||
        errorMsg.includes("BAD_REQUEST") ||
        errorMsg.includes("400")
      ) {
        errorMessage = "Invalid username or password. Please try again.";
        console.log(" Invalid credentials");
      }
      else if (err.status === 403) {
        errorMessage = "Access denied. Please check your credentials.";
        console.log(" Access forbidden");
      }
      else if (errorMsg.includes("NETWORK") || errorMsg.includes("FAILED TO FETCH")) {
        errorMessage = "Network error. Please check your connection.";
        console.log(" Network error");
      }
      else if (err.message && !err.message.includes("{")) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      

      if (accountLocked && !isLocked) {
        const unlockTime = Date.now() + (15 * 60 * 1000); 
        await AsyncStorage.setItem('accountLockTime', unlockTime.toString());
        setLockTimer(unlockTime);
        setIsLocked(true);
        console.log(" Account locked. Unlock time:", new Date(unlockTime));
        
        Alert.alert(
          "Account Locked",
          "Your account has been locked due to 5 failed login attempts. Please wait 15 minutes or contact support.",
          [{ text: "OK" }]
        );
      }
      
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
                  {isLocked && remainingTime && (
                    <Text style={LoginStyles.timerText}>
                      Unlock in: {remainingTime}
                    </Text>
                  )}
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
                    if (!isLocked) setError(""); 
                  }}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                  placeholder="Student ID"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  editable={!isLoading && !isLocked}
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
                    if (!isLocked) setError(""); 
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!isLoading && !isLocked}
                />
                
                <Pressable
                  style={({ pressed }) => [
                    LoginStyles.button,
                    pressed && LoginStyles.buttonPressed,
                    (isLoading || isLocked) && LoginStyles.buttonLoading,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading || isLocked}
                >
                  <Text style={LoginStyles.loginLabel}>
                    {isLoading 
                      ? "SUBMITTING..." 
                      : isLocked 
                        ? `LOCKED ${remainingTime ? `(${remainingTime})` : ''}` 
                        : "LOG IN"
                    }
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