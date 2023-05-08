import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import PixabayApiService from './js/pixabay-service';
import LoadMoreBtn from './js/load-more-btn';

// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('search-btn'),
  galleryCards: document.querySelector('.gallery'),
  body: document.querySelector('body'),
};
refs.body.style.backgroundColor = '#e2e0dc';

const pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
loadMoreBtn.refs.button.hidden = true;

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetnchArticles);

function onSearch(event) {
  event.preventDefault();

  pixabayApiService.query = event.currentTarget.elements.query.value;
  clearArticlesContainer();

  if (pixabayApiService.query === '') {
    Notify.info('Please, write something...');
  } else {
    clearArticlesContainer();

    loadMoreBtn.Show();
    pixabayApiService.resetPage();
    loadMoreBtn.refs.button.hidden = false;
    Notify.success('Here are the images we were able to find!');
    fetnchArticles();
  }
}

async function fetnchArticles() {
  Loading.standard('Loading...');
  loadMoreBtn.disable();
  try {
    const hits = await pixabayApiService.fetchArticles(
      pixabayApiService.query,
      pixabayApiService.page,
      pixabayApiService.per_page
    );
    createGalleryMarkup(hits);
    if (hits.length < pixabayApiService.per_page) {
      loadMoreBtn.refs.button.hidden = true;
      Notify.info("We're sorry, but youve reached the end of search results.");
    }
    console.log(hits);
  } catch (error) {
    console.error(error);
    Notify.failure('Unable to fetch articles. Please try again.');
  }
  loadMoreBtn.enable();
  Loading.remove();
}

function createGalleryMarkup(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img
          class="photo-card__img"
          src="${largeImageURL}" 
          alt="${tags}" 
          loading="lazy" 
          width="320"
          height="212"
        />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span>${likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span>${views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span>${comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span>${downloads}</span>
        </p>
      </div>
    </div>
    `;
      }
    )
    .join('');

  refs.galleryCards.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

function clearArticlesContainer() {
  refs.galleryCards.innerHTML = '';
}

var gallery = new SimpleLightbox('.gallery a', {
  /* options */
});
