import { auth, provider } from './firebase-config';
import { signInWithPopup, signOut } from 'firebase/auth';

// Functionality to log in via Google sign in
export const onSignInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Signed in with ', user);
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
  } catch (error) {
    console.error(error);
  }
};

// Functionality to log out
export const onSignOut = () => {
  signOut(auth);
  logoutBtn.style.display = 'none';
  loginBtn.style.display = 'block';
};

export const onGetUser = () => {
  return auth;
};

// To be used at some point to keep details whilst hard refresh
document.addEventListener('DOMContentLoaded', function () {
  if (onGetUser().currentUser) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
  } else {
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'block';
  }
});

// Specify the element that will trigger the functionlity methods above
export const loginBtn = document.getElementById('login') as HTMLElement;
export const logoutBtn = document.getElementById('logout') as HTMLElement;
