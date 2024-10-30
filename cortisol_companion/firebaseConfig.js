import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB-8dxIPJRS3MmJmLJJF8G83MCeSOanmYI",
  authDomain: "cortisolcompanion.firebaseapp.com",
  projectId: "cortisolcompanion",
  storageBucket: "cortisolcompanion.appspot.com",
  messagingSenderId: "388137966164",
  appId: "1:388137966164:web:e16792e512739e708aabc1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);