import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const isAuthenticated = !!localStorage.getItem("authToken"); // Check for an auth token

    if (!isAuthenticated) {
        return <Navigate to="/go-admin/login" replace />; // Use absolute path for better compatibility
    }
    return children;
}