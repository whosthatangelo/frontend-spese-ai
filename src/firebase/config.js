// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCGqpdITENP848MtyrMcupcm0HbN1II7R8",
  authDomain: "expenses-ai-398b0.firebaseapp.com",
  projectId: "expenses-ai-398b0",
  storageBucket: "expenses-ai-398b0.firebasestorage.app",
  messagingSenderId: "753761877034",
  appId: "1:753761877034:web:a3699b2b3bca643e5ed753",
  measurementId: "G-QLB5F4MTJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Forza la selezione account ogni volta
});

export default app;