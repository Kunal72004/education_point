import React from 'react'
import { useSelector } from 'react-redux'

const NestedView = () => {
    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)
  return (
    <>
      <div className="rounded-lg bg-richblack-700 p-6 px-8 text-white"
        id="nestedViewContainer">
            
      </div>
    </>
  )
}

export default NestedView
