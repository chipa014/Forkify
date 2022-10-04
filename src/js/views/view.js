import icons from 'url:../../img/icons.svg';

export default class View {
  _parentElement;
  _data;
  _errorMessage = '';
  _message = '';

  /**
   * Renders the data in the parent element.
   * @param {Object} data
   */
  render(data) {
    // 1. Check if data is empty
    if (!data || (Array.isArray(data) && data.length === 0))
      throw new Error(this._errorMessage);

    // 2. Store it in the object instance
    this._data = data;

    // 3. Generate HTML for render
    const markup = this._generateMarkup();

    // 4. Render HTML in place of whatever was there
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Only rerenders elements that need rerendering.
   * If there is nothing rendered, use render method instead.
   * @param {Object} data
   */
  update(data) {
    // 1. Store new data in the object instance
    this._data = data;

    // 2. Generate a virtual DOM to compare to the current one
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // 3. Compare each element of virtual DOM and current DOM.
    // If they are different, transform the old one into the new one
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // No need to update if the element hasn't changed
      if (newEl.isEqualNode(curEl)) return;
      // Set attributes for changed elements
      Array.from(newEl.attributes).forEach(attr => {
        curEl.setAttribute(attr.name, attr.value);
      });
      //If the elements contains only text, then this text will be a string instead of node or element
      //We can compare it to null (or to empty string via trim()) to determine whether it's just text or an element
      if (newEl.firstChild?.nodeValue.trim() === '') return;
      curEl.textContent = newEl.textContent;
      //Then if it is just text, we update it
    });
  }

  /**
   * Renders a spinner in the parent element
   */
  renderSpinner() {
    const spinnerMarkup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarkup);
  }

  /**
   * Renders an error with a custom message in the parent element
   * @param {String} message  Message to display. This is set to View class's _errorMessage property by default
   */
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
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', errorMarkup);
  }

  /**
   * Renders a custom success message in the parent element
   * @param {String} message Message to display. This is set to View class's _message property by default
   */
  renderMessage(message = this._message) {
    const messageMarkup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', messageMarkup);
  }

  /**
   * A helper function that clears the parent element's insides
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Generates HTML markup to render. Defined in each child class separately.
   */
  _generateMarkup() {}
}
