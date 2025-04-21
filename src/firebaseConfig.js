// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBV7uZGTwtjmnzpxM5gO56zYXCpjkOOEPI",
  authDomain: "go-movement-ke-trial.firebaseapp.com",
  projectId: "go-movement-ke-trial",
  storageBucket: "go-movement-ke-trial.firebasestorage.app",
  messagingSenderId: "923877229186",
  appId: "1:923877229186:web:da87705733d31d8657aa9b",
  measurementId: "G-Y675Q8V1LX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//Initialize Firebase Firestore
export const database = getFirestore(app);
// Add error logging to capture runtime issues
console.log("Firestore initialized with project ID:", firebaseConfig.projectId);
//Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firebase Analytics
// Note: Analytics is only available in the browser environment
const analytics = getAnalytics(app);