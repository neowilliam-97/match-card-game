/* =========================
   0. Audio Setup
========================= */
const bgMusic = document.getElementById('bg-music');
const clickSound = document.getElementById('click-sound');
const cardFlipSound = document.getElementById('card-flip-sound');
const matchCorrectSound = document.getElementById('match-correct-sound');
const matchWrongSound = document.getElementById('match-wrong-sound');
const winSound = document.getElementById('win-sound');
const timesUpSound = document.getElementById('times-up-sound');

// Bật nhạc nền ngay khi trang load
function initBackgroundMusic() {
  if (!bgMusic) {
    console.error('Background music element not found!');
    return;
  }
  
  bgMusic.volume = 0.5; // Điều chỉnh âm lượng (0.0 - 1.0)
  
  console.log('Attempting to play background music...');
  
  // Tự động phát nhạc nền
  const playPromise = bgMusic.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log('Background music playing successfully!');
      })
      .catch(err => {
        console.log('Autoplay prevented:', err);
        console.log('Waiting for user interaction...');
        
        // Nếu autoplay bị chặn, phát khi user click lần đầu
        const playOnFirstClick = () => {
          console.log('User clicked, attempting to play music...');
          bgMusic.play()
            .then(() => {
              console.log('Background music started after user interaction!');
            })
            .catch(err => {
              console.error('Failed to play background music:', err);
            });
          document.body.removeEventListener('click', playOnFirstClick);
        };
        
        document.body.addEventListener('click', playOnFirstClick);
      });
  }
}

// Helper function để phát sound effects
function playSound(audioElement, stopPrevious = false) {
  if (!audioElement) {
    console.warn('Audio element not provided');
    return;
  }
  
  console.log('Playing sound:', audioElement.id);
  
  if (stopPrevious) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  
  audioElement.play()
    .then(() => {
      console.log('Sound played successfully:', audioElement.id);
    })
    .catch(err => {
      console.error('Audio play failed:', audioElement.id, err);
    });
}

// Khởi động khi DOM loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackgroundMusic);
} else {
  initBackgroundMusic();
}

/* =========================
   0.5 Auto Redirect to Home (Inactivity Timer)
========================= */
// let inactivityTimer = null;
// const INACTIVITY_TIME = 10000; // 10 giây (đơn vị: milliseconds)

// function resetInactivityTimer() {
//   // Clear timer hiện tại
//   if (inactivityTimer) {
//     clearTimeout(inactivityTimer);
//   }
  
//   // Chỉ set timer khi KHÔNG ở home screen
//   const homeScreen = document.getElementById('home_screen');
//   const isOnHomeScreen = !homeScreen.classList.contains('is-hidden');
  
//   if (isOnHomeScreen) {
//     console.log('On home screen, inactivity timer disabled');
//     return;
//   }
  
//   console.log('Resetting inactivity timer...');
  
//   // Set timer mới
//   inactivityTimer = setTimeout(() => {
//     console.log('User inactive for 10 seconds, redirecting to home...');
//     redirectToHome();
//   }, INACTIVITY_TIME);
// }

// function redirectToHome() {
//   const homeScreen = document.getElementById('home_screen');
//   const gameScreen = document.getElementById('game-screen');
//   const winModal = document.getElementById('win-modal');
//   const gameOverModal = document.getElementById('gameover-modal');
//   const rankModal = document.getElementById('rank-modal'); // ADDED
  
//   // Hide all screens and modals
//   gameScreen.classList.add('is-hidden');
//   winModal.classList.add('is-hidden');
//   gameOverModal.classList.add('is-hidden');
//   rankModal.classList.add('is-hidden'); // ADDED
  
//   // Show home screen
//   homeScreen.classList.remove('is-hidden');
  
//   // Remove all matched and shake classes
//   document.querySelectorAll('.card-wrapper').forEach(card => {
//     card.classList.remove('is-matched', 'shake', 'is-flipped');
//   });
  
//   // Reset game state
//   matchedPairs = 0;
//   clearInterval(timerInterval);
//   createMultipliedCards();
//   shuffleCards(multipliedCards);
//   renderCards();
//   resetBoard();
//   initFlipCard();
  
//   // Clear inactivity timer
//   if (inactivityTimer) {
//     clearTimeout(inactivityTimer);
//     inactivityTimer = null;
//   }
  
//   console.log('Redirected to home screen');
// }

// // Lắng nghe các sự kiện user interaction
// const interactionEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

// interactionEvents.forEach(event => {
//   document.addEventListener(event, resetInactivityTimer, true);
// });

