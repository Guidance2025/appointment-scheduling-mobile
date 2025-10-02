import React, { useState, useEffect } from "react";
import LoginStyles from "../styles/LoginStyles";
import GabayLogo from "../assets/Gabay.png";
import {View,TextInput,Text,Pressable,Alert,Image,Platform} from "react-native";
import messaging from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import notifee, {AndroidImportance,
AndroidStyle,
} from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForgetPasswordModal from "../components/modal/ForgetPasswordModal";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [fcmToken, setFcmToken] = useState(null);
  const [tokenStatus, setTokenStatus] = useState("Pending...");
  const [tokenError, setTokenError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error,setError] = useState('');

  const API_BASE_URL = "http://192.168.1.4:8080";

  

  const getFCMToken = async () => {
    try {
      await messaging().requestPermission();
      const token = await messaging().getToken();
      console.log("📱 Generated FCM Token:", token);

      setFcmToken(token);
      setTokenStatus("Active");
    } catch (err) {
      console.error(" Token generation failed:", err);
      setTokenError(err.message);
      setTokenStatus("Error");
    }
  };

  const registerFCMToken = async (userId, token) => {
    try {
      console.log("📡 Registering FCM token with backend...");
      const response = await fetch(
        `${API_BASE_URL}/notification/register-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            fcmToken: token,
            deviceType: "MOBILE",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend rejected token (${response.status})`);
      }

      console.log(" Token registered successfully with backend");
    } catch (err) {
      console.error(" Failed to register token:", err);
      setTokenError("Backend registration failed");
    }
  };

  const showNotification = async (title, body, data = {}) => {
    
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        smallIcon: "ic_launcher",
        pressAction: { id: "default" },
        importance: AndroidImportance.HIGH,
        style: {
          type: AndroidStyle.MESSAGING,
          person: {
            name: "Gabay",
            icon: "https://cdn-icons-png.flaticon.com/512/295/295128.png",
          },
          messages: [
            {
              text: body,
              timestamp: Date.now(),
              person: { name: "Rogationist College Guidance" },
            },
          ],
        },
      },
      data,
    });
  };

  const setupFCMHandlers = () => {
    console.log("🔔 Setting up FCM handlers...");

    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        console.log("📱 Foreground FCM received:", remoteMessage);

        const title =
          remoteMessage.notification?.title ||
          remoteMessage.data?.title ||
          " New Notification";

        const body =
          remoteMessage.notification?.body ||
          remoteMessage.data?.body ||
          "You have a new message";

        await showNotification(title, body, remoteMessage.data);
      }
    );

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("📂 Notification opened app:", remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("🚀 App launched from notification:", remoteMessage);
        }
      });

    const unsubscribeTokenRefresh = messaging().onTokenRefresh((newToken) => {
      console.log("🔄 Token refreshed:", newToken);
      setFcmToken(newToken);
      setTokenStatus("Refreshed");
    });

    return () => {
      if (unsubscribeForeground) unsubscribeForeground();
      if (unsubscribeTokenRefresh) unsubscribeTokenRefresh();
    };
  };

  useEffect(() => {
    const unsubscribe = setupFCMHandlers();
    const timer = setTimeout(() => {
      getFCMToken();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, []);


   const handleUsernameChange = (text) => {
    setUsername(text);
    if (error) setError('');
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (error) setError('');
  };


  const handleLogin = async () => {
    
    if (!username.trim() || !password.trim()) {
       setError("Username and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || `Authentication failed (${response.status})`);
      }
      const jwtToken = response.headers.get("Jwt-Token");
      const loginData = await response.json();
      const userId = loginData.userId;

      if (jwtToken) {
      AsyncStorage.setItem("jwtToken", jwtToken);

      }else{
        Alert.alert("No Token Jwt Found");
      }

      if (!userId) {
        throw new Error("No user ID received from server");
      }

      console.log("Login successful. User ID:", userId);

      if (fcmToken) {
        registerFCMToken(userId, fcmToken);
      } else {
        console.log(" No FCM token available - no notifications");
      }

      Alert.alert("Login Successful", "Welcome to GABAY!");

      // navigation.navigate('Dashboard');
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert(
        "Login Failed",
        error.message || "Login failed. Please try again."
      );
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
          style={[LoginStyles.textField]}
          value={username}
          onChangeText={handleUsernameChange}
          onFocus={() => setFocusedField("username")}
          onBlur={() => setFocusedField(null)}
          placeholder="Enter your username"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={LoginStyles.label}>Password</Text>
        <TextInput
          style={[
            LoginStyles.textField,
            focusedField === "password" && LoginStyles.textFieldFocused,
          ]}
          value={password}
          onChangeText={handlePasswordChange}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
          placeholder="Enter your password"
          placeholderTextColor="#9ca3af"
          secureTextEntry={true}
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
        <View style={LoginStyles.signupContainer}>
          <Pressable onPress={() => setIsModalOpen(true)}>
            <Text style={LoginStyles.signupLink}>Forget password?</Text>
          </Pressable>
          <ForgetPasswordModal visible={isModalOpen} onClose={() => setIsModalOpen(false)}/>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
