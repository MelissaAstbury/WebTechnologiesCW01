import { auth, provider } from './firebase-config';
import { signInWithPopup, signOut } from 'firebase/auth';

// Functionality to log in via Google sign in and set user in local storage.
export const onSignInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    localStorage.setItem('user', JSON.stringify(user));
    console.log('Signed in with ', user.displayName);
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    yourRecipesNavBtn.style.display = 'block';
  } catch (error) {
    console.error(error);
  }
};

// Functionality to log out and clear user in local stroage.
export const onSignOut = () => {
  signOut(auth);
  localStorage.removeItem('user');
  loginBtn.style.display = 'block';
  logoutBtn.style.display = 'none';
  yourRecipesNavBtn.style.display = 'none';
};

export const onGetUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user);
  } else {
    return false;
  }
};

// To be used at some point to keep details whilst hard refresh
document.addEventListener('DOMContentLoaded', function () {
  if (onGetUser()) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    yourRecipesNavBtn.style.display = 'block';
  } else {
    yourRecipesNavBtn.style.display = 'none';
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'block';
  }
});

// Specify the element that will trigger the functionlity methods above
export const loginBtn = document.getElementById('login') as HTMLElement;
export const logoutBtn = document.getElementById('logout') as HTMLElement;
export const yourRecipesNavBtn = document.getElementById('your-recipes-nav') as HTMLElement;
