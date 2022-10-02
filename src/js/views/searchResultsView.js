import icons from 'url:../../img/icons.svg';
import PreviewView from './previewView.js';

class SearchResultsView extends PreviewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = `Couldn't find recipes matching your search. Sorry! Please try something else.`;
}

export default new SearchResultsView();
