import api from "../../services/axios";

export const registerAPI = (data) => {
  return api.post("/auth/register", data);
};

export const loginAPI = (data) => {
  return api.post("/auth/login", data);
};

export const verifyTokenAPI = () => {
  return api.get("/auth/verify-Email");
};
export const forgetpasswordAPI = (data) => {
  return api.post("/auth/forgot-Password", data)
};

export const resetPasswordAPI = () => {
  return api.post("/auth/reset-Password");
};

