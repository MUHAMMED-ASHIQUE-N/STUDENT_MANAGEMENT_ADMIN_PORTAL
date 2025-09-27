import  { type JSX } from 'react'
import {  Spinner, useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';


interface ProtectedRouteProps {
    children: JSX.Element;
    requiredRole: "admin" | "student";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
 

    const { user, loading } = useAuth();

    if (loading) return <Spinner/>

    if (!user) {
        return <Navigate to={requiredRole === "admin" ? "/institution/login" : "/student/login"} />
    }
    
    
    if (requiredRole && user?.role !== requiredRole) {
            return <Navigate to={user?.role === "admin" ? "/institution/dashboard" : "/student/dashboard"} />;
        }


    
    return children;
};

export default ProtectedRoute;





// import  { type JSX } from 'react'
// import {  useAuth } from '../context/AuthContext';
// import { Navigate } from 'react-router-dom';


// interface ProtectedRouteProps {
//     children: JSX.Element;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {


//     const { user, loading } = useAuth();

//     if (loading) return <p>Loading... </p>

//     if (!user || user.role !== "admin") {
//         return <Navigate to= "/institution/login"/>
//     }

//     return children;
// };

// export default ProtectedRoute;