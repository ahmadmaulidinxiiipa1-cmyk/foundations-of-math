import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDkUOxFmSOKAlwg5ETbRPTdJyuRbN6Knx8",
  authDomain: "foundations-of-math.firebaseapp.com",
  projectId: "foundations-of-math",
  storageBucket: "foundations-of-math.firebasestorage.app",
  messagingSenderId: "1031196904732",
  appId: "1:1031196904732:web:1723797bce9edb73a1fed9"
};

// Mencegah Next.js memuat Firebase berulang kali
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Mengaktifkan fitur Database dan Login
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };