import View from './view.js';
import icons from 'url:../../img/icons.svg';
import { RESULTS_PER_PAGE } from '../config.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const onlyPage = this._data.results.length <= 9;
    const isLast =
      this._data.currentPage ===
      Math.ceil(this._data.results.length / RESULTS_PER_PAGE);
    return `
      ${
        this._data.currentPage == 1 || onlyPage
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
        onlyPage || isLast
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

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }
}

export default new PaginationView();
