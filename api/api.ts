import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api"; // Ajusta el puerto si tu backend usa otro

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};


export const getDataForDashboard = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/metrics`, {
    withCredentials: true,
  });
  return response.data;
}


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