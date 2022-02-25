'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Feature 1: Modal window:

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/* // Feature 2: Adding cookies to webpages

// Creating and inserting elements

const header = document.querySelector('.header');

const message = document.createElement('div');
// creates a dom element and then stores the element into the message
// not yet in the dom yet

message.classList.add('cookie-message');
// message.textContent =
//   'we use cookies for improved functionality and analytics.';
message.innerHTML =
  //'we use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
  'we use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);

// prepend adds the element as the first child element

header.append(message);

// append adds the element as the last child element

// if we want it to show up twice

// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message)

// before or after the element

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); // recent method

    message.parentElement.removeChild(message);
  });

  */

// Feature 3: Smooth scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  section1.scrollIntoView({ behavior: 'smooth' });
});

// BEST WAY

// To enable smooth-scrolling for the whole page, can use CSS method:

/* To me it seems that just adding this line of code:

html {
  scroll-behavior: smooth;
}
at the top of our CSS file is simpler and easier than using event delegation.

 */

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Feature 4: Buldiing a tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Feature 5: Menu Fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// mouseover can bubble
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Feature 6: Sticky navigation (scroll event)

// Sticky navigation: Intersection Observer API

// const obsCallBack = function (entries, observer) {
//   entries.forEach(function (entry) {
//     console.log(entry);
//   });
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);

// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);

headerObserver.observe(header);

// Feature 7: Reveal Sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Feature 8: Lazy Loading images

const imgTargets = document.querySelectorAll('img[data-src]');
// we dun want to select all images as some are part of icons
// so we select them base on the data attribute

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const obsOptions3 = {
  root: null,
  threshold: 0,
  rootMargin: '200px', // shld be 200px but its better as an effect??
};

const imgObserver = new IntersectionObserver(loadImg, obsOptions3);

imgTargets.forEach(img => imgObserver.observe(img));

// Feature 9: Building a slider component: Part 1

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4)';
  // slider.style.overflow = 'visible';

  const goToSlide = function (slide) {
    slides.forEach(function (s, i) {
      return (s.style.transform = `translateX(${100 * (i - slide)}%)`);
    }); // 0%, 100%, 200%, 300%                                     // comment this out for cool effect
  };

  // Next slide
  const nextSlide = function () {
    if (currentSlide === maxSlide) {
      currentSlide = 0;
    } else {
      currentSlide += 1;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const previousSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide -= 1;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  // to make left/right arrow keys work
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // to add in the dot capability

  const dotContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach(function (_, i) {
      // throwaway variable as we dun need the first variable
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>` // can access the data of slide using .slide
        // use data property to access numbers
      );
    });
  };

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  // no matter which key/ button is used to move the slides, the dot must move also
  // so a seperate function is created

  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(function (e) {
      e.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`) //using the data attribute
      .classList.add('dots__dot--active');
  };

  // need to add this function to nextSlide, previousSlide, and when we press on the dot itself

  // consolidate all the initialisation steps into one function

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();
};

slider();
