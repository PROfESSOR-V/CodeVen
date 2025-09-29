import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [role, setRole] = useState(null);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			setIsLoading(true);
			try {
				if (firebaseUser) {
					const token = await firebaseUser.getIdToken();
					const userData = await validateToken(token);
					if (userData) {
						setUser(userData);
						setRole(userData.role);
						setIsAuthenticated(true);
						localStorage.setItem('userProfile', JSON.stringify(userData));
					} else {
						logout();
					}
				} else {
					logout();
				}
			} catch (error) {
				console.error("Auth state change error:", error);
				logout();
			} finally {
				setIsLoading(false);
			}
		});

		return () => unsubscribe();
	}, []);

	const validateToken = async (token) => {
		try {
			const response = await fetch(`${API_URL}/auth/sync`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			if (response.ok) {
				const userData = await response.json();
				return userData;
			} else {
				console.error("Token validation failed:", response.status);
				return null;
			}
		} catch (error) {
			console.error("Token validation error:", error);
			return null;
		}
	};

	const login = async (email, password, userRole, additionalData = {}) => {
		try {
			// First authenticate with Firebase
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const token = await userCredential.user.getIdToken();

			// Then sync with our backend
			const response = await fetch(`${API_URL}/auth/sync`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				}
			});

			if (response.ok) {
				const userData = await response.json();
				
				// Verify role matches if userRole is provided
				if (userRole && userData.role !== userRole) {
					throw new Error('Invalid role for this portal');
				}

				setUser(userData);
				setRole(userData.role);
				setIsAuthenticated(true);
				localStorage.setItem('userProfile', JSON.stringify(userData));
				
				return true;
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Login failed');
			}
		} catch (error) {
			console.error("Login error:", error);
			logout();
			throw error;
		}
	};

	const register = async (userData) => {
		try {
			const response = await fetch(`${API_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (response.ok && data.token) {
				setUser(data);
				setRole(data.role);
				setIsAuthenticated(true);
				localStorage.setItem("token", data.token);
				return true;
			} else {
				throw new Error(data.message || 'Registration failed');
			}
		} catch (error) {
			console.error("Registration error:", error);
			throw error;
		}
	};

	const logout = async () => {
		try {
			await auth.signOut();
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setUser(null);
			setRole(null);
			setIsAuthenticated(false);
			localStorage.removeItem("userProfile");
			localStorage.removeItem("token");
		}
	};

	return (
		<AuthContext.Provider 
			value={{ 
				isAuthenticated, 
				role, 
				user,
				login, 
				logout, 
				register,
				isLoading 
			}}
		>
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
	switch(role) {
		case 'student':
			return '/student/dashboard';
		case 'faculty':
			return '/faculty/dashboard';
		case 'admin':
			return '/admin/dashboard';
		default:
			return '/login';
	}
}
