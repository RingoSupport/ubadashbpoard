import { useState } from "react";

export function useAuth() {
	const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

	const login = (token) => {
		localStorage.setItem("token", token);
		setLoggedIn(true);
	};

	const logout = () => {
		localStorage.clear();
		setLoggedIn(false);
	};

	return { loggedIn, login, logout };
}
