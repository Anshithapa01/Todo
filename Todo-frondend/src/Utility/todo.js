import axios from "axios";
import { API_BASE_URL } from "../Config/ApiConfig";

export const addTodo = async (projectId, todo, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/todos/${projectId}`, todo, {
        headers: { Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",  },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to add todo", error);
      throw error;
    }
  };
  
  export const getTodos = async (projectId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/todos/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch todos", error);
      throw error;
    }
  };
  
  export const updateTodo = async (todoId, updatedTodo, token) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/todos/${todoId}`, updatedTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update todo", error);
      throw error;
    }
  };
  
  export const deleteTodo = async (todoId, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/todos/${todoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Failed to delete todo", error);
      throw error;
    }
  };