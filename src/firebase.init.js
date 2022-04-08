import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyCjisrOP5vwEFxDK4aoCupcRfgZfr0gEaQ",
    authDomain: "neel-hero.firebaseapp.com",
    projectId: "neel-hero",
    storageBucket: "neel-hero.appspot.com",
    messagingSenderId: "1095423415585",
    appId: "1:1095423415585:web:9ec96759aec711eb445a60"
};

const app = initializeApp(firebaseConfig);
export default app;