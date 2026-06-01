import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BigPlayButton, Player } from "video-react";
import "video-react/dist/video-react.css";

import IconBtn from "../../../common/IconBtn";

import { markLectureAsComplete } from "../../../../services/operations/courseDetailsApi";
import { updateCompletedLectures } from "../../../../slices/viewCourseSlice";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const playerRef = useRef(null);

  const { token } = useSelector((state) => state.auth);

  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseSectionData?.length) return;

    if (!courseId || !sectionId || !subSectionId) {
      navigate("/dashboard/enrolled-courses");
      return;
    }

    const filteredSection = courseSectionData.find(
      (section) => section._id === sectionId
    );

    const filteredVideo = filteredSection?.subSection?.find(
      (video) => video._id === subSectionId
    );

    setVideoData(filteredVideo);
    setPreviewSource(courseEntireData?.thumbnail);
    setVideoEnded(false);
  }, [
    courseSectionData,
    courseEntireData,
    location.pathname,
    courseId,
    sectionId,
    subSectionId,
    navigate,
  ]);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndex =
      courseSectionData[currentSectionIndex]?.subSection.findIndex(
        (data) => data._id === subSectionId
      );

    return currentSectionIndex === 0 && currentSubSectionIndex === 0;
  };

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const noOfSubSections =
      courseSectionData[currentSectionIndex]?.subSection.length;

    const currentSubSectionIndex =
      courseSectionData[currentSectionIndex]?.subSection.findIndex(
        (data) => data._id === subSectionId
      );

    return (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubSections - 1
    );
  };

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndex =
      courseSectionData[currentSectionIndex]?.subSection.findIndex(
        (data) => data._id === subSectionId
      );

    const totalSubSections =
      courseSectionData[currentSectionIndex]?.subSection.length;

    if (currentSubSectionIndex !== totalSubSections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndex]?.subSection[
          currentSubSectionIndex + 1
        ]?._id;

      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else {
      const nextSectionId =
        courseSectionData[currentSectionIndex + 1]?._id;

      const nextSubSectionId =
        courseSectionData[currentSectionIndex + 1]?.subSection[0]?._id;

      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };

  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndex =
      courseSectionData[currentSectionIndex]?.subSection.findIndex(
        (data) => data._id === subSectionId
      );

    if (currentSubSectionIndex !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndex]?.subSection[
          currentSubSectionIndex - 1
        ]?._id;

      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else {
      const prevSectionId =
        courseSectionData[currentSectionIndex - 1]?._id;

      const prevSectionLength =
        courseSectionData[currentSectionIndex - 1]?.subSection.length;

      const prevSubSectionId =
        courseSectionData[currentSectionIndex - 1]?.subSection[
          prevSectionLength - 1
        ]?._id;

      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);

    const res = await markLectureAsComplete(
      {
        courseId,
        subsectionId: subSectionId,
      },
      token
    );

    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }

    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col gap-4 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="w-full max-h-[500px] rounded-lg object-cover"
        />
      ) : (
        <div className="w-full overflow-hidden rounded-lg">
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            src={videoData?.videoUrl}
            onEnded={() => setVideoEnded(true)}
          >
            <BigPlayButton position="center" />

            {videoEnded && (
              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgb(0,0,0), rgba(0,0,0,0.8), rgba(0,0,0,0.5), rgba(0,0,0,0.2))",
                }}
                className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-4 text-center"
              >
                {!completedLectures?.includes(subSectionId) && (
                  <IconBtn
                    disabled={loading}
                    onclick={handleLectureCompletion}
                    text={
                      loading
                        ? "Loading..."
                        : "Mark As Completed"
                    }
                    customClasses="mx-auto max-w-max px-4 text-sm sm:text-lg"
                  />
                )}

                <IconBtn
                  disabled={loading}
                  onclick={() => {
                    if (playerRef?.current) {
                      playerRef.current.seek(0);
                      setVideoEnded(false);
                    }
                  }}
                  text="Rewatch"
                  customClasses="mx-auto mt-3 max-w-max px-4 text-sm sm:text-lg"
                />

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {!isFirstVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToPrevVideo}
                      className="blackButton"
                    >
                      Prev
                    </button>
                  )}

                  {!isLastVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      className="blackButton"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </Player>
        </div>
      )}

      <div className="px-1">
        <h1 className="mt-2 break-words text-xl font-semibold sm:text-2xl lg:text-3xl">
          {videoData?.title}
        </h1>

        <p className="pb-6 pt-3 break-words text-sm text-richblack-100 sm:text-base">
          {videoData?.description}
        </p>
      </div>
    </div>
  );
};

export default VideoDetails;