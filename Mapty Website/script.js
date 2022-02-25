'use strict';

// learn more about/ recap on bind and destructuring
// and spread operator e.g.
//  const validInputs = function(...inputs){ // spread operator
//       return inputs.every(function(inp){
//         return Number.isFinite(inp);
//       })
//     }

// *****everytime we call a function without()
// e.g. this._newWorkout and it uses this keyword inside,
// we need to bind it. e.g. this._newWorkout.bind(this)
// bind when we call functions without () and this is used inside that function

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type'); // for switching between running or cycling
const inputDistance = document.querySelector('.form__input--distance'); // 4 entries for user to key in
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  // any object should have some kind of unique identifier
  // so taht we can use array methods to find() it later

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  // we will never directly create a workout
  // instead we create either a running or cycling object

  // added on at later stage for the insert html section
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace(); // initialise this.pace
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    // same as doing this.type = cycling
    this.calcSpeed(); // initialise this.speed
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #map;
  // part of library, map variable in map.on()
  // so we can access the map object outside of the geolocation function
  #eMap; // assign eMap = e so we can access clicks on the map in map.on()

  #workouts = []; // so that we can.push() new workout objects into here

  constructor() {
    // constructor method is called immediately when a new object is created from this class

    this._getPosition(); // so  map will load as soon as page loads
    // we also want EventListeners to be set right at the beginning

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);

    // event listener add at the beginning
    // the marker doesnt exist yet so we add it in the parent element
    // which is container workouts

    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

    // Get data from local storage
    this._getLocalStorage();
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), // take note

        function () {
          alert('Could not get your position');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 13); // from the sample code in leaflet

    /* L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map); // from the sample code in leaflet */

    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(this.#map); // for googlemaps

    // Adding event listener so that we can click on the map
    // Use the leaflet library and the const map variable defined earlier
    // *******map.on is a function we added in from the library *******

    this.#map.on('click', this._showForm.bind(this));

    // need to wait until map has been loaded to render the markers

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(e) {
    // the code was originally inside map.on()
    // same this returns us an object again, so we need to destructure it
    // destructure 2 things at once

    this.#eMap = e; // is to be used elsewhere but can only get from _loadMap

    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    // adding a EventListener when we switch the form
    // IDEA FOR MONOPOLY ACCOUNTS
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    const validInputs = function (...inputs) {
      // spread operator
      return inputs.every(function (inp) {
        return Number.isFinite(inp);
      });
    };

    const allPositive = function (...inputs) {
      return inputs.every(function (inp) {
        return inp > 0;
      });
    };

    // Get data from form

    const type = inputType.value; // each option has a value, the value will be whichever is selected
    // IMPORTANT FOR MONOPOLY APP
    const distance = +inputDistance.value; // always comes as String
    const duration = +inputDuration.value;
    // depends on type then we get the cadence / elevationGain value
    const { lat, lng } = this.#eMap.latlng;
    let workout;

    // Check if data is valid  (below)

    // If workout is running, create running object

    if (type === 'running') {
      const cadence = +inputCadence.value;

      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert('Entries have to be positive numbers!');
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // if workout is cycling, create cycling object

    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration, elevation)
      ) {
        return alert('Inputs have to be positive numbers!');
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array

    this.#workouts.push(workout);
    console.log(workout);

    // Render workout on map as marker

    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    // Hide form + Clear input fields
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    // add marker to the map
    // const { lat, lng } = this.#eMap.latlng;   had to shift out so that it can be used in if statement

    L.marker(workout.coords) // from the sample code in leaflet**
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    const html = `
     <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${
              workout.type === 'running'
                ? workout.pace.toFixed(1)
                : workout.speed
            }</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${
              workout.type === 'running'
                ? workout.cadence.toFixed(1)
                : workout.elevationGain
            }</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;

    //cannot insert this html as to <li class="workouts"></li>
    // cause can only insert as first or last child
    // but we want it to be the second child, after <form class="form hidden"></form>
    // as  <form class="form hidden"></form> is the first child

    form.insertAdjacentHTML('afterend', html);
  }

  _hideForm() {
    // Empty inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        ' ';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(function () {
      return (form.style.display = 'grid');
    }, 1000);
  }

  // actually a very simple and can do setion

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);
    // returns <li class="workout workout--running" data-id="1424324">
    // then we use its id to select it from the workouts array

    if (!workoutEl) return;

    const workout = this.#workouts.find(function (work) {
      return work.id === workoutEl.dataset.id;
    });

    console.log(workout);

    // leaflet method

    // can pass in an object of options for last property
    this.#map.setView(workout.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  // key value pairs

  _setLocalStorage() {
    // local storage API, browser provides for us
    // for small amounts of data
    localStorage.setItem('workouts', JSON.stringify(this.#workouts)); // key value pair, both must be strings

    // saved into the local storage but not displayed yet
  }

  _getLocalStorage() {
    // const data = localStorage.getItem('workouts'); // get back object but as a string
    const data = JSON.parse(localStorage.getItem('workouts'));
    // console.log(data);

    if (!data) return;

    this.#workouts = data; // restore the data

    this.#workouts.forEach(work => {
      return this._renderWorkout(work);
    });
  }

  reset() {
    // besides setting and getting items, we can also remove items based on the key
    localStorage.removeItem('workouts');
    location.reload(); // reloads whole page
  }
}

const app = new App();

// additional features:
// 1. Ability to edit a workout
// 2. Ability to delete a workout
// 3. Ability to delete all workouts
// 4. ability to sort workouts by a certain field

// Create more realistic error and confirmation messages (+fade out effect?)

//
