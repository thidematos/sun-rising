'use strict';

const windDirection = document.querySelector('#windDirection');
const windSpeed = document.querySelector('#windSpeed');

const swellDirection = document.querySelector('#swellDirection');
const swellHeight = document.querySelector('#swellHeight');
const swellPeriod = document.querySelector('#swellPeriod');

const waveDirection = document.querySelector('#waveDirection');
const waveHeight = document.querySelector('#waveHeight');
const wavePeriod = document.querySelector('#wavePeriod');

const textsData = [windSpeed, swellHeight, swellPeriod, waveHeight, wavePeriod];

const imgDirections = [windDirection, swellDirection, waveDirection];

const slideContainer = [...document.querySelectorAll('.slide__container')];
const dateContainer = document.querySelector('.date__container');
const hourContainer = document.querySelector('.hour__container');
const dataContainer = document.querySelector('.data__container');
const containers = [hourContainer, dataContainer];

const beachLabel = document.querySelector('.beach__label');

class App {
  params =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,wavePeriod,windDirection,windSpeed';

  locations = [];

  dates;

  fetchedData;

  filteredData;

  currentData;

  keys = [
    'caa943a0-30c3-11ee-a26f-0242ac130002-caa9442c-30c3-11ee-a26f-0242ac130002',
    'aa9b916c-3253-11ee-a26f-0242ac130002-aa9b9220-3253-11ee-a26f-0242ac130002',
    '82dac57c-3266-11ee-8d52-0242ac130002-82dac626-3266-11ee-8d52-0242ac130002',
    'eb67d818-3276-11ee-8b7f-0242ac130002-eb67d8c2-3276-11ee-8b7f-0242ac130002',
    '53dc0b50-327a-11ee-a26f-0242ac130002-53dc0bb4-327a-11ee-a26f-0242ac130002',
    '0f6350ee-327c-11ee-8d52-0242ac130002-0f6351a2-327c-11ee-8d52-0242ac130002',
    'b0d00b46-327e-11ee-8b7f-0242ac130002-b0d00bb4-327e-11ee-8b7f-0242ac130002',
    '6b975d70-3280-11ee-8d52-0242ac130002-6b975e38-3280-11ee-8d52-0242ac130002',
    'b2899ba6-3282-11ee-86b2-0242ac130002-b2899c14-3282-11ee-86b2-0242ac130002',
    'ca13de20-3283-11ee-92e6-0242ac130002-ca13de84-3283-11ee-92e6-0242ac130002',
  ];

  map;

  constructor() {
    //First Locations
    this.#getFirstLocations();

    this.#showMap(this.locations[0].lat, this.locations[0].lng);

    //Render First Locations
    this.#renderLocalBtn(this.locations);

    //Add Event Listeners to Locations Btns
    slideContainer[0].addEventListener('click', this.#changePlace.bind(this));

    //Getting Time Stamp
    const dateStamps = this.#getTimeStamp();

    //Fetching the JSON

    this.#fetchJSON(
      this.locations[0].lat,
      this.locations[0].lng,
      this.#getLastStamp(dateStamps.at(-1)),
      this.#getFirstStamp()
    );
  }

  #changePlace(e) {
    if (!e.target.classList.contains('local__btn')) return;

    this.#toggleActiveLocation(e.target);

    const targetID = e.target.dataset.id;

    const targetLocation = this.locations.find((local) => {
      return local.id == targetID;
    });

