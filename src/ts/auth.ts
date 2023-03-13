import { auth, provider } from './firebase-config';
import {
  signInWithPopup,
  signOut
} from 'firebase/auth';

// Functionality to log in via Google sign in
export const onSignInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Signed in with ',user);
  } catch (error) {
    console.error(error);
  }
};

// Functionality to log out
export const onSignOut = () => {
  console.log('Signed out.')
  signOut(auth);
};

// Specify the element that will trigger the functionlity methods above
export const loginBtn = document.querySelector('#login') as HTMLElement;
export const signOutBtn = document.querySelector('#signout') as HTMLElement;


