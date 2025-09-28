import { useState, useEffect, createContext, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

const FirebaseAuthContext = createContext();

export function FirebaseAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get the Firebase ID token
        const token = await user.getIdToken();
        
        try {
          // Sync with your backend
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser({ ...user, ...userData }); // Combine Firebase and MongoDB user data
          } else {
            console.error('Failed to sync user data with backend');
          }
        } catch (error) {
          console.error('Error syncing user data:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register with email/password
  const register = async (email, password, userData) => {
    try {
      setError(null);
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase profile
      await updateProfile(userCredential.user, {
        displayName: userData.name
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Get Firebase ID token
      const token = await userCredential.user.getIdToken();

      // Create user in your backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...userData,
          firebaseUid: userCredential.user.uid
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user in backend');
      }

      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with email/password
  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {!loading && children}
    </FirebaseAuthContext.Provider>
  );
}

// Custom hook to use Firebase Auth
export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}