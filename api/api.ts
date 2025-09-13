// Obtener usuario autenticado (cookie httpOnly)
export const getMe = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Logout (elimina cookie en backend)
export const logout = async () => {
  try {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api"; // Ajusta el puerto si tu backend usa otro

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
