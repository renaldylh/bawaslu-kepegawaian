import { cookieHelper } from "./cookieHelper";

export const debugToken = () => {
  const token = cookieHelper.getAccessToken();
  console.log("🔍 Debug Token Info:");
  console.log("Token exists:", !!token);
  console.log("Token value:", token);
  console.log("Is authenticated:", cookieHelper.isAuthenticated());

  if (token) {
    try {
      // Decode JWT payload (tanpa verifikasi)
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Token payload:", payload);
      console.log("Token expires:", new Date(payload.exp * 1000));
      console.log("Is token expired:", Date.now() >= payload.exp * 1000);
    } catch (error) {
      console.log("Error decoding token:", error);
    }
  }

  return token;
};
