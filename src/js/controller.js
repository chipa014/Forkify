import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchBarView from './views/searchBarView.js';
import searchResultsView from './views/searchResultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';

/**
 * Control part of displaying the recipe
 */
const controlRecipe = async function () {
  try {
    // 1. Get recipe id from hash in the url
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 2. Render a spinner while the recipe loads
    recipeView.renderSpinner();

    // 3. Update search results page and bookmarks to mark the selected result
    searchResultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 4. Load the recipe
    await model.loadRecipe(id);

    // 5. Render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

/**
 * Control part of displaying the search results
 */
const controlSearchResults = async function () {
  try {
    // 1. Read query
    const query = searchBarView.getQuery();
    if (!query) return;

    // 2. Render a spinner while the results load
    searchResultsView.renderSpinner();

    // 3. Load query results from API
    await model.loadSearchResults(query);

    // 4. Render search results
    searchResultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    searchResultsView.renderError();
  }
};

/**
 * Control part of pagination system for search results
 * @param {Number} newPage The number of page to render
 */
const controlPagination = function (newPage) {
  // 1. Render the new page
  searchResultsView.render(model.getSearchResultsPage(newPage));

  // 2. Render new pagination buttons
  paginationView.render(model.state.search);
};

/**
 * Control part of servings functionality
 * @param {*} newServingsNum The number of servings to render ingredient amounts for
 */
const controlServings = function (newServingsNum) {
  // 0. Check for adequate number of servings
  if (newServingsNum <= 0) return;
  // 1. Update servings in state
  model.changeServings(newServingsNum);
  // 2. Update servings in view
  recipeView.update(model.state.recipe);
};

/**
 * Control part of bookmark button in the recipe part
 */

const controlToggleBookmark = function () {
  try {
    // 1. Add/remove bookmark in model
    model.toggleBookmark(model.state.recipe);

    // 2. Update recipe view
    recipeView.update(model.state.recipe);

    // 3. Render bookmarks
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    bookmarksView.renderError(err.message);
  }
};

/**
 * Rerenders bookmarks menu on load
 */
const controlBookmarks = function () {
  try {
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    bookmarksView.renderError(err.message);
  }
};

/**
 * Control part of adding custom recipes
 * @param {Object} newRecipe Object containing recipe data for the uploaded recipe
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    // 1. Render a spinner while the recipe uploads
    addRecipeView.renderSpinner();

    // 2. Upload the recipe and put it in state
    await model.uploadRecipe(newRecipe);

    // 3. Render the recipe
    recipeView.render(model.state.recipe);

    // 4. Show a success message, close the modal
    addRecipeView.successfulUpload();

    // 5. Rerender bookmarks (Custom recipes are bookmarked automatically)
    bookmarksView.render(model.state.bookmarks);

    // 6. Update hash in url to current recipe
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    console.error(err.message);
    addRecipeView.renderError(err.message);
  }
};

/**
 * Publisher-subscriber initiation of event listeners
 */
const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerToggleBookmark(controlToggleBookmark);
  searchBarView.addHandlerSearchBar(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
