import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({ children, role = "buyer" }) => {

    const user = useSelector(state => state.auth.user)
    
   

    const loading = useSelector(state => state.auth.loading)



    if (loading) {
        return <div>Loading...</div>
    }

            if (!user) {
                return <Navigate to="/login" />
            }

//   console.log("User:", user);
// console.log("User Role:", user?.role);
// console.log("Required Role:", role);

if (user.role !== role) {
//   console.log("Redirecting...");
  return <Navigate to="/" />;
}

    return children

}

export default Protected