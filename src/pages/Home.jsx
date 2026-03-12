import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa6";

const Home = () => {
  return (
    <div>
      {/* section1 */}
        <div className='relative mx-auto flex flex-col w-11/12 items-center justify-between text-white '>
            <Link to={'/signup'}>
                <div className='group rounded-full bg-richblack-800 mt-16 p-1 mx-auto w-fit text-richblack-200 font-bold drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95'>
                    <div className='flex items-center rounded-full gap-2 px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an instructor</p>
                        <FaArrowRight/>

                    </div>
                </div>
            </Link>
        </div>
      {/* seciotn2 */}

      {/* section3 */}

      {/* section4 */}
    </div>
  )
}

export default Home
