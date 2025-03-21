import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUHJdeBP-f6oNHm-TGBAJldy6UK2GMwxU",
  authDomain: "saas-subtitle.firebaseapp.com",
  projectId: "saas-subtitle",
  storageBucket: "saas-subtitle.firebasestorage.app",
  messagingSenderId: "628189449970",
  appId: "1:628189449970:web:0a9c587a4f507b28598a6b",
  measurementId: "G-CMTB1EY56B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics - only in browser environment
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, auth, analytics, onAuthStateChanged };
export type { User };
