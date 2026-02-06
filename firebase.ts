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

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;
let _database: Database | null = null;
let _initialized = false;

const ensureInitialized = () => {
    // Skip if already initialized
    if (_initialized) return;
    _initialized = true;

    // Only initialize in browser
    if (typeof window === "undefined" || typeof document === "undefined") {
        return;
    }

    try {
        if (getApps().length === 0) {
            _app = initializeApp(firebaseConfig);
        } else {
            _app = getApp();
        }
        _db = getFirestore(_app);
        _auth = getAuth(_app);
        _database = getDatabase(_app);
    } catch (error) {
        console.error("Firebase initialization error:", error);
        _initialized = false;
    }
};

// Export getters that initialize on first access
export const getApp$firebase = (): FirebaseApp | null => {
    ensureInitialized();
    return _app;
};

export const getDb = (): Firestore | null => {
    ensureInitialized();
    return _db;
};

export const getAuth$firebase = (): Auth | null => {
    ensureInitialized();
    return _auth;
};

export const getDatabase$firebase = (): Database | null => {
    ensureInitialized();
    return _database;
};

// For backward compatibility, export proxy objects that trigger initialization
let app: any;
let db: any;
let auth: any;
let database: any;

if (typeof window !== "undefined") {
    ensureInitialized();
    app = _app;
    db = _db;
    auth = _auth;
    database = _database;
}

export { app, db, auth, database };
