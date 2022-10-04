import View from './view.js';
import icons from 'url:../../img/icons.svg';
import { MODAL_MESSAGE_DISPLAY_TIME, MODAL_FADEOUT } from '../config.js';

// TO DO:
// Explain errors
// Do proper ingredient fields
// Don't call successful recipe if it is not successful
const emptyFormMarkup = `
<div class="upload__column">
<h3 class="upload__heading">Recipe data</h3>
<label>Title</label>
<input
  value="Classic Cheese Sandwhich"
  required
  name="title"
  type="text"
/>
<label>URL</label>
<input
  value="https://www.allrecipes.com/recipe/23891/grilled-cheese-sandwich/"
  required
  name="sourceUrl"
  type="text"
/>
<label>Image URL</label>
<input
  value="https://www.allrecipes.com/thmb/_LWAiEjctfCof1OIDvp-IbO5xrQ=/2250x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/23891-grilled-cheese-sandwich-molly-1x1-1-b241c5d092c54aafa2d81cdd4e5a8e07.jpg"
  required
  name="image"
  type="text"
/>
<label>Publisher</label>
<input value="Allrecipes" required name="publisher" type="text" />
<label>Prep time</label>
<input value="20" required name="cookingTime" type="number" />
<label>Servings</label>
<input value="2" required name="servings" type="number" />
</div>

<div class="upload__column">
<h3 class="upload__heading">Ingredients</h3>
<label>Ingredient 1</label>
<input
  value="4,slices,white bread"
  type="text"
  required
  name="ingredient-1"
  placeholder="Format: 'Quantity,Unit,Description'"
/>
<label>Ingredient 2</label>
<input
  value="3,tablespoons,butter"
  type="text"
  name="ingredient-2"
  placeholder="Format: 'Quantity,Unit,Description'"
/>
<label>Ingredient 3</label>
<input
  value="2,slices,cheddar cheese"
  type="text"
  name="ingredient-3"
  placeholder="Format: 'Quantity,Unit,Description'"
/>
<label>Ingredient 4</label>
<input
  type="text"
  name="ingredient-4"
  placeholder="Format: 'Quantity,Unit,Description'"
/>
<label>Ingredient 5</label>
<input
  type="text"
  name="ingredient-5"
  placeholder="Format: 'Quantity,Unit,Description'"
/>
<label>Ingredient 6</label>
<input
  type="text"
  name="ingredient-6"
  placeholder="Format: 'Quantity,Unit,Description'"
/>
</div>

<button class="btn upload__btn">
<svg>
  <use href="src/img/icons.svg#icon-upload-cloud"></use>
</svg>
<span>Upload</span>
</button>`;

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal ');

  _message = 'Success!';

  // Explanation in _addHandlerOpenWindow
  constructor() {
    super();
    this._addHandlerOpenWindow();
  }

  /**
   * Resets the modal window content to empty form
   */
  _resetForm() {
    this._closeWindow();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', emptyFormMarkup);
  }

  /**
   * Open modal window
   */
  _openWindow() {
    this._window.classList.remove('hidden');
    this._overlay.classList.remove('hidden');
  }

  /**
   * Closes modal window
   */
  _closeWindow() {
    this._window.classList.add('hidden');
    this._overlay.classList.add('hidden');
  }

  /**
   * Helper function to help close window on Esc keypress
   * @param {*} e Event coming from DOM
   */
  _closeWindowKeydown(e) {
    if (e.key !== 'Escape') return;
    this.closeWindow();
  }

  /**
   * Event listener initialisation
   * Everything in this function happens within view, no need to involve the controller
   * So we call it when the AddRecipeView instance is created instead
   */
  _addHandlerOpenWindow() {
    this._btnOpen.addEventListener('click', this._openWindow.bind(this));
    this._btnClose.addEventListener('click', this._closeWindow.bind(this));
    this._overlay.addEventListener('click', this._closeWindow.bind(this));
    document.addEventListener('keydown', this._closeWindowKeydown.bind(this));
  }

  /**
   * Publisher-subscriber way of adding eventListeners.
   * @param {Function} handler A function tied to the eventListener.
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      // Prevent form submission from realoding the page
      e.preventDefault();
      console.log(new FormData(this));
      // This puts all the data from the form into a weird FormData object that we then destructure into an array and eventually into a recipe object
      const dataArray = [...new FormData(this)];
      const recipe = Object.fromEntries(dataArray);
      handler(recipe);
    });
  }

  /**
   * Called when user successfully uploads a recipe
   * Briefly shows a success message before closing the modal window
   */
  successfulUpload() {
    this.renderMessage();
    setTimeout(this._closeWindow.bind(this), MODAL_MESSAGE_DISPLAY_TIME);
    setTimeout(
      this._resetForm.bind(this),
      MODAL_MESSAGE_DISPLAY_TIME + MODAL_FADEOUT
    );
  }
}

export default new AddRecipeView();
