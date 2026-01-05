// src/config/firebaseConfig.js
// Firebase configuration with Authentication
// Author: ibtyssam (updated for auth)

import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIV7wMlpZSHMiG_One8RVUTktN4Z69L_0",
  authDomain: "expensetracker-14d0d.firebaseapp.com",
  databaseURL: "https://expensetracker-14d0d-default-rtdb.firebaseio.com",
  projectId: "expensetracker-14d0d",
  storageBucket: "expensetracker-14d0d.firebasestorage.app",
  messagingSenderId: "927988903898",
  appId: "1:927988903898:web:7ccecc79a96bdc2b91dae3",
  measurementId: "G-GZKQV68PSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get database reference
export const firebaseDB = getDatabase(app);

// Get auth reference with RN persistence (falls back on web / fast refresh)
let authInstance;
if (Platform.OS === 'web') {
  authInstance = getAuth(app);
} else {
  try {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (e) {
    // During fast refresh initializeAuth can be called twice; fall back to getAuth
    authInstance = getAuth(app);
  }
}

export const firebaseAuth = authInstance;