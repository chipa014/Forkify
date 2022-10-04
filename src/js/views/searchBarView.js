class SearchBarView {
  _parentElement = document.querySelector('.search');

  /**
   * A helper function to get the query to the controller.
   * @returns Query contained in the searchbar element
   */
  getQuery() {
    return this._parentElement.querySelector('.search__field').value;
  }

  /**
   * Publisher-subscriber way of adding eventListeners.
   * @param {Function} handler A function tied to the eventListener.
   */
  addHandlerSearchBar(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      // Prevent form submission from reloading the page
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchBarView();
