import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../common/IconBtn";
import { updateDisplayPicture } from "../../../../services/operations/SettingsApi";
import { FiUpload } from "react-icons/fi";

const ChangeProfilePicture = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileUpload = () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("displayPicture", imageFile);

      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false);
      });
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="rounded-md border border-richblack-700 bg-richblack-800 p-4 sm:p-6 md:p-8 text-richblack-5">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
        {/* Profile Image */}
        <img
          src={previewSource || user?.image}
          alt={`profile-${user?.firstName}`}
          className="h-[78px] w-[78px] rounded-full object-cover"
        />

        {/* Content */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-medium">
            Change Profile Picture
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/gif, image/jpeg"
          />

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            <button
              onClick={handleClick}
              disabled={loading}
              className="rounded-md bg-richblack-700 px-5 py-2 font-semibold text-richblack-50 transition-all"
            >
              Select
            </button>

            <IconBtn
              text={loading ? "Uploading..." : "Upload"}
              onclick={handleFileUpload}
            >
              {!loading && (
                <FiUpload className="text-lg text-richblack-900" />
              )}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePicture;