import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCbvzyx5G_mnUatPomJ_A8-9bWf8j6PL78",
    authDomain: "letter-collection.firebaseapp.com",
    databaseURL: "https://letter-collection-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "letter-collection",
    storageBucket: "letter-collection.firebasestorage.app",
    messagingSenderId: "759208334321",
    appId: "1:759208334321:web:a7b4f40f01a9742cc4ea50",
    measurementId: "G-Q2FW0GC2D0"
  };

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);


