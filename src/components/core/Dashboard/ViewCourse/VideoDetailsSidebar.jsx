import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { BsChevronDown } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import IconBtn from "../../../common/IconBtn";

const VideoDetailsSidebar = ({
  setReviewModal,
  openSidebar,
  setOpenSidebar,
}) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const { sectionId, subSectionId } = useParams();

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    if (!courseSectionData?.length) return;

    const currentSectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    );

    const currentSubSectionIndex =
      courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
        (subSection) => subSection._id === subSectionId
      );

    const activeSubSectionId =
      courseSectionData?.[currentSectionIndex]?.subSection?.[
        currentSubSectionIndex
      ]?._id;

    setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
    setVideoBarActive(activeSubSectionId);
  }, [courseSectionData, sectionId, subSectionId, location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
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
          h-screen w-[280px] sm:w-[320px]
          border-r border-richblack-700
          bg-richblack-800
          transition-all duration-300
          ${
            openSidebar
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setOpenSidebar(false)}
          className="absolute right-4 top-4 text-white lg:hidden"
        >
          <RxCross2 className="text-2xl" />
        </button>

        {/* Header */}
        <div className="mx-4 mt-12 lg:mt-0 flex flex-col gap-y-4 border-b border-richblack-600 py-5 text-richblack-25">
          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate("/dashboard/enrolled-courses")}
              className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full bg-richblack-100 text-richblack-700 transition-all hover:scale-90"
            >
              <IoIosArrowBack size={24} />
            </div>

            <IconBtn
              text="Add Review"
              customClasses="ml-auto"
              onclick={() => setReviewModal(true)}
            />
          </div>

          <div>
            <p className="break-words text-base font-bold sm:text-lg">
              {courseEntireData?.courseName}
            </p>

            <p className="text-sm font-medium text-richblack-400">
              {completedLectures?.length} / {totalNoOfLectures} Lectures
            </p>
          </div>
        </div>

        {/* Course Content */}
        <div className="h-[calc(100vh-150px)] overflow-y-auto">
          {courseSectionData?.map((course) => (
            <div
              key={course?._id}
              className="mt-2 text-sm text-richblack-5"
            >
              {/* Section Header */}
              <div
                className="flex cursor-pointer items-center justify-between bg-richblack-700 px-4 py-4"
                onClick={() =>
                  setActiveStatus(
                    activeStatus === course?._id ? "" : course?._id
                  )
                }
              >
                <div className="flex-1 break-words font-semibold">
                  {course?.sectionName}
                </div>

                <span
                  className={`ml-3 transition-all duration-300 ${
                    activeStatus === course?._id
                      ? "rotate-0"
                      : "rotate-180"
                  }`}
                >
                  <BsChevronDown />
                </span>
              </div>

              {/* Sub Sections */}
              {activeStatus === course?._id && (
                <div>
                  {course?.subSection?.map((topic) => (
                    <div
                      key={topic?._id}
                      className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-all
                        ${
                          videoBarActive === topic?._id
                            ? "bg-yellow-200 font-semibold text-richblack-900"
                            : "hover:bg-richblack-900"
                        }`}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                        );

                        setVideoBarActive(topic?._id);

                        if (window.innerWidth < 1024) {
                          setOpenSidebar(false);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures?.includes(topic?._id)}
                        readOnly
                        className="mt-1"
                      />

                      <p className="flex-1 break-words">
                        {topic?.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoDetailsSidebar;