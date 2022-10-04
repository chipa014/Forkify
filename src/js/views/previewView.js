import View from './view.js';
import icons from 'url:../../img/icons.svg';

// A helper parent class combining common methods from bookmarksView and searchResultsView
export default class PreviewView extends View {
  _generateMarkup() {
    // It's written this way because multiple recipes are rendered next to each other
    return this._data.map(this._generateMarkupPreview).join('');
  }

  /**
   * Helper function for render
   * @param {Object} recipe
   * @returns HTML markup for recipe preview
   */
  _generateMarkupPreview(recipe) {
    const currentId = window.location.hash.slice(1);
    return `
      <li class="preview">
        <a class="preview__link ${
          currentId === recipe.id ? 'preview__link--active' : ''
        }" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.imageUrl}" alt="${recipe.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
            <div class="preview__user-generated ${recipe.key ? '' : 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>`;
  }
}
