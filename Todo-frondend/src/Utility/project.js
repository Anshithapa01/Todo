// utils/project.js
import axios from "axios";// Replace with your actual backend URL
import { API_BASE_URL } from "../Config/ApiConfig";

export const createProject = async (title,userId, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/projects`,
      { title, userId},
      { headers: { Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", } }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getUserProjects = async (userId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/projects/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getProjectById = async (projectId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};

export const updateProject = async (projectId, title, token) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/projects/${projectId}`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating project title:", error);
      throw error;
    }
  };
  
export const exportToGist= async ()=>{

}

export const deleteProject = async (projectId, token) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
