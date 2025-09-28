import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [role, setRole] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		try {
			const storedRole = localStorage.getItem("role");
			const storedAuth = localStorage.getItem("isAuthenticated");

			if (storedRole && storedAuth === "true") {
				setRole(storedRole);
				setIsAuthenticated(true);
			}
		} catch (error) {
			console.error("Auth initialization error:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const login = async (email, password, userRole) => {
		try {
			if (email && password) {
				setRole(userRole);
				setIsAuthenticated(true);
				localStorage.setItem("role", userRole);
				localStorage.setItem("isAuthenticated", "true");
				return true;
			}
			return false;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	};

	const logout = () => {
		setRole(null);
		setIsAuthenticated(false);
		localStorage.removeItem("role");
		localStorage.removeItem("isAuthenticated");
		localStorage.removeItem("studentProfile");
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, role, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

export function getDefaultPath(role) {
	return role === "student" ? "/student" : "/verify";
}
