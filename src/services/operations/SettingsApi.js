import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { settingsEndpoints } from "../apis";
import {setUser} from '../../slices/profileSlice'

const { UPDATE_DISPLAY_PICTURE_API } = settingsEndpoints;

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
