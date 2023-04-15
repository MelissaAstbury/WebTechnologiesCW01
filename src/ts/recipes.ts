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
export const allRecipes: Irecipe[] = [];

get(recipesRef)
  .then((snapshot) => {
    if (snapshot.val()) {
      let index = 0;
      const allRecipesElement = document.getElementById('all-recipes');
      const homeRecipesElement = document.getElementById('home-recipes');
      for (const values of Object.values(snapshot.val()) as Irecipe[]) {
        console.log(values);
        // allRecipes.push(values as Irecipe);
        if (allRecipesElement) {
            document.getElementById('all-recipes')!.innerHTML += `
              <div class="recipe-item">
                <span style="color: rgb(212, 42, 12)">
                  <i class="fa-solid fa-heart fa-lg"></i>
                </span>
                <img
                  src="../../assets/images/${values.image}"
                  alt="Pizza"
                  class="recipe-item-image"
                />
                <div>
                  <h3>${values.name}</h3>
                  <p>Time: 30mins</p>
                </div>
              </div>
            `;
        }

        // Keeps a count of how many, we only want to display 9 items.
        if (homeRecipesElement && index < 9) {
            document.getElementById('home-recipes')!.innerHTML += `
              <div class="recipe-item">
                <span style="color: rgb(212, 42, 12)">
                  <i class="fa-solid fa-heart fa-lg"></i>
                </span>
                <img
                  src="./assets/images/${values.image}"
                  alt="Pizza"
                  class="recipe-item-image"
                />
                <div>
                  <h3>${values.name}</h3>
                  <p>Time: 30mins</p>
                </div>
              </div>
            `;
        }

        // Adding itteror count at the end -
        index++;
      }
      document.getElementById('loading-spinner')!.style.display = 'none';
    }
  })
  .catch((err) => {
    document.getElementById('loading-spinner')!.style.display = 'none';
    document.getElementById('all-recipes')!.innerHTML += `
      <h2>Sorry there has been an error fetching all recipes.</h2>
    `;
    console.error(err);
  });
