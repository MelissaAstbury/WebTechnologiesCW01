import { get, getDatabase, ref } from 'firebase/database';
import { onGetUser } from './auth';

// Created a recipe interface to use around the application.
export interface Irecipe {
  id: string;
  publisher: string;
  name: string;
  theme: string;
  ingredients: string;
  instructions: string;
  image: string;
  allergies: string[];
  sharingPolicy: string[];
  votes: number;
}

// Get recipe database
const db = getDatabase();
const recipesRef = ref(db, 'recipes');
const userEmail = onGetUser().email;
const allRecipesElement = document.getElementById('all-recipes');
const homeRecipesElement = document.getElementById('home-recipes');
const yourRecipesElement = document.getElementById('your-recipes');
const recipeContainer = document.getElementById('recipe-container');
let shareData = {
  title: '',
  text: '',
  url: '',
};
export const allRecipes: Irecipe[] = [];

get(recipesRef)
  .then((snapshot) => {
    if (snapshot.val()) {
      let index = 0;
      for (const recipe of Object.values(snapshot.val()) as Irecipe[]) {
        // This will render all recipes on the all recipes page.
        if (allRecipesElement) {
          document.getElementById('all-recipes')!.innerHTML += `
              <div class="recipe-item">
                <img
                  src="../../assets/images/${recipe.image}"
                  alt="${recipe.name}"
                  class="recipe-item-image"
                />
                <div>
                  <h3>${recipe.name}</h3>
                  <p>Theme: ${recipe.theme}</p>
                  <a href="./recipe.html?id=${recipe.id}">View</a>
                </div>
              </div>
            `;
        }

        // Keeps a count of how many, we only want to render 9 items.
        if (homeRecipesElement && index < 9) {
          document.getElementById('home-recipes')!.innerHTML += `
              <div class="recipe-item">
                <img
                  src="./assets/images/${recipe.image}"
                  alt="${recipe.name}"
                  class="recipe-item-image"
                />
                <div>
                  <h3>${recipe.name}</h3>
                  <p>Theme: ${recipe.theme}</p>
                  <a href="./src/html/recipe.html?id=${recipe.id}">View</a>
                </div>
              </div>
            `;
        }

        // This will only render the receipes on the page which are attached to the current user.
        if (yourRecipesElement && recipe.publisher === userEmail) {
          document.getElementById('your-recipes')!.innerHTML += `
              <div class="recipe-item">
                <img
                  src="../../assets/images/${recipe.image}"
                  alt="${recipe.name}"
                  class="recipe-item-image"
                />
                <div>
                  <h3>${recipe.name}</h3>
                  <p>Theme: ${recipe.theme}</p>
                  <a href="./recipe.html?id=${recipe.id}">View</a>
                </div>
              </div>
            `;
        }

        // This will render the singular recipe which is pushed to the path URL.
        if (recipeContainer) {
          const urlParams = new URLSearchParams(window.location.search);
          const recipeId = urlParams.get('id'); // Id here will be the recipe ID.
          if (recipe.id === recipeId) {
            // only renders the selected recipe.
            document.getElementById('recipe')!.innerHTML += `
                <div class="recipe">
                  <img
                    src="../../assets/images/${recipe.image}"
                    alt="${recipe.name}"
                  />
                  <div>
                    <h3>${recipe.name}</h3>
                    <button id="share-button">Share</button>
                    </br>
                    <p>Theme: ${recipe.theme}</p>
                    </br>
                    <p>${recipe.ingredients}</p>
                    </br>
                    <p>${recipe.instructions}</p>
                  </div>
                </div>
              `;
            // Populating the share contents for when the button is clicked to share.
            shareData.title = recipe.name;
            shareData.text = `Learn how to cook ${recipe.name}`;
            shareData.url = `https://melissaastbury.github.io/WebTechnologiesCW01/src/html/recipe.html?id=${recipe.id}`;

            // Remove the share button if its not supported by the browser.
            if (navigator) {
              document.getElementById('share-button')!.style.display = 'none';
            } else {
              document
                .getElementById('share-button')!
                .addEventListener('click', async () => {
                  try {
                    await navigator.share(shareData);
                  } catch (err) {
                    console.warn(`Error: ${err}`);
                  }
                });
            }
          }
        }

        // Adding itteror count at the end.
        index++;
      }
      // Hide loader upon successful load and also drawn onto the document.
      document.getElementById('page-spinner')!.style.display = 'none';
    }
  })
  .catch((err) => {
    console.warn(err);
    // Hide loader upon error fetching recipes.
    document.getElementById('page-spinner')!.style.display = 'none';
    if (allRecipesElement) {
      document.getElementById('all-recipes')!.innerHTML += `
        <h2>Sorry there has been an error fetching all recipes.</h2>
      `;
    } else if (homeRecipesElement) {
      document.getElementById('home-recipes')!.innerHTML += `
        <h2>Sorry there has been an error fetching recipes.</h2>
      `;
    } else if (yourRecipesElement) {
      document.getElementById('your-recipes')!.innerHTML += `
        <h2>Sorry there has been an error fetching your recipes.</h2>
      `;
    }
  });
