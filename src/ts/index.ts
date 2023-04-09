// Base of all functions. This file will allow the build to create the 'dist/index.js' file
import { onSignInWithGoogle, loginBtn, logoutBtn, onSignOut } from './auth';
import { createRecipeBtn, createRecipe } from "./form";

// Link and specify which functionlity will trigger certain HTML element
if (loginBtn) {
  loginBtn.onclick = onSignInWithGoogle;
}

if (logoutBtn) {
  logoutBtn.onclick = onSignOut;
}

if (createRecipeBtn) {
  createRecipeBtn.onclick = createRecipe;
}