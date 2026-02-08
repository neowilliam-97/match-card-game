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

cardList.forEach((card) => {
  for (let i = 0; i < 3; i++) {
    multipliedCards.push({ ...card });
  }
});

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

multipliedCards.forEach((cardData) => {
  const cardClone = template.content.cloneNode(true);

  const cardWrapper = cardClone.querySelector('.card-wrapper');
  const cardFront = cardClone.querySelector('.card-front');

  cardWrapper.dataset.type = cardData.type;
  cardFront.src = cardData.image;

  cardContainer.appendChild(cardClone);
});

/* =========================
   6. Flip Card Logic + WIN
========================= */
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let matchedPairs = 0;
const WIN_PAIRS = 3; // 👈 match đủ 3 cặp là thắng

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
  const isMatch =
    firstCard.dataset.type === secondCard.dataset.type;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', handleCardClick);
  secondCard.removeEventListener('click', handleCardClick);

  matchedPairs++; // ✅ tăng số cặp match đúng

  if (matchedPairs === WIN_PAIRS) {
    setTimeout(() => {
      alert("🎉 YOU WIN 🎉");
    }, 300);
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
let gameTime = 30;       // tổng thời gian (giây)
let currentTime = gameTime;
let timerInterval = null;
function renderTime() {
  const timeEl = document.querySelector('.time-down');

  const seconds = currentTime < 10
    ? `0${currentTime}`
    : currentTime;

  timeEl.textContent = `00:${seconds}`;
}
function startTimer() {
  clearInterval(timerInterval); // phòng double timer

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
  console.log('⏰ Time up!');
  lockBoard = true; // khoá toàn bộ card

  // sau này có thể:
  // show popup Game Over
}
const playBtn = document.querySelector('.btn--play');
const homeScreen = document.getElementById('home_screen');
const gameScreen = document.getElementById('game-screen');

playBtn.addEventListener('click', () => {
  // 1. Chuyển màn hình
  homeScreen.classList.add('is-hidden');
  gameScreen.classList.remove('is-hidden');

  // 2. Reset & start timer
  startTimer();
});
