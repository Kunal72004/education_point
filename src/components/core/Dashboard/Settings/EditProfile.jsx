import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../common/IconBtn";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../../services/operations/SettingsApi";

const EditProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const genders = [
    "Male",
    "Female",
    "Non-Binary",
    "Prefer not to say",
    "Other",
  ];

  const submitProfileForm = (data) => {
    try {
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      {/* Profile Information */}
      <div className="my-6 sm:my-10 flex flex-col gap-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-4 sm:p-6 lg:p-8">
        <h2 className="text-lg font-medium text-richblack-5">
          Profile Information
        </h2>

        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="firstName" className="lable-style">
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter first name"
              className="form-style"
              {...register("firstName", { required: true })}
              defaultValue={user?.firstName}
            />

            {errors.firstName && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your first name.
              </span>
            )}
          </div>

          <div className="flex w-full flex-col gap-2">
            <label htmlFor="lastName" className="lable-style">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter last name"
              className="form-style"
              {...register("lastName", { required: true })}
              defaultValue={user?.lastName}
            />

            {errors.lastName && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your last name.
              </span>
            )}
          </div>
        </div>

        {/* DOB & Gender */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="dateOfBirth" className="lable-style">
              Date of Birth
            </label>

            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              className="form-style"
              {...register("dateOfBirth", {
                required: {
                  value: true,
                  message: "Please enter your Date of Birth.",
                },
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of Birth cannot be in the future.",
                },
              })}
              defaultValue={user?.additionalDetails?.dateOfBirth}
            />

            {errors.dateOfBirth && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.dateOfBirth.message}
              </span>
            )}
          </div>

          <div className="flex w-full flex-col gap-2">
            <label htmlFor="gender" className="lable-style">
              Gender
            </label>

            <select
              name="gender"
              id="gender"
              className="form-style"
              {...register("gender", { required: true })}
              defaultValue={user?.additionalDetails?.gender}
            >
              {genders.map((gender, index) => (
                <option key={index} value={gender}>
                  {gender}
                </option>
              ))}
            </select>

            {errors.gender && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please select your gender.
              </span>
            )}
          </div>
        </div>

        {/* Contact Number & About */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="contactNumber" className="lable-style">
              Contact Number
            </label>

            <input
              type="tel"
              name="contactNumber"
              id="contactNumber"
              placeholder="Enter Contact Number"
              className="form-style"
              {...register("contactNumber", {
                required: {
                  value: true,
                  message: "Please enter your Contact Number.",
                },
                maxLength: {
                  value: 12,
                  message: "Invalid Contact Number",
                },
                minLength: {
                  value: 10,
                  message: "Invalid Contact Number",
                },
              })}
              defaultValue={user?.additionalDetails?.contactNumber}
            />

            {errors.contactNumber && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.contactNumber.message}
              </span>
            )}
          </div>

          <div className="flex w-full flex-col gap-2">
            <label htmlFor="about" className="lable-style">
              About
            </label>

            <input
              type="text"
              name="about"
              id="about"
              placeholder="Enter Bio Details"
              className="form-style"
              {...register("about", { required: true })}
              defaultValue={user?.additionalDetails?.about}
            />

            {errors.about && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your About.
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
          <IconBtn type="submit" text="Save" />
        </div>
      </div>
    </form>
  );
};

export default EditProfile;