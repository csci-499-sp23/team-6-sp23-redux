import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signOut,updatePassword } from 'firebase/auth';
 
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export const signOutUser = async () => await signOut(auth).then(r => r).catch(e => ({ error: e }));

export const updateUserPassword = async (newPassword) => {
  return await updatePassword(auth.currentUser, newPassword).then((r) => {
    return { message: "success" }
  }).catch((error) => {
    // console.error(error);
    return { error: error }
  });
}
// export { app, db, auth };
export { db, auth };
