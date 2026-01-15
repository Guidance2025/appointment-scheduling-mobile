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
      let errorMessage = "Authentication failed";
      let errorData = null;
      
      try {
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
          console.log("📦 Error data received:", errorData);
          
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.reason) {
            errorMessage = errorData.reason;
          }
          
        } else {
          const textError = await response.text();
          console.log(" Text error received:", textError);
          
          try {
            errorData = JSON.parse(textError);
            errorMessage = errorData.message || errorData.error || errorData.reason || textError;
          } catch {
            errorMessage = textError || `Authentication failed (${response.status})`;
          }
        }
      } catch (parseError) {
        console.error(" Error parsing response:", parseError);
        errorMessage = `Authentication failed (${response.status})`;
      }
      

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      
      console.log(" Throwing error:", {
        message: errorMessage,
        status: response.status
      });
      
      throw error;
    }

    const jwtToken = response.headers.get("Jwt-Token");
    const loginData = await response.json();
    const userId = loginData.userId;
    const studentId = loginData.studentId;

    if (jwtToken) {
      await AsyncStorage.setItem("jwtToken", jwtToken);
      console.log(" JWT token stored");
    } else {
      console.warn(" No JWT token received");
    }

    if (!userId) {
      throw new Error("No user ID received from server");
    }

    await AsyncStorage.setItem("userId", String(userId));
    console.log(" User ID stored:", userId);
    
    if (studentId) {
      await AsyncStorage.setItem("studentId", String(studentId));
      console.log(" Student ID stored:", studentId);
    }

    return { success: true, userId, studentId };  

  } catch (error) {
    throw error;
  }
}