// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAun_NhLEYX5X4EQ0PXTxBOS9vZBBMTJhA",
  authDomain: "certainty-poker-ac89b.firebaseapp.com",
  projectId: "certainty-poker-ac89b",
  storageBucket: "certainty-poker-ac89b.firebasestorage.app",
  messagingSenderId: "1003636275505",
  appId: "1:1003636275505:web:1bc728a613081282ea5810",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
