import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { settingsEndpoints } from "../apis";
import {setUser} from '../../slices/profileSlice'

const { UPDATE_DISPLAY_PICTURE_API,UPDATE_PROFILE_API,CHANGE_PASSWORD_API } = settingsEndpoints;

export const updateDisplayPicture = (token, formData) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
            "Content-Type":"multipart/form-data",
           Authorization: `Bearer ${token}`,
        }
        
      );
      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        response
      )
      
      dispatch(setUser(response.data.data));
      localStorage.setItem("user", JSON.stringify(response.data.data));
      toast.success("Display Picture Updated Successfully")

    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error);
      toast.error("Could Not Update Display Picture, Please Logout to update Porfile picture");
    }
    toast.dismiss(toastId);
  };
};

export const updateProfile = (token,formData)=>{
  return async(dispatch)=>{
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("PUT",UPDATE_PROFILE_API,formData,{
        Authorization: `Bearer ${token}`,
      })

      console.log("UPDATE_PROFILE_API API RESPONSE............", response)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
      dispatch(
        setUser({ ...response.data.data, image: userImage })
      )
      localStorage.setItem("user", JSON.stringify(response.data.data));
      toast.success("Profile Updated Successfully")
      
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)

  }
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.msg)
    }
    toast.success("Password Changed Successfully")
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error)
    toast.error(error.response.data.msg)
  }
  toast.dismiss(toastId)
}
