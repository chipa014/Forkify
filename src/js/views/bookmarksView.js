import PreviewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it 😉`;

  /**
   * Publisher-subscriber way of adding eventListeners.
   * @param {Function} handler A function tied to the eventListener.
   */
  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
