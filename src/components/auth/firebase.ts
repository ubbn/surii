import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as firebaseui from "firebaseui";

const firebaseConfig = {
  apiKey: "AIzaSyDoFu3yC0KXp93EhnRjefzAp6tGw0feixw",
  authDomain: "whatisthat-a518c.firebaseapp.com",
  projectId: "whatisthat-a518c",
  storageBucket: "whatisthat-a518c.appspot.com",
  messagingSenderId: "489603733778",
  appId: "1:489603733778:web:1995dcb277db9183b0bbcb",
  measurementId: "G-ELM1GSYXWT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(auth);

export { ui, auth };
