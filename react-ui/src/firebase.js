// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCq6zXnLI9wlNjnVQ9Box_G_g-_X57fx84",
    authDomain: "heyfennel-a232f.firebaseapp.com",
    projectId: "heyfennel-a232f",
    storageBucket: "heyfennel-a232f.firebasestorage.app",
    messagingSenderId: "370242473394",
    appId: "1:370242473394:web:eae6604fac16e73f6928ab",
    measurementId: "G-76J0T8MC10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
export { db };