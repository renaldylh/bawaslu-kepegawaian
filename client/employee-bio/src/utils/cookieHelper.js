import Cookies from "js-cookie";

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 hari
  secure: process.env.NODE_ENV === "production", // Hanya HTTPS di production
  sameSite: "Strict", // Mencegah CSRF
  path: "/", // Available di seluruh aplikasi
};

export const cookieHelper = {
  // Set access token sebagai cookie
  setAccessToken: (token) => {
    Cookies.set("access_token", token, COOKIE_OPTIONS);
  },

  // Get access token dari cookie
  getAccessToken: () => {
    return Cookies.get("access_token");
  },

  // Remove access token cookie
  removeAccessToken: () => {
    Cookies.remove("access_token", { path: "/" });
  },

  // Check apakah user sudah login (ada token)
  isAuthenticated: () => {
    const token = Cookies.get("access_token");
    return !!token; // Convert ke boolean
  },
};
