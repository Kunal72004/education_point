import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/navigation"

import { FaStar } from "react-icons/fa"
import { Swiper, SwiperSlide } from "swiper/react"
import {
  Autoplay,
  FreeMode,
  Navigation,
  Pagination,
} from "swiper/modules"

import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )

        console.log("Review API Response:", data)

        if (data?.success) {
          setReviews(data?.data)
        }
      } catch (error) {
        console.log("REVIEW API ERROR:", error)
      }
    })()
  }, [])

  return (
    <div className="w-full text-white">
      <div className="mx-auto my-12 max-w-maxContent px-4">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation={true}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          modules={[FreeMode, Pagination, Autoplay, Navigation]}
          className="w-full py-6"
        >
          {reviews.map((review, i) => {
            return (
              <SwiperSlide key={i} className="h-auto">
                <div className="flex h-full min-h-[250px] flex-col justify-between rounded-2xl border border-richblack-700 bg-richblack-800 p-5 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-richblack-500">
                  
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt="profile"
                      className="h-12 w-12 rounded-full border border-richblack-600 object-cover"
                    />

                    <div>
                      <h2 className="text-lg font-semibold text-richblack-5">
                        {review?.user?.firstName}{" "}
                        {review?.user?.lastName}
                      </h2>

                      <p className="text-sm text-richblack-300">
                        {review?.course?.courseName}
                      </p>
                    </div>
                  </div>

                  {/* Review */}
                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-richblack-25">
                    {review?.review?.split(" ").length > truncateWords
                      ? `${review?.review
                          ?.split(" ")
                          ?.slice(0, truncateWords)
                          ?.join(" ")}...`
                      : review?.review}
                  </p>

                  {/* Rating */}
                  <div className="mt-6 flex items-center gap-3">
                    <p className="text-lg font-bold text-yellow-100">
                      {review?.rating?.toFixed(1)}
                    </p>

                    <ReactStars
                      count={5}
                      value={review?.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider