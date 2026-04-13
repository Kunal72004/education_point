import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture';

const Settings = () => {
  return (
    <>
     <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Profile
      </h1>
      {/* Change Profile Picture */}
      <ChangeProfilePicture/>
    </>
  )
}

export default Settings;
