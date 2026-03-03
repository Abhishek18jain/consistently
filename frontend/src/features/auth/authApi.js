import api from "../../services/axios";

export const registerAPI = (data) => {
  return api.post("/auth/signup", data);
};

export const loginAPI = (data) => {
  return api.post("/auth/login", data);
};

export const verifyEmailAPI = (data) => {
  return api.post("/auth/verify-Email/:userId",data);
};
export const forgetpasswordAPI = (data) => {
  return api.post("/auth/forgot-Password", data)
};

export const resetPasswordAPI = () => {
  return api.post("/auth/reset-Password");
};

