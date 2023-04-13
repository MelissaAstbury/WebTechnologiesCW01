import { onGetUser } from './auth';
import { getDatabase, ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

// Send values to firebase database
function sendRecipeData(
  publisher: string,
  name: string,
  theme: string,
  ingredients: string,
  instructions: string,
  images: string,
  allergies: string[],
  sharingPolicy: string[]
) {
  const db = getDatabase();
  set(ref(db, 'recipes'), {
    id: uuidv4(),
    publisher,
    name,
    theme,
    ingredients,
    instructions,
    images,
    allergies,
    sharingPolicy,
    votes: 0,
  });
}

// Funxtionlity to submit for to firebase database
export const createRecipe = (e: Event) => {
  try {
    // Prevent broswer default behaviour
    e.preventDefault();
    // Check the user authentication
    if (
      !onGetUser() ||
      !onGetUser().currentUser ||
      onGetUser().currentUser?.email === null
    ) {
      console.warn('Sign in to create a recipe');
      return;
    }
    // Get values from form
    const publisher = onGetUser().currentUser?.email;
    const theme = document.getElementById('theme') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;
    const ingredients = document.getElementById(
      'ingredients'
    ) as HTMLInputElement;
    const instructions = document.getElementById(
      'instructions'
    ) as HTMLInputElement;
    const images = ['image 1', 'image 2', 'image 3'];
    const dairyAllergy = document.getElementById(
      'dairy-allergy'
    ) as HTMLInputElement;
    const nutAllergy = document.getElementById(
      'nut-allergy'
    ) as HTMLInputElement;
    const publicSharing = document.getElementById(
      'public-sharing'
    ) as HTMLInputElement;
    const privateSharing = document.getElementById(
      'private-sharing'
    ) as HTMLInputElement;
    let allergies = [];
    let sharingPolicy = [];
    if (dairyAllergy.checked) {
      allergies.push(dairyAllergy.value);
    }
    if (nutAllergy.checked) {
      allergies.push(nutAllergy.value);
    }
    if (publicSharing.checked) {
      sharingPolicy.push(publicSharing.value);
    }
    if (privateSharing.checked) {
      sharingPolicy.push(privateSharing.value);
    }

    // Send values to firebase database
    sendRecipeData(
      publisher!,
      theme.value,
      name.value,
      ingredients.value,
      instructions.value,
      images[0],
      allergies,
      sharingPolicy
    );
  } catch (error) {
    console.warn(error, 'There was an error creating your recipe');
  }
};

// Listener for when the form is submit
document
  .getElementById('recipe-form')
  ?.addEventListener('submit', createRecipe);

// Specify the element that will trigger the functionlity methods above
export const createRecipeBtn = document.querySelector(
  '#save-btn'
) as HTMLElement;
