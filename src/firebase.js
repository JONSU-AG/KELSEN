import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyKelsenDefaultApiKeyForDevDemo12345',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'kelsen-unsa-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'kelsen-unsa-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'kelsen-unsa-app.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '987654321012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:987654321012:web:kelsenapp12345'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
