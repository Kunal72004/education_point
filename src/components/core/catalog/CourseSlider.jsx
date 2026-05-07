import React from 'react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/navigation"

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules'
import CourseCard from './CourseCard'

const CourseSlider = ({ courses = [] }) => {
  if (!courses.length) {
    return <p>No Course Found</p>;
  }

  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={25}
      loop={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      navigation={true}
      freeMode={true}
      modules={[Autoplay, Navigation, Pagination, FreeMode]}
      breakpoints={{
        1024: {
          slidesPerView: 3,
        },
      }}
      className="w-full h-[300px]"
    >
      {courses.map((course, i) => (
        <SwiperSlide key={i} className="flex justify-center">
          <div className="w-full">
            <CourseCard course={course} Height={"h-[250px]"} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CourseSlider;