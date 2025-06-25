import axios from "axios";
import { API_BASE_URL } from "../Config/ApiConfig";
 

export const exportToGist = async (projectId, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/gist/export/${projectId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // Returns gist details (gistId, gistUrl)
  } catch (error) {
    console.error("Error exporting project to Gist:", error);
    throw error;
  }
};

export const getAllGists = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/gist`, {
      headers: { Authorization: `Bearer ${token}` }, // Pass token if required
    });
    return response.data; // Returns a list of ExportedGistResponse objects
  } catch (error) {
    console.error("Failed to fetch gists:", error);
    return [];
  }
};