/* =========================
   1. Button Audio
========================= */
function btnAudio() {
  const buttons = document.querySelectorAll('.btn');
  console.log('Found buttons:', buttons.length);

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      console.log('Button clicked!');
      playSound(clickSound, true);
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
   3. Multiply cards (xn)
========================= */
let multipliedCards = [];

function createMultipliedCards() {
  multipliedCards = [];
  cardList.forEach((card) => {
    for (let i = 0; i < 4; i++) {
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
  
  // Phát âm thanh lật thẻ
  console.log('Card flipped!');
  playSound(cardFlipSound, true);

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
  
  // Đợi animation flip hoàn thành (0.6s) trước khi áp dụng hiệu ứng
  setTimeout(() => {
    if (isMatch) {
      console.log('Cards matched!');
      // Phát âm thanh match đúng
      playSound(matchCorrectSound, true);
      disableCards();
    } else {
      console.log('Cards do not match!');
      // Phát âm thanh match sai
      playSound(matchWrongSound, true);
      unflipCards();
    }
  }, 600); // Đợi 0.6s để flip animation hoàn thành
}

function disableCards() {
  firstCard.removeEventListener('click', handleCardClick);
  secondCard.removeEventListener('click', handleCardClick);

  // Thêm class is-matched để giảm opacity
  firstCard.classList.add('is-matched');
  secondCard.classList.add('is-matched');

  matchedPairs++;
  console.log('Matched pairs:', matchedPairs);

  if (matchedPairs === WIN_CONDITION) {
    console.log('Player wins!');
    clearInterval(timerInterval);
    
    // Phát âm thanh chiến thắng
    setTimeout(() => {
      playSound(winSound, true);
    }, 500);
    
    showWinModal();
  }

  resetBoard();
}

function unflipCards() {
  // Thêm shake animation cho cả 2 thẻ không khớp ngay lập tức
  firstCard.classList.add('shake');
  secondCard.classList.add('shake');
  
  // Đợi shake animation xong (0.5s) rồi mới flip lại
  setTimeout(() => {
    firstCard.classList.remove('is-flipped');
    secondCard.classList.remove('is-flipped');
    
    // Remove shake class sau khi flip lại
    setTimeout(() => {
      firstCard.classList.remove('shake');
      secondCard.classList.remove('shake');
      resetBoard();
    }, 600); // Đợi flip animation hoàn thành
  }, 500); // Đợi shake animation xong
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
let gameTime = 15;
let currentTime = gameTime;
let timerInterval = null;
let finalTime = 0; // ADDED: Lưu thời gian chiến thắng

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
  console.log('Time is up!');
  lockBoard = true;
  
  if (matchedPairs < WIN_CONDITION) {
    // Phát âm thanh hết giờ
    playSound(timesUpSound, true);
    showGameOverModal();
  }
}

/* =========================
   ADDED: 7.5 Leaderboard System
========================= */
function saveScore(playerName, time) {
  if (!playerName || playerName.trim() === '') {
    alert('Please enter your name!');
    return false;
  }
  
  // Lấy leaderboard từ localStorage
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  
  // Thêm score mới
  leaderboard.push({
    name: playerName.trim(),
    time: time,
    date: new Date().toISOString()
  });
  
  // Sắp xếp theo thời gian (nhanh nhất lên đầu)
  leaderboard.sort((a, b) => a.time - b.time);
  
  // Giữ top 10
  leaderboard = leaderboard.slice(0, 10);
  
  // Lưu vào localStorage
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  
  console.log('Score saved!', { name: playerName, time: time });
  return true;
}

function getLeaderboard() {
  return JSON.parse(localStorage.getItem('leaderboard')) || [];
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function displayLeaderboard() {
  const leaderboard = getLeaderboard();
  const leaderboardList = document.getElementById('leaderboard-list');
  
  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = '<div class="leaderboard-empty">No scores yet!<br>Be the first to play!</div>';
    return;
  }
  
  leaderboardList.innerHTML = '';
  
  leaderboard.forEach((score, index) => {
    const item = document.createElement('div');
    item.className = `leaderboard-item ${index < 3 ? 'top-3' : ''}`;
    
    let rankEmoji = '';
    if (index === 0) rankEmoji = '🥇';
    else if (index === 1) rankEmoji = '🥈';
    else if (index === 2) rankEmoji = '🥉';
    else rankEmoji = `${index + 1}.`;
    
    item.innerHTML = `
      <div class="leaderboard-rank">${rankEmoji}</div>
      <div class="leaderboard-name">${score.name}</div>
      <div class="leaderboard-time">${formatTime(score.time)}</div>
    `;
    
    leaderboardList.appendChild(item);
  });
}
/* =========================
   END ADDED
========================= */

/* =========================
   8. Modals
========================= */
const winModal = document.getElementById('win-modal');
const gameOverModal = document.getElementById('gameover-modal');
const rankModal = document.getElementById('rank-modal'); // ADDED

function showWinModal() {
  // ADDED: Tính thời gian hoàn thành
  finalTime = gameTime - currentTime;
  
  setTimeout(() => {
    // ADDED: Hiển thị thời gian
    document.getElementById('win-time').textContent = formatTime(finalTime);
    
    // ADDED: Reset name input
    document.getElementById('player-name').value = '';
    document.querySelector('.name-input-wrapper').classList.remove('is-saved');
    
    winModal.classList.remove('is-hidden');
    // Start inactivity timer khi modal hiện
    resetInactivityTimer();
  }, 500);
}

function showGameOverModal() {
  setTimeout(() => {
    const matchedCountEl = document.getElementById('matched-count');
    matchedCountEl.textContent = matchedPairs;
    
    gameOverModal.classList.remove('is-hidden');
    // Start inactivity timer khi modal hiện
    resetInactivityTimer();
  }, 500);
}

/* =========================
   9. Reset Game
========================= */
function resetGame() {
  console.log('Resetting game...');
  // Reset variables
  matchedPairs = 0;
  
  // Hide all modals
  winModal.classList.add('is-hidden');
  gameOverModal.classList.add('is-hidden');

  // Reset timer
  clearInterval(timerInterval);
  
  // Remove all matched and shake classes
  document.querySelectorAll('.card-wrapper').forEach(card => {
    card.classList.remove('is-matched', 'shake', 'is-flipped');
  });
  
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
  
  // Reset inactivity timer
  resetInactivityTimer();
}

/* =========================
   10. Screen Navigation
========================= */
const playBtn = document.querySelector('.btn--play');
const homeScreen = document.getElementById('home_screen');
const gameScreen = document.getElementById('game-screen');

playBtn.addEventListener('click', () => {
  console.log('Play button clicked!');
  homeScreen.classList.add('is-hidden');
  gameScreen.classList.remove('is-hidden');
  
  // Đảm bảo nhạc nền đang phát
  if (bgMusic && bgMusic.paused) {
    console.log('Starting background music...');
    bgMusic.play();
  }
  
  startTimer();
  
  // Start inactivity timer khi vào game screen
  resetInactivityTimer();
});

/* =========================
   11. Modal Buttons
========================= */
const homeBtn = document.querySelector('.btn--home');
const retryBtn = document.querySelector('.btn--retry');
const saveScoreBtn = document.querySelector('.btn-save-score'); // ADDED
const rankBtn = document.querySelector('.btn--rank'); // ADDED
const closeRankBtn = document.querySelector('.btn--close-rank'); // ADDED

/* =========================
   ADDED: Save Score & Rank Buttons
========================= */
// SAVE SCORE button
if (saveScoreBtn) {
  saveScoreBtn.addEventListener('click', () => {
    const playerNameInput = document.getElementById('player-name');
    const playerName = playerNameInput.value.trim();
    
    if (playerName === '') {
      alert('Please enter your name!');
      return;
    }
    
    // Save score
    if (saveScore(playerName, finalTime)) {
      playSound(clickSound, true);
      
      // Disable input after saving
      document.querySelector('.name-input-wrapper').classList.add('is-saved');
      
      // Show success message
      alert(`Score saved! You completed in ${formatTime(finalTime)}!`);
    }
  });
}

// RANK button - show leaderboard
if (rankBtn) {
  rankBtn.addEventListener('click', () => {
    console.log('Rank button clicked!');
    playSound(clickSound, true);
    
    // Display leaderboard
    displayLeaderboard();
    
    // Show rank modal
    rankModal.classList.remove('is-hidden');
    
    // Start inactivity timer
    resetInactivityTimer();
  });
}

// CLOSE RANK button
if (closeRankBtn) {
  closeRankBtn.addEventListener('click', () => {
    console.log('Close rank button clicked!');
    playSound(clickSound, true);
    rankModal.classList.add('is-hidden');
    
    // Clear inactivity timer when closing
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
  });
}
/* =========================
   END ADDED
========================= */

// HOME button - quay về home screen
if (homeBtn) {
  homeBtn.addEventListener('click', () => {
    console.log('Home button clicked!');
    winModal.classList.add('is-hidden');
    gameScreen.classList.add('is-hidden');
    homeScreen.classList.remove('is-hidden');
    
    // Remove all matched and shake classes
    document.querySelectorAll('.card-wrapper').forEach(card => {
      card.classList.remove('is-matched', 'shake', 'is-flipped');
    });
    
    // Reset game state
    matchedPairs = 0;
    clearInterval(timerInterval);
    createMultipliedCards();
    shuffleCards(multipliedCards);
    renderCards();
    resetBoard();
    initFlipCard();
    
    // Clear inactivity timer khi về home
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
  });
}

// TRY AGAIN button - chơi lại
if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    console.log('Retry button clicked!');
    gameOverModal.classList.add('is-hidden');
    resetGame();
  });
}