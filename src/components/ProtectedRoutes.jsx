import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import storage from '../storage/storage';

const ProtectedRoutes = ({ children }) => {
    const id_persona = storage.get("id_persona");

    if (!id_persona) {
        return <Navigate to='/login' />;  
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoutes;
