import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: "https://ecocycle-22125-default-rtdb.firebaseio.com",
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let database: Database | undefined;

// Only initialize in browser environment
// In Node.js/build environment, these will remain undefined
if (typeof window !== "undefined") {
    try {
        if (getApps().length === 0) {
            app = initializeApp(firebaseConfig);
        } else {
            app = getApp();
        }

        if (app) {
            db = getFirestore(app);
            auth = getAuth(app);
            database = getDatabase(app);
        }
    } catch (error) {
        // Silently handle Firebase initialization errors
        // This is expected during build time or when config is incomplete
        if (typeof window !== "undefined") {
            console.debug("Firebase initialization deferred or failed:", error instanceof Error ? error.message : String(error));
        }
    }
}

export { app, db, auth, database };
