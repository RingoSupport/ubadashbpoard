import React, { createContext, useContext, useState, useEffect } from "react";

const SessionTimeoutContext = createContext();

export function SessionTimeoutProvider({ children }) {
	const [userIsActive, setUserIsActive] = useState(true);
	let logoutTimer;

	const resetLogoutTimer = () => {
		clearTimeout(logoutTimer);
		logoutTimer = setTimeout(logout, 600000); // 1 hour in milliseconds
	};

	const logout = () => {
		localStorage.removeItem("token");
		console.log("User logged out due to inactivity.");
	};

	useEffect(() => {
		resetLogoutTimer();
		window.addEventListener("mousemove", resetLogoutTimer);
		window.addEventListener("keydown", resetLogoutTimer);

		return () => {
			clearTimeout(logoutTimer);
			window.removeEventListener("mousemove", resetLogoutTimer);
			window.removeEventListener("keydown", resetLogoutTimer);
		};
	}, []);

	const contextValue = {
		userIsActive,
		setUserIsActive,
	};

	return (
		<SessionTimeoutContext.Provider value={contextValue}>
			{children}
		</SessionTimeoutContext.Provider>
	);
}

export function useSessionTimeout() {
	return useContext(SessionTimeoutContext);
}
