import View from './view.js';
import icons from 'url:../../img/icons.svg';
import { RESULTS_PER_PAGE } from '../config.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    // 1. Define helper boolean constants
    // If the page is last, no 'next page' button should be rendered
    const isLast =
      this._data.currentPage ===
      Math.ceil(this._data.results.length / RESULTS_PER_PAGE);
    return `
      ${
        // 'Previous page' button is rendered only if the user's not on the first page
        // onlyPage is redundant but kept for more readable code
        this._data.currentPage == 1 //|| onlyPage
          ? ''
          : `<button data-goto="${
              this._data.currentPage - 1
            }" class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${this._data.currentPage - 1}</span>
            </button>`
      }
      ${
        // 'Next page' button is rendered only if user's not on the last page
        //onlyPage || isLast
        isLast
          ? ''
          : `<button data-goto="${
              this._data.currentPage + 1
            }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
      }`;
  }

  /**
   * Publisher-subscriber way of adding eventListeners.
   * @param {Function} handler A function tied to the eventListener.
   */
  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }
}

export default new PaginationView();
