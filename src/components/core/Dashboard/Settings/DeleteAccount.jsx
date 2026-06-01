import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProfile } from "../../../../services/operations/SettingsApi";

const DeleteAccount = () => {
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteProfile(token, navigate));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <div className="my-6 sm:my-10 flex flex-col sm:flex-row gap-5 rounded-md border border-pink-700 bg-pink-900 p-4 sm:p-6 lg:p-8">
      {/* Icon */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink-700">
        <FiTrash2 className="text-3xl text-pink-200" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-richblack-5">
          Delete Account
        </h2>

        <div className="w-full text-sm sm:text-base text-pink-25">
          <p>Would you like to delete account?</p>

          <p className="mt-1">
            This account may contain paid courses. Deleting your account is
            permanent and will remove all content associated with it.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDeleteAccount}
          className="mt-2 w-fit italic text-pink-300 transition-all hover:text-pink-200"
        >
          I want to delete my account.
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;