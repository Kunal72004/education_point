const BASE_URL = "http://localhost:4000/api/v1";

//auth endpoints
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  SIGNUP_API: BASE_URL + "/auth/signup",
};

// categories endpoints
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
};
