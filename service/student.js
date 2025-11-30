import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, UPDATE_STUDENT_PROFILE } from "../constants/api";


export async function updateStudentProfile(id, profileData) {
  try {
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    
    if (!jwtToken) {
      throw new Error("No JWT Token Found. Please log in again.");
    }
    const requestBody = {};
    if (profileData.email?.trim()) {
      requestBody.email = profileData.email.trim();
    }
    if (profileData.contactNumber?.trim()) {
      requestBody.contactNumber = profileData.contactNumber.trim();
    }
    if (profileData.address?.trim()) {
      requestBody.address = profileData.address.trim();
    }

    console.log("Request Body:", requestBody);
    
    const url = `${API_BASE_URL}/student/${id}/profile`;
    console.log("Full URL:", url);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify(requestBody)
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error Response:", errorText);
      throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
    }

    const updatedStudent = await response.json();
    console.log("Update successful!");
    return updatedStudent;

  } catch (error) {
    throw error;
  }
}