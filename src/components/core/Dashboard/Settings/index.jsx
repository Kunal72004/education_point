import React from "react";
import ChangeProfilePicture from "./ChangeProfilePicture";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";
import DeleteAccount from "./DeleteAccount";

const Settings = () => {
  return (
    <div className="w-full">
      {/* Heading */}
      <h1 className="mb-8 text-2xl font-medium text-richblack-5 md:mb-14 md:text-3xl">
        Edit Profile
      </h1>

      {/* Sections */}
      <div className="flex flex-col gap-6 md:gap-8">
        <ChangeProfilePicture />

        <EditProfile />

        <UpdatePassword />

        <DeleteAccount />
      </div>
    </div>
  );
};

export default Settings;