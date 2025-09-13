import React, { useContext, type JSX } from 'react'
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';


interface ProtectedRouteProps {
    children: JSX.Element;
    requiredRole: "admin" | "student";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const authContext = useContext(AuthContext);
    if (!authContext) return null;

    const { user, loading } = authContext;

    if (loading) return <p>Loading... </p>

    if (!user) {
        return <Navigate to={requiredRole === "admin" ? "/institution/login" : "/student/login"} />
    }


    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to={user.role === "admin" ? "/institution/dashboard" : "/student/dashboard"} />;
    }
    return children;
};

export default ProtectedRoute;