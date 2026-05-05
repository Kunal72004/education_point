import React from 'react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {Swiper, SwiperSlide} from 'swiper/react'
import { Autoplay,FreeMode,Navigation, Pagination}  from 'swiper/modules'
import CourseCard from './CourseCard'

const CourseSlider = ({courses}) => {
    console.log(courses);
  return (
    <>
      {courses.length>0 ?(
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <CourseCard course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ):(
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default CourseSlider
