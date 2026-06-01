import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import IconBtn from "../../../common/IconBtn";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../../services/operations/SettingsApi";
import { useSelector } from "react-redux";

const UpdatePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitPasswordForm = async (data) => {
    try {
      await changePassword(token, data);
      reset();
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)}>
      <div className="my-6 sm:my-10 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-4 sm:p-6 lg:p-8">
        <h2 className="text-lg font-semibold text-richblack-5">
          Password
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Current Password */}
          <div className="relative flex flex-col gap-2">
            <label htmlFor="oldPassword" className="lable-style">
              Current Password
            </label>

            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter Current Password"
              className="form-style pr-12"
              {...register("oldPassword", { required: true })}
            />

            <span
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-3 top-[42px] cursor-pointer"
            >
              {showOldPassword ? (
                <AiOutlineEyeInvisible
                  fontSize={22}
                  fill="#AFB2BF"
                />
              ) : (
                <AiOutlineEye
                  fontSize={22}
                  fill="#AFB2BF"
                />
              )}
            </span>

            {errors.oldPassword && (
              <span className="text-[12px] text-yellow-100">
                Please enter your Current Password.
              </span>
            )}
          </div>

          {/* New Password */}
          <div className="relative flex flex-col gap-2">
            <label htmlFor="newPassword" className="lable-style">
              New Password
            </label>

            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="Enter New Password"
              className="form-style pr-12"
              {...register("newPassword", { required: true })}
            />

            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-[42px] cursor-pointer"
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible
                  fontSize={22}
                  fill="#AFB2BF"
                />
              ) : (
                <AiOutlineEye
                  fontSize={22}
                  fill="#AFB2BF"
                />
              )}
            </span>

            {errors.newPassword && (
              <span className="text-[12px] text-yellow-100">
                Please enter your New Password.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="w-full rounded-md bg-richblack-700 px-5 py-2 font-semibold text-richblack-50 sm:w-auto"
        >
          Cancel
        </button>

        <div className="w-full sm:w-auto">
          <IconBtn type="submit" text="Update" />
        </div>
      </div>
    </form>
  );
};

export default UpdatePassword;