import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "...",
    authDomain: "app1monika.firebaseapp.com",
    projectId: "app1monika",
    storageBucket: "app1monika.appspot.com",
    messagingSenderId: "...",
    appId: "1::web:",
    measurementId: "G-..."
  };
  
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

export { db };
