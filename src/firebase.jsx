// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDv1bdyDivwMM0_U69DDMuqTaWP4XM9eTw",
    authDomain: "rewardsy-app.firebaseapp.com",
    projectId: "rewardsy-app",
    storageBucket: "rewardsy-app.appspot.com",
    messagingSenderId: "925031745113",
    appId: "1:925031745113:web:83b514e108e20a969ad348",
    measurementId: "G-YE9T3RZGQ4"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
