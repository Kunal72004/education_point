import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apis";
const { COURSE_DETAILS_API, COURSE_CATEGORIES_API, EDIT_COURSE_API ,CREATE_COURSE_API} =
  courseEndpoints;

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });
    console.log("COURSE_DETAILS_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.msg);
    }

    result = response.data;
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error);
    result = error.response.data;
    toast.error(error.response.data.msg);
  }
  toast.dismiss(toastId);
  return result;
};

// fetching the available course categories
export const fetchCourseCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    console.log("COURSE_CATEGORIES_API API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.allCategory;
  } catch (error) {
    console.log("COURSE_CATEGORY_API API ERROR............", error);
    toast.error(error.msg);
  }
  return result;
};

export const addCourseDetails = async (data,token)=>{
  let result = null;
  const toastId = toast.loading("Loading...")
  try {
    let response = await apiConnector("POST",CREATE_COURSE_API,data,{
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details")
    }
    toast.success("Course Details Added Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE COURSE API ERROR............", error.msg)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const editCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("EDIT COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }
    toast.success("Course Details Updated Successfully")
    result = response?.data?.data;
  } catch (error) {
    console.log("EDIT COURSE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};


export const createSection = async (data,token)=>{
  let result = null;
  const toastId = toast.loading("Loading...")
  
  try {
    
  } catch (error) {
    console.log("CREATE SECTION API ERROR............", error)
    toast.error(error.msg)
  }
  toast.dismiss(toastId)
  return result
}