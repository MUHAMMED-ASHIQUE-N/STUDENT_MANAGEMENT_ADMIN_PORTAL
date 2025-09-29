import  { type JSX } from 'react'
import {  Spinner, useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';


interface ProtectedRouteProps {
    children: JSX.Element;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <p><Spinner/> </p>

    if (!user || user.role !== "admin") {
        return <Navigate to= "/institution/login"/>
    }
    return children;
};

export default ProtectedRoute;