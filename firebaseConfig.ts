import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, User } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';
import { FirebaseStorage, getStorage } from 'firebase/storage';

dotenv.config();

const firebaseConfig = {
  apiKey: (process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '').trim(),
  authDomain: (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '').trim(),
  databaseURL: (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '').trim(),
  projectId: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '').trim(),
  storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '').trim(),
  messagingSenderId: (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
  appId: (process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '').trim(),
  measurementId: (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '').trim(),
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app)
/* This code listens for changes in the user's authentication state using the Firebase Authentication method 'onAuthStateChanged'.

  It takes two arguments:
  1. The 'auth' object, which is an instance of the Firebase Authentication service.
  2. A callback function that is called whenever the user's authentication state changes.

  The callback function receives a 'user' parameter, which is an object representing the currently signed-in user. If a user is signed in, the 'user' object contains information about the user, such as their email, display name, and other user data. If no user is signed in, the 'user' object is null.
*/
onAuthStateChanged(auth, (user: User | null) => {
  if (user) {
    // If the 'user' object is not null, it means a user is signed in
    console.log("user logged in");
  } else {
    // If the 'user' object is null, it means no user is signed in
    console.log("user logged out");
  }
});