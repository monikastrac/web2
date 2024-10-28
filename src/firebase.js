import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD3GNfnaLewTr8Ead21HP4X2BMG5Duw_T4",
    authDomain: "app1monika.firebaseapp.com",
    projectId: "app1monika",
    storageBucket: "app1monika.appspot.com",
    messagingSenderId: "752860530783",
    appId: "1:752860530783:web:b51ad817707282835233ea",
    measurementId: "G-F65WCNJTF7"
  };
  
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

export { db };
