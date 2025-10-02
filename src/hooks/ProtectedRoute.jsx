import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
	const { loggedIn } = useAuth();

	if (!loggedIn) {
		// Redirect unauthenticated users to login
		return <Navigate to='/login' replace />;
	}

	return children;
};
