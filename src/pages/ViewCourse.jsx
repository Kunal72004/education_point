import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";

import CourseReviewModel from "../components/core/Dashboard/ViewCourse/CourseReviewModel";
import VideoDetailsSidebar from "../components/core/Dashboard/ViewCourse/VideoDetailsSidebar";

import { getFullDetailsOfCourse } from "../services/operations/courseDetailsApi";

import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";

const ViewCourse = () => {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [reviewModal, setReviewModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    (async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);

      dispatch(
        setCourseSectionData(courseData?.courseDetails?.courseContent || []),
      );

      dispatch(setEntireCourseData(courseData?.courseDetails));

      dispatch(setCompletedLectures(courseData?.completedVideos || []));

      let lectures = 0;

      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length;
      });

      dispatch(setTotalNoOfLectures(lectures));
    })();
  }, [courseId, token, dispatch]);

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        {/* Mobile Hamburger */}
        {!openSidebar && !reviewModal && (
          <button
            onClick={() => setOpenSidebar(true)}
            className="fixed left-4 top-20 z-[1001] rounded-md bg-richblack-800 p-2 text-white lg:hidden"
          >
            <AiOutlineMenu className="text-2xl" />
          </button>
        )}

        {/* Overlay */}
        {openSidebar && (
          <div
            className="fixed inset-0 z-[999] bg-black/50 lg:hidden"
            onClick={() => setOpenSidebar(false)}
          />
        )}

        {/* Sidebar */}
        <VideoDetailsSidebar
          setReviewModal={setReviewModal}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />

        {/* Main Content */}
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-3 mt-16 lg:mx-6 lg:mt-0">
            <Outlet />
          </div>
        </div>
      </div>

      {reviewModal && <CourseReviewModel setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;
