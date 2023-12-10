import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as firebaseui from "firebaseui";

const firebaseConfig = {
  apiKey: "AIzaSyCXjRBZXMEJ-W2U-XqbMm9g1T0TUmJzc7Y",
  authDomain: "bisurii.firebaseapp.com",
  projectId: "bisurii",
  storageBucket: "bisurii.appspot.com",
  messagingSenderId: "386576051480",
  appId: "1:386576051480:web:408b2633ecc6217b97826d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(auth);

export { ui, auth };
