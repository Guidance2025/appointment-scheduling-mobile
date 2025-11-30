import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";

export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim()
      }),
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(errMsg || `Authentication failed (${response.status})`);
    }

    const jwtToken = response.headers.get("Jwt-Token");
    const loginData = await response.json();
    const userId = loginData.userId;
    const studentId = loginData.studentId;

    if (jwtToken) {
      await AsyncStorage.setItem("jwtToken", jwtToken);
    } else {
      console.warn("No JWT token received");
    }

    if (!userId) throw new Error("No user ID received from server");

    await AsyncStorage.setItem("userId", String(userId));
    await AsyncStorage.setItem("studentId", String(studentId));

    console.log("Login successful. User ID:", userId);
    return { success: true, userId, studentId };  

    

  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

