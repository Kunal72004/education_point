import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({children,active,linkTo}) => {
  return (
    <div>
      <Link to={linkTo}>
        <div className={`${active?"bg-yellow-50 text-black " : "bg-richblack-800"} text-center text-[13px] sm:text-[16px] px-6 py-3 rounded-md font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]`}>
            {children}
        </div>
      </Link>
    </div>
  )
}

export default Button
