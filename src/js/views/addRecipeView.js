import View from './view.js';
import icons from 'url:../../img/icons.svg';
import { MODAL_CLOSE_TIME } from '../config.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal ');

  _message = 'Success!';

  constructor() {
    super();
    this._addHandlerOpenWindow();
  }

  _openWindow() {
    this._window.classList.remove('hidden');
    this._overlay.classList.remove('hidden');
  }

  _closeWindow() {
    this._window.classList.add('hidden');
    this._overlay.classList.add('hidden');
  }

  _closeWindowKeydown(e) {
    if (e.key !== 'Escape') return;
    this.closeWindow();
  }

  _addHandlerOpenWindow() {
    this._btnOpen.addEventListener('click', this._openWindow.bind(this));
    this._btnClose.addEventListener('click', this._closeWindow.bind(this));
    this._overlay.addEventListener('click', this._closeWindow.bind(this));
    document.addEventListener('keydown', this._closeWindowKeydown.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);

      const recipe = data;
      handler(recipe);
    });
  }

  successfulUpload() {
    this.renderMessage();
    setTimeout(this._closeWindow.bind(this), MODAL_CLOSE_TIME);
  }
}

export default new AddRecipeView();
