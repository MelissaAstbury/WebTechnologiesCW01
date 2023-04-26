import { onGetUser } from './auth';
import { getDatabase, ref, update } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

// Get recipe database
const db = getDatabase();

// Send values to firebase database
async function sendRecipeData(
  publisher: string,
  name: string,
  theme: string,
  ingredients: string,
  instructions: string,
  image: string,
  sharingPolicy: string
) {
  const id = uuidv4();
  await update(ref(db, 'recipes/' + id), {
    id,
    publisher,
    name,
    theme,
    ingredients,
    instructions,
    image,
    sharingPolicy,
    votes: 0,
  });
  window.location.href = "./yourRecipes.html"
}

// Functionlity to submit for to firebase database
export const createRecipe = (e: Event) => {
  try {
    // Prevent broswer default behaviour
    e.preventDefault();
    // Check the user authentication
    if (!onGetUser() || onGetUser().email === null) {
      console.warn('Sign in to create a recipe');
      return;
    }
    // Get values from form
    const publisher = onGetUser().email;
    const name = document.getElementById('name') as HTMLInputElement;
    const instructions = document.getElementById(
      'instructions'
    ) as HTMLInputElement;
    const ingredients = document.getElementById(
      'ingredients'
    ) as HTMLInputElement;
    const theme = document.querySelector(
      "select[name='theme']"
    ) as HTMLInputElement;
    const image = document.querySelector(
      "input[type='radio'][name='food-image']:checked"
      ) as HTMLInputElement;
      const publicSharing = document.getElementById(
      'public'
    ) as HTMLInputElement;
    const privateSharing = document.getElementById(
      'private'
    ) as HTMLInputElement;

    let sharingPolicy = '';
    if (publicSharing.checked) {
      sharingPolicy = 'public';
    }
    if (privateSharing.checked) {
      sharingPolicy = 'private';
    }

    //Send values to firebase database
    sendRecipeData(
      publisher!,
      name.value,
      theme.value,
      ingredients.value,
      instructions.value,
      image.value,
      sharingPolicy
    );
  } catch (error) {
    alert('There was an error creating your recipe');
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
