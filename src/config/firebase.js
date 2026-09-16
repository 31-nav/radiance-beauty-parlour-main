import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTBE3AKFBvrBz_zWhzhVdNTK_nUWihw1k",
  authDomain: "radiance-beauty-67cc0.firebaseapp.com",
  projectId: "radiance-beauty-67cc0",
  storageBucket: "radiance-beauty-67cc0.firebasestorage.app",
  messagingSenderId: "760069369386",
  appId: "1:760069369386:web:b0808ceaa43d7f074b9d53",
  measurementId: "G-SKSCK0HJKW",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const ADMIN_UID = "omM98HhfikPrJxmSRAEouFHSjkB2";
