    import React from 'react'
    import { useSelector } from 'react-redux'
    import { Navigate } from 'react-router-dom'

    const Protected = ({ children, role = "buyer" }) => {

        const user = useSelector(state => state.auth.user)
        
    

        const loading = useSelector(state => state.auth.loading)



        // if (loading) {
        //     return <div>Loading...</div>
        // }

        if (loading) {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center gap-4"
            style={{ backgroundColor: '#fbf9f6' }}
        >
            <div className="relative w-14 h-14">
                <div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: '#e8e5e1' }}
                />
                <div
                    className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: '#C9A96E', borderTopColor: 'transparent' }}
                />
            </div>
            <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: '#7A6E63', fontFamily: "'Inter', sans-serif" }}
            >
                Loading
            </p>
        </div>
    )
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