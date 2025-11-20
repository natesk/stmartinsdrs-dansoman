import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7DBv-AMh8DFDUKCwPvgmNM2hdrzfejIY",
  authDomain: "rosterpro-4-royaldrs.firebaseapp.com",
  projectId: "rosterpro-4-royaldrs",
  storageBucket: "rosterpro-4-royaldrs.appspot.com",
  messagingSenderId: "347272495930",
  appId: "1:347272495930:web:454140fae506eac749c603",
  measurementId: "G-BEGCPHRSZL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
