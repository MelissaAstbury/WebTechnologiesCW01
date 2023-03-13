import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  API_KEY,
  APP_ID,
  MESSAGING_SENDER_ID,
  MEASUREMENT_ID,
} from '../../config';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'peliza-recipes.firebaseapp.com',
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
