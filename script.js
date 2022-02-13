'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [1500],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [Date.now()],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [1500],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [Date.now()],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [1500],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [Date.now()],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [1500],
  interestRate: 1,
  pin: 4444,

  movementsDates: [Date.now()],
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// Step 1: To display the account movements
// Using forEach array method & .insertAdjacentHTML property

// && Step 10: To sort the movements in ascending order

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort(function (a, b) {
        return a - b;
      })
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const hour = `${date.getHours()}`.padStart(2, 0);
    const min = `${date.getMinutes()}`.padStart(2, 0);

    // const displayDate = `${day}/${month}/${year}`;
    const displayDate = `${hour}:${min}`;

    const html = `
         <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov}</div>
          </div>`;

    containerMovements.insertAdjacentHTML('afterBegin', html);
  });
};

// Step 2: Create username(making initials from name)
// Using the forEach method

const createUserName = function (user) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner // creating a new property on the object
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

createUserName(accounts);

// Step 3: To display the total account balance
// Using the reduce method
// this is the total amount, can be used later on to check if
// its > than withdrawals in order to withdraw

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    // setting new balance property
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

// Step 4: To display the In, Out & interest
// Using the fliter, map, reduce methods

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, curr) {
      return acc + curr;
    }, 0);

  labelSumIn.textContent = `${income}`;

  const out = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, curr) {
      return acc + curr;
    }, 0);

  labelSumOut.textContent = `${Math.abs(out)}`;

  // const interest = acc.movements
  //   .filter(function (mov) {
  //     return mov > 0;
  //   })
  //   .map(function (mov) {
  //     return (mov * 1.2) / 100;
  //   })
  //   .filter(function (mov) {
  //     return mov >= 1;
  //   })
  //   .reduce(function (acc, curr) {
  //     return acc + curr;
  //   }, 0);

  // labelSumInterest.textContent = `${interest}`;
};

// Step 6: add all display commands into a single function

// need to shift up to initialise update UI first

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance

  calcDisplayBalance(acc);
  // Display summary

  calcDisplaySummary(acc);
};

// Step 5: To implement logging in method
//Using find the find() method

let currentAccount, timer; // will need this info for other functions

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // .value returns a string
    // checks if currentAccount exist (optional chaining )

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0] // split the word, first word
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();

    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) {
      clearInterval(timer);
    }

    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

// Step 7: implementing transfer money step

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // assign constants to both input fields
  // then check
  // to implement transfer, just push amounts into the movements property

  const inputAcc = inputTransferTo.value;
  const inputamount = Number(inputTransferAmount.value);

  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputAcc;
  });

  // guard clauses

  if (!receiverAcc) {
    return alert('Has to be a valid user!');
  }

  if (receiverAcc === currentAccount) {
    return alert('Not allowed to transfer to own account!');
  }

  if (!(Number.isFinite(inputamount) && inputamount > 0)) {
    return alert('Has to be a valid amount!');
  }

  // console.log(inputamount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  currentAccount.movements.push(-inputamount);
  receiverAcc.movements.push(inputamount);

  // Add transfer date
  currentAccount.movementsDates.push(new Date());
  receiverAcc.movementsDates.push(new Date());

  // Update UI
  updateUI(currentAccount);

  //Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

// Step 8: // Step 8: Pass GO receive 200 feature
// To close an account, just have to delete the account object from the
// accounts array
// to delete an element from an array with can use the splice method
// but for splice method we need the index of the element to delete
// findIndex() + splice()

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });

    // Delete the Account
    accounts.splice(index, 1);
  }

  // Hide UI
  containerApp.style.opacity = 0;
});

// Step 9: Request loan feature
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = 200;

  // add movement
  setTimeout(function () {
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date());

    // Update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }, 2500);
});

// Step 10: Click sort button function

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const startLogOutTimer = function () {
  let time = 600;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const secs = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI

    labelTimer.textContent = `${min} : ${secs}`;

    // Decrease 1s

    time -= 1;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer); // set a variable for setInterval so we can clearInterval(variable)
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
  };

  tick();

  // Call the timer every second
  const timer = setInterval(tick, 1000);

  return timer;
};
