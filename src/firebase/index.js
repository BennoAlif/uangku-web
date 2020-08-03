import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2qJ6NlvxyC5QdPz2foJhvYrNu33b0uxk",
  authDomain: "uangku-d3b3d.firebaseapp.com",
  databaseURL: "https://uangku-d3b3d.firebaseio.com",
  projectId: "uangku-d3b3d",
  storageBucket: "uangku-d3b3d.appspot.com",
  messagingSenderId: "981636270416",
  appId: "1:981636270416:web:96b87482ecb119d8e7c455",
  measurementId: "G-3JTM3P0LQE",
};

firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
export const auth = firebase.auth();
