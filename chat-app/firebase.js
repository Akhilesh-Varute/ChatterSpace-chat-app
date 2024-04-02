// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0aTnQePoikNtGOo0dgs3oqsfO1dQfO2U",
  authDomain: "chatme-605ce.firebaseapp.com",
  projectId: "chatme-605ce",
  storageBucket: "chatme-605ce.appspot.com",
  messagingSenderId: "611497862632",
  appId: "1:611497862632:web:b2c91b0cb2e2505509f05d",
  measurementId: "G-1XQFNYS055"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth,app}