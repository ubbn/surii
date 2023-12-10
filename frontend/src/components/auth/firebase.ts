import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as firebaseui from "firebaseui";

const firebaseConfig = {
  apiKey: "AIzaSyCknPCYNRuezYurhsrvYnvC-7_g2P6Zccw",
  authDomain: "b-learn-57a09.firebaseapp.com",
  projectId: "b-learn-57a09",
  storageBucket: "b-learn-57a09.appspot.com",
  messagingSenderId: "316265251528",
  appId: "1:316265251528:web:66da54492cc205b6c85bfd",
  measurementId: "G-6H53PKYXBE",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(auth);

export { ui, auth };
