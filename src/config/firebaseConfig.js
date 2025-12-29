// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
export const firebaseDB = getDatabase(app);