import View from './view.js';
import icons from 'url:../../img/icons.svg';
import { MODAL_MESSAGE_DISPLAY_TIME, MODAL_FADEOUT } from '../config.js';

const emptyFormMarkup = `
  <div class="upload__column upload__column__info">
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

  <div class="upload__column upload__column__ingredients">
    <h3 class="upload__heading">Ingredients</h3>
    <label>Ingredient 1</label>
    <input
      value="4"
      type="text"
      name="ingredient-quantity-1"
      placeholder="Quantity"
    />
    <input
      value="slice"
      type="text"
      name="ingredient-unit-1"
      placeholder="Unit"
    />
    <input
      value="white bread"
      type="text"
      name="ingredient-description-1"
      placeholder="Description"
    />
    <label>Ingredient 2</label>
    <input
      value="3"
      type="text"
      name="ingredient-quantity-2"
      placeholder="Quantity"
    />
    <input
      value="tablespoon"
      type="text"
      name="ingredient-unit-2"
      placeholder="Unit"
    />
    <input
      value="butter"
      type="text"
      name="ingredient-description-2"
      placeholder="Description"
    />
    <label>Ingredient 3</label>
    <input
      value="2"
      type="text"
      name="ingredient-quantity-3"
      placeholder="Quantity"
    />
    <input
      value="slice"
      type="text"
      name="ingredient-unit-3"
      placeholder="Unit"
    />
    <input
      value="cheddar cheese"
      type="text"
      name="ingredient-description-3"
      placeholder="Description"
    />
    <label>Ingredient 4</label>
    <input
      type="text"
      name="ingredient-quantity-4"
      placeholder="Quantity"
    />
    <input
      type="text"
      name="ingredient-unit-4"
      placeholder="Unit"
    />
    <input
      type="text"
      name="ingredient-description-4"
      placeholder="Description"
    />
    <label>Ingredient 5</label>
    <input
      type="text"
      name="ingredient-quantity-5"
      placeholder="Quantity"
    />
    <input
      type="text"
      name="ingredient-unit-5"
      placeholder="Unit"
    />
    <input
      type="text"
      name="ingredient-description-5"
      placeholder="Description"
    />
    <label>Ingredient 6</label>
    <input
      type="text"
      name="ingredient-quantity-6"
      placeholder="Quantity"
    />
    <input
      type="text"
      name="ingredient-unit-6"
      placeholder="Unit"
    />
    <input
      type="text"
      name="ingredient-description-6"
      placeholder="Description"
    />
  </div>

  <button class="btn upload__btn">
    <svg>
      <use href="${icons}#icon-upload-cloud"></use>
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
  _errorMessage = 'Something went wrong. Please try again.';

  // Explanation in _addHandlerOpenWindow
  constructor() {
    super();
    this._addHandlerOpenWindow();
    this._resetForm();
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

  renderError(message = this._errorMessage) {
    const errorMarkup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._parentElement.querySelectorAll('.error').forEach(el => el.remove());
    this._parentElement.querySelectorAll('.spinner').forEach(el => el.remove());
    this._parentElement.insertAdjacentHTML('beforeend', errorMarkup);
  }

  renderSpinner() {
    const spinnerMarkup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._parentElement.querySelectorAll('.error').forEach(el => el.remove());
    this._parentElement.insertAdjacentHTML('beforeend', spinnerMarkup);
  }
}

export default new AddRecipeView();
