// Base of all functions. This file will allow the build to create the 'dist/index.js' file
import { onSignInWithGoogle, loginBtn, signOutBtn, onSignOut } from './auth';

// Link and specify which functionlity will trigger certain HTML element
if (loginBtn) {
  loginBtn.onclick = onSignInWithGoogle;
}

if (signOutBtn) {
  signOutBtn.onclick = onSignOut;
}
