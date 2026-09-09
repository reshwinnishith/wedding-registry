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
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.firebasestorage.app",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const GIFTS_COLLECTION = "gifts";
