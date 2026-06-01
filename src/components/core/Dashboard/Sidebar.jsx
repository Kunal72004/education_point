import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { sidebarLinks } from "../../../data/dashboard-links"
import SidebarLinks from "./SidebarLinks"
import { VscSignOut, VscMenu } from "react-icons/vsc"
import { RxCross2 } from "react-icons/rx"
import { logout } from "../../../services/operations/authApi"
import ConfirmModal from "../../common/ConfirmModal"
import { useNavigate } from "react-router-dom"

const Sidebar = () => {
  const { loading: authLoading } = useSelector((state) => state.auth)
  const navigate = useNavigate();

  const { loading: profileLoading, user } = useSelector(
    (state) => state.profile
  )

  const dispatch = useDispatch()

  const [confirmationModal, setConfirmationModal] = useState(null)

  const [openSidebar, setOpenSidebar] = useState(false)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpenSidebar(true)}
        className="absolute right-4 top-4 z-[1000] rounded-md bg-richblack-800 p-2 text-white lg:hidden"
      >
        <VscMenu className="text-2xl" />
      </button>

      {/* Overlay */}
      {openSidebar && (
        <div
          className="fixed inset-0 z-[999] bg-black/50 lg:hidden"
          onClick={() => setOpenSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static
          left-0 top-0 z-[1000]
          flex h-screen w-[250px]
          flex-col border-r border-richblack-700
          bg-richblack-800 py-10
          transition-all duration-300

          ${
            openSidebar
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Close Button Mobile */}
        <button
          onClick={() => setOpenSidebar(false)}
          className="absolute right-4 top-4 text-white lg:hidden"
        >
          <RxCross2 className="text-2xl" />
        </button>

        {/* Links */}
        <div className="mt-8 flex flex-col">
          {sidebarLinks.map((link) => {
            if (link?.type && user?.accountType !== link?.type)
              return null

            return (
              <SidebarLinks
                key={link?.id}
                link={link}
                iconName={link?.icon}
              />
            )
          })}
        </div>

        {/* Divider */}
        <div className="mx-auto my-6 h-[1px] w-10/12 bg-richblack-700" />

        {/* Bottom Links */}
        <div className="flex flex-col">
          <SidebarLinks
            link={{
              name: "Settings",
              path: "/dashboard/settings",
            }}
            iconName="VscSettingsGear"
          />

          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-left text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>

      {/* Modal */}
      {confirmationModal && (
        <ConfirmModal modalData={confirmationModal} />
      )}
    </>
  )
}

export default Sidebar