// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "certainty-poker.firebaseapp.com",
  projectId: "certainty-poker",
  storageBucket: "certainty-poker.firebasestorage.app",
  messagingSenderId: "39603160000",
  appId: "1:39603160000:web:b60e429273a3f53bb4be25",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export default app;
