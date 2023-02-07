import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

const clearItem = item => (item.innerHTML = '');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const value = input.value.trim();
  if (!value) {
    clearItem(listRef);
    clearItem(countryInfoRef);
    return;
  }

  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        clearItem(listRef);
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      markupRender(data);
    })

    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      return;
    });
}

function markupRender(data) {
  if (data.length === 1) {
    clearItem(listRef);
    clearItem(countryInfoRef);
    const item = createItem(data);
    countryInfoRef.insertAdjacentHTML('beforeend', item);
  } else {
    clearItem(listRef);
    clearItem(countryInfoRef);
    const list = createList(data);
    listRef.insertAdjacentHTML('beforeend', list);
  }
}

function createItem(data) {
  return data.map(({ name, capital, population, flags, languages }) => {
    return `<h1 class='country-info__title'><img src='${flags.svg}' alt='${
      name.official
    }' width='50'/>${name.official}</h1>
        <p class='country-info__name'>Capital: <span>${capital[0]}</span></p>
        <p class='country-info__name'>Population: <span>${population}</span></p>
        <p class='country-info__name'>Languages: <span>${Object.values(
          languages
        )}</span></p>`;
  });
}

function createList(data) {
  return data
    .map(({ name, flags }) => {
      return `<li class='country-list__item'>
<img src='${flags.png}' alt='${name.common}' width='50'>${name.common}
</li>`;
    })
    .join('');
}
