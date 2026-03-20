import React from 'react'
import { Link, useLocation, } from 'react-router-dom'
import logo from '../../assets/Logo/Logo-Full-Light.png'
const Navbar = () => {
    const location = useLocation();
  return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== '/' ? 'bg-richblack-800' : ""
    } transition-all duration-200`}>
      <div className='flex w-10/12 max-w-maxContent justify-between items-center'>
        {/* logo */}
        <Link to="/">
            <img src={logo} alt="" />
        </Link>

        {/* Navigation links */}
        <nav className='md:block hidden'>
            <ul className='flex gap-x-6 text-richblack-25'>

            </ul>
        </nav>
      </div>
    </div>
  )
}

export default Navbar
