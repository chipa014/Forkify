import { resolve } from 'mathjs';
import { async } from 'regenerator-runtime';
import { API_URL, DEV_KEY, RESULTS_PER_PAGE } from './config.js';
import { deleteJSON, getJSON, sendJSON } from './helpers.js';

//TO DO:
//Do we need state.search.query? If not, remove it.

/**
 * State contains current info to be displayed
 */
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    currentPage: 1,
  },
  bookmarks: [],
};

/**
 * A helper function for renaming some of the fields to fit JavaScript naming conventions
 * @param {Object} recipeData Object received from the API that contains recipe data
 * @returns Object with recipe data reformatted for the purposes of more readable code
 */

const apiToAppReformat = function (recipeData) {
  const { recipe } = recipeData.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    publisher: recipe.publisher,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    imageUrl: recipe.image_url,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    /*If recipe.key exists, this is equivalent to
        key: recipe.key
      Otherwise this is an empty expression that doesn't leave an undefined key field
    */
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * This loads the recipe from the API and puts it in state.
 * @param {String} id ID of the recipe to be loaded
 */
export const loadRecipe = async function (id) {
  try {
    // 1. Get data from the API
    const recipeData = await getJSON(`${API_URL}/${id}?key=${DEV_KEY}`);

    // 2. Put in in state
    state.recipe = apiToAppReformat(recipeData);

    // 3. Check for the recipe in bookmarks array and update the state accordingly
    state.recipe.bookmarked = state.bookmarks.some(el => el.id === id); //Booleans
  } catch (err) {
    throw err;
  }
};

/**
 * This loads the search results from the API
 * @param {String} query Self-explanatory
 */
export const loadSearchResults = async function (query) {
  try {
    // 1. Setup state for proper render
    state.search.query = query;
    state.search.currentPage = 1;

    // 2. Get data from API. Dev key allows for custom recipes to show up in the search
    const data = await getJSON(`${API_URL}?search=${query}&key=${DEV_KEY}`);

    // 3. Put preview info in the results. This doesn't need as much as the full recipe info.
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        publisher: recipe.publisher,
        imageUrl: recipe.image_url,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

/**
 * A helper function for proper render of paginated results.
 * @param {Number} pageNum The number of the page that controller needs to display
 * @returns The array of results from page number pageNum
 */
export const getSearchResultsPage = function (
  pageNum = state.search.currentPage
) {
  // 1. Update state
  state.search.currentPage = pageNum;

  // 2. Count the slice borders
  const start = (pageNum - 1) * RESULTS_PER_PAGE;
  const end = pageNum * RESULTS_PER_PAGE;

  // 3. Slice the results array
  return state.search.results.slice(start, end);
};

/**
 * Calculates the quantity of ingredients needed for requested amount of servings
 * @param {Number} newServingsNum Requested amount of servings
 */
export const changeServings = function (
  newServingsNum = state.recipe.servings
) {
  // 1. Recalculate the quantity for each ingredient and update it in state
  state.recipe.ingredients.forEach(ingr => {
    ingr.quantity = (ingr.quantity * newServingsNum) / state.recipe.servings;
  });

  // 2. Update the servings amount in state
  state.recipe.servings = newServingsNum;
};

/**
 * A helper function to save bookmarks to local storage
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * A helper function to load bookmarks from local storage
 */
const loadBookmarks = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

/**
 * A helper function that clears bookmarks stored in local storage.
 * Developer use only.
 */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

/**
 * Toggles the bookmark on a ceratin recipe
 * @param {Object} recipe The recipe object whose bookmark the controller needs toggled
 */
export const toggleBookmark = function (recipe) {
  // 1. Add/remove bookmark
  const index = state.bookmarks.findIndex(el => el.id === recipe.id);
  index === -1
    ? state.bookmarks.push(recipe)
    : state.bookmarks.splice(index, 1);

  // 2. Mark current recipe as (not) bookmarked
  if (recipe.id === state.recipe.id)
    state.recipe.bookmarked = !state.recipe.bookmarked;

  // 3. Save modified bookmarks array to local storage
  persistBookmarks();
};

/**
 * Uploads a custom recipe submitted by the user to the API
 * @param {Object} newRecipe The recipe object being uploaded
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    // 1. Transform ingredients to proper format
    // 1a. From the recipe object make an array of its properties
    // Field 'a: b' will transform into elements [a, b]
    const ingredients = Object.entries(newRecipe)
      // 1b. We only want ingredient fields (i.e. the ones that start with 'ingredient')
      .filter(
        el => el[0].toLowerCase().startsWith('ingredient') && el[1] !== ''
      )
      // 1c. The value of each field is a string 'quantity,unit,description'
      // We want to split it into separate values
      .map(el => {
        const ingArr = ([quantity, unit, description] = el[1].split(',')).map(
          el => el.trim()
        );
        // The resulting array should contain exactly quantity, unit and description
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format');
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    // 2. Reformat the newRecipe object to fit API's format
    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      ingredients,
    };

    // 3. Send the recipe to the API and await its answer (in particular, the recipe's ID)
    const data = await sendJSON(`${API_URL}?key=${DEV_KEY}`, recipe);

    // 4. Put the recipe in state for proper display
    const newRecipeFromAPI = apiToAppReformat(data);
    state.recipe = newRecipeFromAPI;

    // 5. All custom recipes are bookmarked by default
    toggleBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

/**
 * Helper function. Deletes the recipe from the API.
 * Developer use only.
 * @param {String} id ID of the recipe to be deleted
 */
const deleteRecipe = async function (id) {
  try {
    // 1. Look up the id in the bookmarks. If it is there, delete it.
    const index = state.bookmarks.findIndex(el => el.id === id);
    if (index !== -1) state.bookmarks.splice(index, 1);

    // 2. Delete it from the API. If it doesn't exists, it will throw an error.
    // It's a developer-only tool for cleanup. The error has no consequences. We'll survive.
    await deleteJSON(`${API_URL}/${id}?key=${DEV_KEY}`);
  } catch (err) {
    console.error(`${err.message} 😀`);
  }
};

const init = function () {
  loadBookmarks();
};

init();
