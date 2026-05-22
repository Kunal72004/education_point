import toast from "react-hot-toast";
import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis";

const { GET_USER_ENROLLED_COURSES_API,GET_INSTRUCTOR_DATA_API } = profileEndpoints;

export function getUserEnrolledCourses(token) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    let result = [];
    try {
      // console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
      const response = await apiConnector(
        "GET",
        GET_USER_ENROLLED_COURSES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        },
      );
      // console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");
      console.log(
        "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
        response,
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      result = response.data.data;
      // console.log("result : ",result);
    } catch (error) {
      console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
      toast.error("Could Not Get Enrolled Courses");
    }
    toast.dismiss(toastId);
    return result;
  };
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, 
    {
      Authorization: `Bearer ${token}`,
    })

    console.log("GET_INSTRUCTOR_API_RESPONSE", response);
    result = response?.data?.courses
  } catch (error) {
     console.log("GET_INSTRUCTOR_API ERROR", error);
    toast.error("Could not Get Instructor Data")
  }
  toast.dismiss(toastId);
  return result;
}
