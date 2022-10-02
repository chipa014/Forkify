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

const recipeContainer = document.querySelector('.recipe');
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update search results page and bookmarks to mark the selected result
    searchResultsView.update(model.getSearchResultsPage());
    console.log('hi');
    bookmarksView.update(model.state.bookmarks);
    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err.message);
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Read query
    const query = searchBarView.getQuery();
    if (!query) return;
    searchResultsView.renderSpinner();

    // 2) Load query results from API
    await model.loadSearchResults(query);
    // 3) Render search results
    const recipes = model.state.search.results;
    searchResultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    searchResultsView.renderError();
  }
};

const controlPagination = function (newPage) {
  searchResultsView.render(model.getSearchResultsPage(newPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServingsNum) {
  if (newServingsNum <= 0) return;
  // 1) Update servings in state
  model.changeServings(newServingsNum);
  // 2) Update servings in view
  recipeView.update(model.state.recipe);
};

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

const controlBookmarks = function () {
  try {
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    bookmarksView.renderError(err.message);
  }
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    const log = await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.successfulUpload();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError();
  }
};

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
