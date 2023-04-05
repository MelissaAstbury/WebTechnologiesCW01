import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  API_KEY,
  DATABASE_URL,
  APP_ID,
  MESSAGING_SENDER_ID,
  MEASUREMENT_ID,
} from '../../config';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'peliza-recipes.firebaseapp.com',
  databaseURL: DATABASE_URL,
  projectId: 'peliza-recipes',
  storageBucket: 'peliza-recipes.appspot.com',
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Make reference to the firebase database
export const recipeForm = getDatabase(app);
