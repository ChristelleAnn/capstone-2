import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjF7NxGcGsSAaxyDm3a7rROf46BVcmLnw",
  authDomain: "school-management-2b1ea.firebaseapp.com",
  projectId: "school-management-2b1ea",
  storageBucket: "school-management-2b1ea.appspot.com",
  messagingSenderId: "762749450737",
  appId: "1:762749450737:web:fb599392722c67b25dec50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

const storage  = getStorage(app);


export { db, auth, storage };
