import { async } from 'regenerator-runtime';
import { API_URL, DEV_KEY, RESULTS_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    currentPage: 1,
  },
  bookmarks: [],
};

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
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const recipeData = await getJSON(`${API_URL}/${id}?key=${DEV_KEY}`);
    state.recipe = apiToAppReformat(recipeData);
    state.recipe.bookmarked = state.bookmarks.some(el => el.id === id); //Booleans
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    state.search.currentPage = 1;
    const data = await getJSON(`${API_URL}?search=${query}&key=${DEV_KEY}`);
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

export const getSearchResultsPage = function (
  pageNum = state.search.currentPage
) {
  state.search.currentPage = pageNum;
  const start = (pageNum - 1) * RESULTS_PER_PAGE;
  const end = pageNum * RESULTS_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const changeServings = function (
  newServingsNum = state.recipe.servings
) {
  state.recipe.ingredients.forEach(ingr => {
    ingr.quantity = (ingr.quantity * newServingsNum) / state.recipe.servings;
  });
  state.recipe.servings = newServingsNum;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const toggleBookmark = function (recipe) {
  //Add/remove bookmark
  const index = state.bookmarks.findIndex(el => el.id === recipe.id);
  index === -1
    ? state.bookmarks.push(recipe)
    : state.bookmarks.splice(index, 1);
  //Mark current recipe as (not) bookmarked
  if (recipe.id === state.recipe.id)
    state.recipe.bookmarked = !state.recipe.bookmarked;
  //Save bookmarks array to local storage
  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(el => el[0].startsWith('ingredient') && el[1] !== '')
      .map(el => {
        const ingArr = ([quantity, unit, description] = el[1].split(',')).map(
          el => el.trim()
        );
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format');
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      ingredients,
    };
    const data = await sendJSON(`${API_URL}?key=${DEV_KEY}`, recipe);
    const newRecipeFromAPI = apiToAppReformat(data);
    state.recipe = newRecipeFromAPI;
    toggleBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
