import { get, getDatabase, ref, update } from 'firebase/database';
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
  sharingPolicy: 'public' | 'private';
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
          const urlParams = new URLSearchParams(window.location.search);
          // If the user has picked a theme, it will appear here from the path URL.
          const themeSelected = urlParams.get('theme');
          if (!themeSelected && recipe.sharingPolicy === 'public') {
            document.getElementById('all-recipes')!.innerHTML += `
            <div class="recipe-item">
              <img
                src="../../assets/images/${recipe.image}"
                alt="${recipe.name}"
                class="recipe-item-image"
              />
              <a href="./recipe.html?id=${recipe.id}">
                <div>
                  <p class="bold-text">${recipe.name}</p>
                  <p> ${recipe.theme}</p>
                </div>  
                </a>
              </div>
            </div>
          `;
          } else if (
            // If you have not selected a theme, its a private recipe and its owned by yourself.
            !themeSelected &&
            recipe.sharingPolicy === 'private' &&
            recipe.publisher === userEmail
          ) {
            document.getElementById('all-recipes')!.innerHTML += `
            <div class="recipe-item">
              <img
                src="../../assets/images/${recipe.image}"
                alt="${recipe.name}"
                class="recipe-item-image"
              />
              <a href="./recipe.html?id=${recipe.id}">
                <div>
                  <p class="bold-text">${recipe.name}</p>
                  <p> ${recipe.theme}</p>  
                </div>
                </a>
            </div>
          `;
          } else if (
            // Selected theme and its a public recipe.
            themeSelected === recipe.theme &&
            recipe.sharingPolicy === 'public'
          ) {
            document.getElementById(themeSelected)!.style.textDecoration =
              'underline';
            document.getElementById(themeSelected)!.style.backgroundColor =
              '#0333';
            document.getElementById('all-recipes')!.innerHTML += `
            <div class="recipe-item">
              <img
                src="../../assets/images/${recipe.image}"
                alt="${recipe.name}"
                class="recipe-item-image"
              />
              <a href="./recipe.html?id=${recipe.id}">
                <div>
                  <p class="bold-text">${recipe.name}</p>
                  <p> ${recipe.theme}</p>
                </div>  
              </a>
            </div>
          `;
          } else if (
            // Selected a theme and the recipe is private and its owned by yourself.
            themeSelected === recipe.theme &&
            recipe.sharingPolicy === 'private' &&
            recipe.publisher === userEmail
          ) {
            document.getElementById(themeSelected)!.style.textDecoration =
              'underline';
            document.getElementById(themeSelected)!.style.backgroundColor =
              '#0333';
            document.getElementById('all-recipes')!.innerHTML += `
            <div class="recipe-item">
              <img
                src="../../assets/images/${recipe.image}"
                alt="${recipe.name}"
                class="recipe-item-image"
              />
              <a href="./recipe.html?id=${recipe.id}">
                <div>
                  <p class="bold-text">${recipe.name}</p>
                  <p> ${recipe.theme}</p>
                </div>
              </a>
            </div>
          `;
          }
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
                <a href="./src/html/recipe.html?id=${recipe.id}">
                  <div>
                    <p class="bold-text">${recipe.name}</p>
                    <p> ${recipe.theme}</p>  
                  </div>
                  </a>
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
                <a href="./recipe.html?id=${recipe.id}">
                  <div>
                    <p class="bold-text">${recipe.name}</p>
                    <p> ${recipe.theme}</p>
                  </div>
                </a>
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
                  <div class="recipe-header">
                    <p class="bold-text">${recipe.name}</p>
                    <button id="share-button">Share</button>
                  </div>
                    </br>
                    <span class="bold-text">Ingrediants:</span>
                    <p>${recipe.ingredients}</p>
                    </br>
                    <span class="bold-text">Instructions:</span> 
                    <p>${recipe.instructions}</p>
                    <br />
                    <p>${recipe.votes} people like this recipe</p>
                    <button id="vote-btn">
                      <span id="heart-icon" style="color: black;">
                        <i class="fa-regular fa-heart fa-xl"></i>
                      </span>
                    </button>
                  </div>
                </div>
              `;
            // Populating the share contents for when the button is clicked to share.
            shareData.title = recipe.name;
            shareData.text = `Learn how to cook ${recipe.name}`;
            shareData.url = `https://melissaastbury.github.io/WebTechnologiesCW01/src/html/recipe.html?id=${recipe.id}`;

            // Remove the share button if its not supported by the browser.
            if (navigator) {
              document
                .getElementById('share-button')!
                .addEventListener('click', async () => {
                  try {
                    await navigator.share(shareData);
                  } catch (err) {
                    console.warn(`Error: ${err}`);
                  }
                });
            } else {
              document.getElementById('share-button')!.style.display = 'none';
            }

            if (document.getElementById('vote-btn')) {
              if (localStorage.getItem('liked')) {
                document.getElementById('heart-icon')!.style.color = 'red';
              }
            }
            document
              .getElementById('vote-btn')!
              .addEventListener('click', () => {
                document.getElementById('heart-icon')!.style.color = 'red';
                // Update database votes for the recipe
                var updates = {
                  votes: recipe.votes + 1,
                };
                update(ref(db, /recipes/ + recipe.id), updates);
                // Reload to show the updated information
                return window.location.reload();
              });
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
