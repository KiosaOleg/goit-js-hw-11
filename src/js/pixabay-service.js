import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const API_KEY = '29995763-d0c8565eeb7c62036a35192df';
const BASE_URL = 'https://pixabay.com/api';

const instance = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  },
});

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchArticles(searchQuery, page, per_page) {
    try {
      const response = await instance.get('', {
        params: {
          q: searchQuery,
          page,
          per_page,
        },
      });

      const { hits, totalHits } = response.data;
      this.incrementPage();
      // if (!hits.length) {
      //   Notify.failure('Sorry. Please try again.');
      //   return [];
      // }
      // console.log(hits);

      return hits;
    } catch (error) {
      console.error(error);
      throw new Error('Unable to fetch articles.');
    }
  }

  // fetchArticles() {
  //   const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&
  //   page=${this.page}&per_page=${this.per_page}`;

  //   return fetch(url)
  //     .then(response => response.json())
  //     .then(({ hits, totalHits }) => {
  //       if (!hits.length) {
  //         return Notify.failure('Sorry. Please try again.');
  //       }
  //       this.incrementPage();

  //       return hits;
  //     });
  // }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    return (this.searchQuery = newQuery);
  }
}
