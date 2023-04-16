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
export const allRecipes: Irecipe[] = [];

get(recipesRef)
  .then((snapshot) => {
    if (snapshot.val()) {
      let index = 0;
      for (const values of Object.values(snapshot.val()) as Irecipe[]) {
        // allRecipes.push(values as Irecipe);
        if (allRecipesElement) {
          document.getElementById('all-recipes')!.innerHTML += `
              <div class="recipe-item">
                <img
                  src="../../assets/images/${values.image}"
                  alt="Pizza"
                  class="recipe-item-image"
                />
                <div>
                  <h3>${values.name}</h3>
                  <p>Theme: ${values.theme}</p>
                </div>
              </div>
            `;
        }

        // Keeps a count of how many, we only want to display 9 items.
        if (homeRecipesElement && index < 9) {
          document.getElementById('home-recipes')!.innerHTML += `
              <div class="recipe-item">
                <img
                  src="./assets/images/${values.image}"
                  alt="Pizza"
                  class="recipe-item-image"
                />
                <div>
                  <h3>${values.name}</h3>
                  <p>Theme: ${values.theme}</p>
                </div>
              </div>
            `;
        }

        // This will only draw the receipes on the page which are attached to the current user.
        if (yourRecipesElement && values.publisher === userEmail) {
          document.getElementById('your-recipes')!.innerHTML += `
              <div class="recipe-item">
                <img
                  src="../../assets/images/${values.image}"
                  alt="Pizza"
                  class="recipe-item-image"
                />
                <div>
                  <h3>${values.name}</h3>
                  <p>Theme: ${values.theme}</p>
                </div>
              </div>
            `;
        }

        // Adding itteror count at the end -
        index++;
      }
      // Hide loader upon successful load and also drawn onto the document.
      document.getElementById('page-spinner')!.style.display = 'none';
    }
  })
  .catch((err) => {
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
    console.warn(err);
  });
