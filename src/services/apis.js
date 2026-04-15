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


// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}


//Setting page api
export const settingsEndpoints ={
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}