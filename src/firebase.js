import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZqhvq8odiTuZdv9-zZG2S6UMRbhKBulY",
  authDomain: "lexnova-a5fb7.firebaseapp.com",
  projectId: "lexnova-a5fb7",
  storageBucket: "lexnova-a5fb7.firebasestorage.app",
  messagingSenderId: "1027995703724",
  appId: "1:1027995703724:web:648569f0a64f4f054dc209",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
