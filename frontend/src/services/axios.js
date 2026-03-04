import axios from "axios";
import { store } from "../app/store";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});


api.interceptors.request.use((config) => {
  const stateToken = store.getState().auth.token;
  const storageToken = localStorage.getItem("token");

  const token = stateToken || storageToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default api;
