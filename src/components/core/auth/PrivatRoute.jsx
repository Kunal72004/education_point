import React from 'react'

const PrivatRoute = () => {
  const {token} = useSelector((state) => state.auth);

    if(token !== null)
        return children
    else
        return <Navigate to="/login" />

  
}

export default PrivatRoute
