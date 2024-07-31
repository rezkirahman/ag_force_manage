import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfigProduction = {
    apiKey: "AIzaSyAUZ5qAqc74kFGsidhos4tXyLVnDywFz0k",
    authDomain: "scbd-apps-sg.firebaseapp.com",
    projectId: "scbd-apps-sg",
    storageBucket: "scbd-apps-sg.appspot.com",
    messagingSenderId: "994850849219",
    appId: "1:994850849219:web:2a570c7240200bb9dd7d76",
    measurementId: "G-D1YXDLD064"
}

const firebaseConfigDevelopment = {
    apiKey: "AIzaSyCtqo8YEP0Z0MVxJh8WpoSno-0v5sopUfM",
    authDomain: "scbd-agi-dev.firebaseapp.com",
    projectId: "scbd-agi-dev",
    storageBucket: "scbd-agi-dev.appspot.com",
    messagingSenderId: "926556017824",
    appId: "1:926556017824:web:dab35ec1d536cb7bfc25c5",
    measurementId: "G-YQ4HH69MK5"
}

const app = initializeApp(firebaseConfigDevelopment)

export const firestore = getFirestore(app)