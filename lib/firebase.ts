import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase's web config is not a secret — it identifies the project,
// it doesn't authorize access. Access control lives entirely in
// firestore.rules. That's why this is safe to commit and to hardcode
// here instead of pulling from environment variables.
//
// Replace these placeholder values with the config from your Firebase
// project: Project settings -> General -> Your apps -> Web app -> SDK
// setup and configuration -> Config. See README.md for the full setup
// steps.
const firebaseConfig = {
  apiKey: "AIzaSyBy_hCpWlbpoTX2BDkbZQ5ZM6WGziVtplc",
  authDomain: "wedding-registry-31c5c.firebaseapp.com",
  projectId: "wedding-registry-31c5c",
  storageBucket: "wedding-registry-31c5c.firebasestorage.app",
  messagingSenderId: "398366975460",
  appId: "1:398366975460:web:89621603e3c877856393f1",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const GIFTS_COLLECTION = "gifts";
