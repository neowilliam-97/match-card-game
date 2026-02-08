/* =========================
   1. Button Audio
========================= */
function btnAudio() {
  const buttons = document.querySelectorAll('.btn');
  const audio = document.getElementById('click-sound');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!audio) return;
      audio.currentTime = 0;
      audio.play();
    });
  });
}
btnAudio();

/* =========================
   2. Card Data
========================= */
const cardList = [
  { type: "crab", image: "/assets/card-crab.png" },
  { type: "fish", image: "/assets/card-fish.png" },
  { type: "crawfish", image: "/assets/card-crawfish.png" },
  { type: "squid", image: "/assets/card-squid.png" },
  { type: "seashell", image: "/assets/card-seashell.png" },
];

/* =========================
   3. Multiply cards (x3)
========================= */
let multipliedCards = [];

function createMultipliedCards() {
  multipliedCards = [];
  cardList.forEach((card) => {
    for (let i = 0; i < 3; i++) {
      multipliedCards.push({ ...card });
    }
  });
}
createMultipliedCards();

/* =========================
   4. Shuffle cards
========================= */
function shuffleCards(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
}
shuffleCards(multipliedCards);

/* =========================
   5. Render cards
========================= */
const template = document.getElementById('card-template');
const cardContainer = document.querySelector('.cards-game');

function renderCards() {
  cardContainer.innerHTML = '';
  
  multipliedCards.forEach((cardData) => {
    const cardClone = template.content.cloneNode(true);
    const cardWrapper = cardClone.querySelector('.card-wrapper');
    const cardFront = cardClone.querySelector('.card-front');

    cardWrapper.dataset.type = cardData.type;
    cardFront.src = cardData.image;

    cardContainer.appendChild(cardClone);
  });
}
renderCards();

/* =========================
   6. Flip Card Logic + WIN
========================= */
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
const WIN_CONDITION = 3;

function initFlipCard() {
  const cards = document.querySelectorAll('.card-wrapper');
  cards.forEach((card) => {
    card.addEventListener('click', handleCardClick);
  });
}

function handleCardClick() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('is-flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.type === secondCard.dataset.type;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', handleCardClick);
  secondCard.removeEventListener('click', handleCardClick);

  matchedPairs++;

  if (matchedPairs === WIN_CONDITION) {
    clearInterval(timerInterval);
    showWinModal();
  }

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('is-flipped');
    secondCard.classList.remove('is-flipped');
    resetBoard();
  }, 600);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

initFlipCard();

/* =========================
   7. Timer
========================= */
let gameTime = 30;
let currentTime = gameTime;
let timerInterval = null;

function renderTime() {
  const timeEl = document.querySelector('.time-down');
  const seconds = currentTime < 10 ? `0${currentTime}` : currentTime;
  timeEl.textContent = `00:${seconds}`;
}

function startTimer() {
  clearInterval(timerInterval);
  currentTime = gameTime;
  renderTime();

  timerInterval = setInterval(() => {
    currentTime--;
    renderTime();

    if (currentTime <= 0) {
      clearInterval(timerInterval);
      handleTimeUp();
    }
  }, 1000);
}

function handleTimeUp() {
  lockBoard = true;
  
  if (matchedPairs < WIN_CONDITION) {
    showGameOverModal();
  }
}

/* =========================
   8. Modals
========================= */
const winModal = document.getElementById('win-modal');
const gameOverModal = document.getElementById('gameover-modal');

function showWinModal() {
  setTimeout(() => {
    winModal.classList.remove('is-hidden');
  }, 500);
}

function showGameOverModal() {
  setTimeout(() => {
    const matchedCountEl = document.getElementById('matched-count');
    matchedCountEl.textContent = matchedPairs;
    
    gameOverModal.classList.remove('is-hidden');
  }, 500);
}

/* =========================
   9. Reset Game
========================= */
function resetGame() {
  // Reset variables
  matchedPairs = 0;
  
  // Hide all modals
  winModal.classList.add('is-hidden');
  gameOverModal.classList.add('is-hidden');

  // Reset timer
  clearInterval(timerInterval);
  
  // Recreate and shuffle cards
  createMultipliedCards();
  shuffleCards(multipliedCards);
  
  // Re-render cards
  renderCards();
  
  // Re-init flip logic
  resetBoard();
  initFlipCard();
  
  // Start timer
  startTimer();
}

/* =========================
   10. Screen Navigation
========================= */
const playBtn = document.querySelector('.btn--play');
const homeScreen = document.getElementById('home_screen');
const gameScreen = document.getElementById('game-screen');

playBtn.addEventListener('click', () => {
  homeScreen.classList.add('is-hidden');
  gameScreen.classList.remove('is-hidden');
  startTimer();
});

/* =========================
   11. Modal Buttons
========================= */
const homeBtn = document.querySelector('.btn--home');
const retryBtn = document.querySelector('.btn--retry');

// HOME button - quay về home screen
if (homeBtn) {
  homeBtn.addEventListener('click', () => {
    winModal.classList.add('is-hidden');
    gameScreen.classList.add('is-hidden');
    homeScreen.classList.remove('is-hidden');
    
    // Reset game state
    matchedPairs = 0;
    clearInterval(timerInterval);
    createMultipliedCards();
    shuffleCards(multipliedCards);
    renderCards();
    resetBoard();
    initFlipCard();
  });
}

// TRY AGAIN button - chơi lại
if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    gameOverModal.classList.add('is-hidden');
    resetGame();
  });
}