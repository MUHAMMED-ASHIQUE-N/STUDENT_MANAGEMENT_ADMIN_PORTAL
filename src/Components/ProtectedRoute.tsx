import React, { useContext, type JSX } from 'react'
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';


interface ProtectedRouteProps {
    children: JSX.Element;
    requiredRole: "admin" | "student";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const authContex = useContext(AuthContext);
    if (!authContex) return null;

    const { user, loading } = authContex;

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