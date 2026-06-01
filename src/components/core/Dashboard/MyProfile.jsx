import React from "react";
import { useSelector } from "react-redux";
import IconBtn from "../../common/IconBtn";
import { useNavigate } from "react-router-dom";
import { RiEditBoxLine } from "react-icons/ri";
import { formattedDate } from "../../../utils/dateFormatter";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Heading */}
      <h1 className="mb-8 text-2xl font-medium text-richblack-5 md:mb-14 md:text-3xl">
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="flex flex-col gap-6 rounded-md border border-richblack-700 bg-richblack-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 md:p-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="h-[78px] w-[78px] rounded-full object-cover"
          />

          <div className="space-y-1">
            <p className="text-lg font-semibold text-richblack-5">
              {user?.firstName} {user?.lastName}
            </p>

            <p className="break-all text-sm text-richblack-300">
              {user?.email}
            </p>
          </div>
        </div>

        <IconBtn
          text="Edit"
          onclick={() => navigate("/dashboard/settings")}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* About Section */}
      <div className="my-8 flex flex-col gap-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-4 sm:p-6 md:my-10 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-semibold text-richblack-5">About</p>

          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <p
          className={`text-sm font-medium ${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          }`}
        >
          {user?.additionalDetails?.about ??
            "Write Something About Yourself"}
        </p>
      </div>

      {/* Personal Details */}
      <div className="my-8 flex flex-col gap-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-4 sm:p-6 md:my-10 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>

          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
          {/* Left Column */}
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">
                First Name
              </p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">
                Email
              </p>
              <p className="break-all text-sm font-medium text-richblack-5">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">
                Gender
              </p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">
                Last Name
              </p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">
                Phone Number
              </p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ??
                  "Add Contact Number"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">
                Date Of Birth
              </p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.dateOfBirth
                  ? formattedDate(
                      user?.additionalDetails?.dateOfBirth
                    )
                  : "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;