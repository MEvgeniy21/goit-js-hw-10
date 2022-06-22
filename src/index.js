import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const search = event.target.value.trim().toLowerCase();
  markupReset();
  if (!search.length) {
    return;
  }
  if (search.length === 1) {
    Notify.info('Enter more characters to search');
    // console.log('Enter more characters to search');
    return;
  }

  fetchCountries(search)
    .then(data => {
      if (data.length > 9) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        // console.log(
        //   'Too many matches found. Please enter a more specific name.'
        // );
        return;
      }
      if (data.length === 1) {
        markupCountry(data[0]);
        return;
      }
      markupList(data);
    })
    .catch(error => {
      Notify.failure(`Oops, there is no country with that name`);
      //   console.log(error);
    });
}

function markupCountry({ name, capital, population, flags, languages }) {
  refs.info.innerHTML = `<div>
  <img src="${flags.svg}" alt="${name.official} flag" width="50" height="30">
  <h1>${name.official}</h1>
  </div>
  <p><span>Capital: </span>${capital[0]}</p>
  <p><span>Population: </span>${population}</p>
  <p><span>Languages: </span>${Object.values(languages).join(', ')}</p>`;

  refs.info.firstElementChild.style.display = 'flex';
  refs.info.firstElementChild.style.alignItems = 'center';
  refs.info.firstElementChild.firstElementChild.style.marginRight = '20px';
  refs.info.querySelectorAll('p').forEach(el => {
    el.style.fontSize = '20px';
    el.firstElementChild.style.fontWeight = 'bold';
  });
}

function markupReset() {
  refs.info.innerHTML = '';
  refs.list.innerHTML = '';
}

function markupList(arrayCountry) {
  arrayCountry.map(el => {
    const markup = `<li>
  <img src="${el.flags.svg}" alt="${el.name.official} flag" width="50" height="30">
  <p>${el.name.official}</p>
  </li>`;
    refs.list.insertAdjacentHTML('beforeend', markup);
  });

  refs.list.style.listStyle = 'none';
  refs.list.style.padding = '0px';
  refs.list.querySelectorAll('li').forEach(el => {
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.lineHeight = '0px';
    el.firstElementChild.style.marginRight = '10px';
    el.lastElementChild.style.fontSize = '20px';
  });
}