    this.#fetchJSON(
      targetLocation.lat,
      targetLocation.lng,
      this.#getLastStamp(this.#getTimeStamp().at(-1)),
      this.#getFirstStamp()
    );

    beachLabel.textContent = targetLocation.beach;

    const dateTarget = this.dates[0].setHours(2);

    const dataTarget = this.filteredData.find((el) => {
      if (!el) return;
      return Number(new Date(el.time)) == dateTarget;
    });

    this.currentData = dataTarget;

    this.#renderData(dataTarget);
    this.#toggleActiveDate(document.querySelector('.date__btn'));

    this.#selectHour(dataTarget, document.querySelector('.hour__btn'));
  }

  #selectDate(e) {
    if (!e.target.classList.contains('date__btn')) return;

    this.#toggleActiveDate(e.target);
    this.#toggleActiveHour(document.querySelector('.hour__btn'));

    const dateTarget = new Date(Number(e.target.dataset.id));
    const fiveStamp = dateTarget.setHours(2);

    const dataTarget = this.filteredData.find((el) => {
      if (!el) return;
      return Number(new Date(el.time)) == fiveStamp;
    });

    this.currentData = dataTarget;

    this.#renderData(dataTarget);
  }

  #toggleActiveLocation(target) {
    const localBtns = document.querySelectorAll('.local__btn');

    localBtns.forEach((e) => e.classList.remove('btn--active'));
    target.classList.add('btn--active');
  }

  #toggleActiveDate(target) {
    const dateBtns = document.querySelectorAll('.date__btn');
    dateBtns.forEach((e) => e.classList.remove('btn--active'));
    target.classList.add('btn--active');
  }

  #toggleActiveHour(target) {
    const hourBtns = document.querySelectorAll('.hour__btn');
    hourBtns.forEach((e) => {
      e.classList.remove('btn--active');
    });
    target.classList.add('btn--active');
  }

  #selectHour(currentData, target) {
    this.#toggleActiveHour(target);

    const hour = Number(target.dataset.hour);
    const date = new Date(currentData.time);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const completeDate = Number(new Date(year, month, day, hour));

    const data = this.filteredData.find((e) => {
      const dateStamp = new Date(e.time);
      return Number(dateStamp) == completeDate;
    });

    this.#renderData(data);
    this.currentData = data;
  }

  #getFirstLocations() {
    const praiaGrande = new Location(
      'Ubatuba',
      'Praia Grande',
      -23.46762694750624,
      -45.06052141083771,
      this.#generateID()
    );

    const itamambuca = new Location(
      'Ubatuba',
      'Itamambuca',
      -23.401585219123987,
      -45.00052365624933,
      this.#generateID()
    );

    const vdc = new Location(
      'Ubatuba',
      'Vermelha do Centro',
      -23.463324300186976,
      -45.04887262645799,
      this.#generateID()
    );

    const vdn = new Location(
      'Ubatuba',
      'Vermelha do Norte',
      -23.416431201686468,
      -45.03605443102206,
      this.#generateID()
    );

    [praiaGrande, itamambuca, vdc, vdn].forEach((e) => this.locations.push(e));

    return this.locations;
  }

  #getTimeStamp() {
    const now = new Date();

    const future = [];

    const dateContainer = document.querySelector('.date__container');

    for (let i = 0; i <= 4; i++) {
      future.push(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
      );
    }

    //Setting DATE BUTTONS
    future.forEach((e) => {
      const html = `
      <li class="date__btn" data-id='${Number(e)}'>${String(
        e.getDate()
      ).padStart(2, '0')}/${String(e.getMonth() + 1).padStart(2, '0')}/${String(
        e.getFullYear()
      ).slice(-2)}</li>
      `;

      dateContainer.insertAdjacentHTML('beforeend', html);
    });

    this.dates = future;

    const futureStamp = future.map((e) => Number(e));

    return futureStamp;
  }

  #getFirstStamp() {
    return Number(new Date().setHours(0));
  }

  #getLastStamp(endStamp) {
    return new Date(endStamp).setHours(23);
  }

  #getThreeInThreeTime(dates) {
    const newDates = [];

    dates.forEach((e) => {
      for (let i = 2; i <= 17; i += 3) {
        e.setHours(i);

        newDates.push(Number(e));
      }
    });

    return newDates;
  }

  #filterTidesData(json) {
    if (!json) return;

    const times = this.#getThreeInThreeTime(this.dates);

    const filteredData = [];

    times.forEach((time) => {
      const finded = this.fetchedData.find((e) => {
        const converted = new Date(e.time);
        return Number(converted) === time;
      });

      filteredData.push(finded);
    });

    this.filteredData = filteredData;
  }

  #renderLocalBtn(locationsArr) {
    locationsArr.forEach((el, i) => {
      const html = `
      <button class="local__btn ${i === 0 ? 'btn--active' : ''}" data-id='${
        el.id
      }'>${el.beach}</button>
      `;

      slideContainer.at(-1).insertAdjacentHTML('beforeend', html);
    });
  }

  #renderData(dataTarget) {
    containers.forEach((e) => {
      e.classList.remove('hidden');
      e.classList.add('flex');
    });

    textsData.forEach((e) => {
      e.textContent = dataTarget[e.id].icon;
    });

    imgDirections.forEach((e) => {
      const deg = Math.trunc(Number(dataTarget[e.id].icon));
      e.style.transform = `rotate(${deg}deg)`;
      e.src = '../assets/arrow.png';
    });
  }

  #generateID() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  #showMap(lat, lng) {
    this.map = L.map('map').setView([lat, lng], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.#addMarkerMap(lat, lng, 'oi');
  }

  #addMarkerMap(lat, lng, description) {
    const popup = L.popup([lat, lng], {
      content: `${description}`,
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: 'popup',
    }).openOn(this.map);
  }

  #buildURL(lat, lng, params, end, start) {
    return `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&start=${start}&end=${end}`;
  }

  #fetchJSON(
    lat,
    lng,
    endTimeStamp,
    startStamp,
    errorMsg = 'Something went wrong'
  ) {
    const url = this.#buildURL(
      lat,
      lng,

      this.params,
      endTimeStamp,
      startStamp
    );

    fetch(url, {
      headers: {
        Authorization: this.keys[9],
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(errorMsg);

        return response.json();
      })
      .then((data) => {
        this.fetchedData = data.hours;
        console.log(data);

        //Filtering DATA
        this.#filterTidesData(this.fetchedData);

        //Listening to Date Container

        dateContainer.addEventListener('click', this.#selectDate.bind(this));
        hourContainer.addEventListener('click', (e) => {
          if (!e.target.classList.contains('hour__btn')) return;

          this.#selectHour(this.currentData, e.target);
        });
      });
  }
}

const app = new App();

document.querySelector('.newLocation__btn').addEventListener('click', () => {});
