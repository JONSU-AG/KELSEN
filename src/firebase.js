import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKQ7_BCul-C7LGkKmT7wNfGzyafmDdql8",
  authDomain: "kelsen-51b97.firebaseapp.com",
  projectId: "kelsen-51b97",
  storageBucket: "kelsen-51b97.firebasestorage.app",
  messagingSenderId: "258601810184",
  appId: "1:258601810184:web:5c65c691729c7a446e54bd",
  measurementId: "G-1TKMKTT3P6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
