import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDKw_uJDVEf1nMEQvdp8HTa6uAkqw-8UpI",
    authDomain: "prosperledger-2066e.firebaseapp.com",
    projectId: "prosperledger-2066e",
    storageBucket: "prosperledger-2066e.firebasestorage.app",
    messagingSenderId: "935082227118",
    appId: "1:935082227118:web:905af7687583940486443f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
