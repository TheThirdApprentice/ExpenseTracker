

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { firebaseAuth } from '../config/firebaseConfig';

/**
 * Register new user
 */
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth, 
      email, 
      password
    );
    
    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName
    });
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await signOut(firebaseAuth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout');
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return firebaseAuth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(firebaseAuth, callback);
};

/**
 * Get user-friendly error messages
 */
const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection';
    default:
      return 'Authentication failed. Please try again';
  }
};