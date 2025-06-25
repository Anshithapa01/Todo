import axios from "axios";
import { API_BASE_URL } from "../Config/ApiConfig";

// Signup API Call
const signup = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
  return response.data; // Returns JWT token and message
};

// Signin API Call
const signin = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, loginData, {
      withCredentials: true,  // Ensures cookies and credentials are sent
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // JWT token and message
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const editProfile = async (updatedProfile, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/profile`,
      updatedProfile,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Returns updated user data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};



// Fetch Profile API Call
const fetchProfile = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  return response.data;
};

export { signup, signin, fetchProfile };
