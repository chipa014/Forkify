class SearchBarView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    return this._parentElement.querySelector('.search__field').value;
  }

  addHandlerSearchBar(handler) {
    // ['submit'].forEach(event =>
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
    // );
  }
}

export default new SearchBarView();
