import {
    addFlipCardEvent,
    observeNumOfFlippedCards,
    Cards,
    removeFlipCardEvent,
} from "./Cards.js";
import { observeTime } from "./Timer.js";
import { GameState } from "./GameState.js";
import { observeChangesInCardsResults, Sidebar } from "./Sidebar.js";
import { Difficulty } from "./Difficulty.js";
import { Theme } from "./Theme.js";
import { Scoreboard } from "./Scoreboard.js";
import { ScoreboardView } from "./ScoreboardView.js";

export const gameState = new GameState();

/**
 *
 * @param {HTMLElement} btn
 */
const disableBtn = (btn) => (btn.style = "Pointer-events: none; opacity: 0.5");

/**
 *
 * @param {Event} ev
 * @param {PlayerMode} playerMode
 * @returns {void}
 */
const changeMode = (ev, playerMode) => {
    switch (ev.target.getAttribute("data-mode")) {
        case "Solo":
            playerMode.pickedMode = "onePlayer";
            document.querySelector(".player2").style.display = "none";
            document.querySelector(".player1-title").style.display = "none";
            break;
        case "One Vs One":
            playerMode.pickedMode = "twoPlayer";
            document.querySelector(".player2").style.display = "flex";
            document.querySelector(".player1-title").style.display = "block";
            break;
        default:
            return;
    }
};

/**
 *
 * @param {MediaPlayer} media
 */
const playSoundsBgAndClick = (media) => {
    media.playSoundLoop("bgSound");
    media.playSound("click");
};

/**
 *
 * @param {{playerMode: PlayerMode, media: MediaPlayer}}
 */
function gameModeListener({ playerMode, media }) {
    document.querySelector(".new-game-btn").style =
        "pointer-events: none; opacity: 0.5;";
    const modeBtn = document.querySelector(".change-mode-btn");
    modeBtn.style = "pointer-events: none; opacity: 0.5;";
    playerMode.getModesEl().forEach((modeEl) => {
        modeEl.addEventListener("click", (ev) => {
            playSoundsBgAndClick(media);
            changeMode(ev, playerMode);
            resetPlayerTwoElements();
            updatePlayersArr(playerMode);
            playerMode.modeContainer.style.display = "none";
            modeBtn.style = "pointer-events: none; opacity: 0.5;";
            gameState.difficult.difficultyContainer.style.display = "grid";
        });
    });
}

function resetPlayerTwoElements() {
    const elements = [
        ".correct-count",
        ".incorrect-count",
        ".score-count",
        ".p2-correct-count",
        ".p2-incorrect-count",
        ".p2-score-count",
    ];
    for (let el of elements) {
        document.querySelector(el).textContent = "0";
    }
    document.querySelector(".p2-timer .p2-count").textContent = "00:00";
    document.querySelector(".timer .count").textContent = "00:00";
}

/**
 *
 * @param {PlayerMode} playerMode
 */
const hasToPopPlayer = (playerMode) =>
    playerMode.pickedMode === "onePlayer" && playerMode.players.length === 2;

/**
 *
 * @param {PlayerMode} playerMode
 */
const hasToPushPlayer = (playerMode) =>
    playerMode.pickedMode === "twoPlayer" && playerMode.players.length === 1;

/**
 * @param {PlayerMode} playerMode
 */
function updatePlayersArr(playerMode) {
    if (hasToPopPlayer(playerMode)) {
        playerMode.players.pop();
    } else if (hasToPushPlayer(playerMode)) {
        playerMode.players.push(
            new Sidebar(
                ".p2-correct-count",
                ".p2-incorrect-count",
                ".p2-score-count",
                ".p2-timer .p2-count"
            )
        );
    }
}

/**
 *
 * @param {HTMLElement} newGameBtn
 */
const updateGameWhenModePopupClose = (newGameBtn) => {
    addFlipCardEvent(gameState);
    newGameBtn.style = "Pointer-events: auto; opacity: 1";
    timer(gameState);
    gameState.media.playSound("popDown2");
};

/**
 *
 * @param {HTMLElement} newGameBtn
 * @param {PlayerMode} playerMode
 */
const updateGameWhenModePopupOpen = (newGameBtn, playerMode) => {
    removeFlipCardEvent(gameState);
    disableBtn(newGameBtn);
    clearInterval(playerMode.intervalID);
    gameState.media.playSound("popUp2");
};

/**
 * @description pops up the gameMode menu when clicking the game mode button
 * @param { {playerMode: PlayerMode} }
 */
function gameModeMenu({ playerMode }) {
    document.querySelector(".change-mode-btn").addEventListener("click", () => {
        playerMode.modeContainer.style.display =
            playerMode.modeContainer.style.display === "grid" ? "none" : "grid";
        const newGameBtn = document.querySelector(".new-game-btn");
        if (playerMode.modeContainer.style.display === "none") {
            updateGameWhenModePopupClose(newGameBtn);
        } else {
            updateGameWhenModePopupOpen(newGameBtn, playerMode);
        }
    });
}

/**
 *
 * @param {HTMLElement} modBtn
 */
const updateGameWhenDifficultyPopupClose = (modeBtn) => {
    addFlipCardEvent(gameState);
    modeBtn.style = "Pointer-events: auto; opacity: 1";
    timer(gameState);
    gameState.media.playSound("popDown");
};

/**
 *
 * @param {HTMLElement} modBtn
 * @param {PlayerMode} playerMode
 */
const updateGameWhenDifficultyPopupOpen = (modeBtn, playerMode) => {
    removeFlipCardEvent(gameState);
    disableBtn(modeBtn);
    clearInterval(playerMode.intervalID);
    gameState.media.playSound("popUp");
};

/**
 * @description pops up the difficulty menu when clicking the new game button
 * @param {{playerMode: PlayerMode, difficult: Difficulty }}
 */
function difficultyMenu({ playerMode, difficult }) {
    document.querySelector(".new-game-btn").addEventListener("click", () => {
        difficult.difficultyContainer.style.display =
            difficult.difficultyContainer.style.display === "grid"
                ? "none"
                : "grid";
        const modeBtn = document.querySelector(".change-mode-btn");
        if (difficult.difficultyContainer.style.display === "none") {
            updateGameWhenDifficultyPopupClose(modeBtn);
        } else {
            updateGameWhenDifficultyPopupOpen(modeBtn, playerMode);
        }
    });
}

/**
 * @description adds the gamemode pop up to the DOM
 * @param {{ playerMode: PlayerMode }}
 */
function addGameModeToContainer({ playerMode }) {
    for (const mode of playerMode.modes) {
        const modeEl = document.createElement("div");
        modeEl.setAttribute("data-mode", mode);
        modeEl.textContent = `${mode}`;
        modeEl.classList.add("center-img");
        playerMode.modeContainer.appendChild(modeEl);
    }
}

/**
 * @description adds the difficulty menu pop up to the DOM
 * @param {HTMLElement} container
 */
function addDifficultyToContainer(container) {
    for (const difficulty of Difficulty.difficulties) {
        const difficultyEl = document.createElement("div");
        difficultyEl.setAttribute("data-difficulty", difficulty);
        difficultyEl.textContent = `${difficulty}`;
        difficultyEl.classList.add("center-img");
        container.appendChild(difficultyEl);
    }
}

const addStyleToModeBtns = () => {
    document.querySelector(".new-game-btn").style =
        "pointer-events: auto; opacity: 1;";
    document.querySelector(".change-mode-btn").style =
        "pointer-events: auto; opacity: 1;";
};

/**
 * @param {number} index
 */
const handleDifficultyClass = (index) => {
    gameState.difficult.coupleNum = gameState.difficult.diffCardsNum[index];
    gameState.difficult.chosenDifficulty = Difficulty.difficulties[index];
    resetPickedDifficulty(gameState, index);
};

/**
 * @description listens to click on difficulty element to call resetPickedDifficulty with right params
 * @param {{difficult :Difficulty}}
 */
function difficultyListener({ difficult }) {
    let index = 0;
    difficult.difficultyContainer.addEventListener("click", (ev) => {
        gameState.media.playSound("click");
        index = Difficulty.difficulties.indexOf(
            ev.target.getAttribute("data-difficulty")
        );
        if (index === -1) {
            return;
        }
        addStyleToModeBtns();
        gameState.media.playSound("deal");
        handleDifficultyClass(index);
    });
}

/**
 * @param {Cards} cards
 * @param {Difficulty} difficult
 * @param {Theme} theme
 * @param {number} idx
 */
const timeoutAfterPickDifficulty = (cards, difficult, theme, idx) => {
    setTimeout(() => {
        gameBoardloop(shuffle(createGameBoard(difficult.diffCardsNum[idx])));
        addBackgroundImageToAllCards(gameState, theme.pickedTheme.value);
        cards.resetFlipedCardsArr();
        observeNumOfFlippedCards(gameState);
        addGameOverListener(gameState);
        observeChangesInCardsResults(gameState);
        addFlipCardEvent(gameState);
    }, 1600);
};

/**
 * @description resets all elements and starts again all initiations for a newgame or at start
 * @param {{cards: Cards, playerMode: PlayerMode, difficult: Difficulty, theme: Theme}}
 * @param {number} idx
 */
function resetPickedDifficulty(
    { cards, playerMode, playerMode: { players }, difficult, theme },
    idx
) {
    playerMode.turn = 0;
    resetCardsContainer();
    clearInterval(playerMode.intervalID);
    resetPlayers(players);
    timer(gameState);
    document.querySelector(".difficulty-container").style.display = "none";
    setGridSize(difficult.diffCardsNum[idx] / (idx + 2));
    timeoutAfterPickDifficulty(cards, difficult, theme, idx);
}

function resetCardsContainer() {
    const gameCon = document.querySelector(".game-container");
    const newCardContainer = document.createElement("div");
    document.querySelector(".cards-container").remove();
    newCardContainer.classList.add("cards-container");
    gameCon.appendChild(newCardContainer);
}

/**
 * @param {Sidebar} player
 */
const removeAllPlayerChangeListeners = (player) => {
    player.numOfCorrect.nukeListeners();
    player.numOfFail.nukeListeners();
    player.scoreNum.nukeListeners();
    player.timer.time.nukeListeners();
};

/**
 * @param {Sidebar[]} players
 */
function resetPlayers(players) {
    players.forEach((player) => {
        player.numOfCorrect.value = 0;
        player.numOfFail.value = 0;
        removeAllPlayerChangeListeners(player);
        observeTime(player.timer);
        player.timer.time.value = 0;
    });
}

/**
 * @description sets grid size when changing difficulty
 * @param {Number} size
 */
function setGridSize(size) {
    const container = document.querySelector(".cards-container");
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
}

/**
 * @description starts time interval and updates time counter
 * @param {{playerMode : PlayerMode}} Obj
 */
function timer({ playerMode, playerMode: { players } }) {
    playerMode.intervalID = setInterval(() => {
        players[playerMode.turn].timer.time.value += 1;
    }, 1000);
}

/**
 *
 * @param {{easy: number[], medium: number[], hard: number[], ninja: number[]}} bestTimeScore
 * @param {string} chosenDifficulty
 * @param {Sidebar} player
 */
const updateScoreboard = (bestTimeScore, chosenDifficulty, player) => {
    bestTimeScore[chosenDifficulty].push(player.timer.time.value);
    bestTimeScore[chosenDifficulty].sort((a, b) => a - b);
    bestTimeScore[chosenDifficulty] = bestTimeScore[chosenDifficulty].slice(
        0,
        3
    );
};

/**
 * @description check if game is over update the score pop up the game end and listen to a new game click
 * @param {{playerMode: PlayerMode, difficult: Difficulty, scoreboard: Scoreboard, endGameEl: ScoreboardView, endGameBtn: ScoreboardView}}
 */
export function checkGameOver({
    playerMode,
    difficult,
    scoreboard,
    endGameEl,
    endGameBtn,
}) {
    let winner = playerMode.players[0];
    const cardCouples = playerMode.players.reduce(
        (acc, player) => (acc += player.numOfCorrect.value),
        0
    );
    if (cardCouples === difficult.coupleNum) {
        const scoreMsg = document.querySelector("#scoreMsg");
        const scoreNum = document.querySelector("#scoreShow");
        clearInterval(playerMode.intervalID);
        playerMode.players.forEach((player) =>
            updateFinalScore(gameState, player)
        );
        console.log(playerMode.players[0].score.textContent);
        if (playerMode.pickedMode === "twoPlayer") {
            let winnerName = "Player 1";
            if (
                playerMode.players[0].scoreNum.value <
                playerMode.players[1].scoreNum.value
            ) {
                winner = playerMode.players[1];
                winnerName = "Player 2";
            }
            scoreMsg.textContent = `${winnerName} Won!`;
        } else {
            scoreMsg.textContent = `You Won!`;
        }
        scoreNum.textContent = `Score: ${winner.scoreNum.value}`;
        updateScoreboard(
            scoreboard.bestTimeScore,
            difficult.chosenDifficulty,
            winner
        );
        popEndGame(difficult, endGameEl, endGameBtn);
    }
}

function popEndGame(difficult, endGameEl, endGameBtn) {
    setTimeout(() => {
        endGameEl.style.display = "flex";
        gameState.media.playSound("winSound");
        gameState.media.playSound("winVoice");
    }, 800);
    endGameBtn.addEventListener("click", () => {
        removeFlipCardEvent(gameState);
        endGameEl.style.display = "none";
        difficult.difficultyContainer.style.display = "grid";
    });
    disableBtn(document.querySelector(".change-mode-btn"));
    disableBtn(document.querySelector(".new-game-btn"));
}

/**
 * @description updates the score at a game end
 * @param {{playerMode: {players: Sidebar[]}, difficult: {coupleNum: Number}}} Obj
 */

function updateFinalScore({ playerMode, difficult: { coupleNum } }, player) {
    const timeFactor = 2000,
        failFactor = 150;
    let timeBonus = (coupleNum * timeFactor) / player.timer.time.value;
    let failPenalty = (player.numOfFail.value * failFactor) / coupleNum;
    let difficultyBonus = coupleNum / 8;
    let correctBonus =
        playerMode.pickedMode === "twoPlayer"
            ? player.numOfCorrect.value * 50
            : 0;
    let total = (timeBonus + correctBonus - failPenalty) * difficultyBonus;

    player.scoreNum.value = total > coupleNum * 20 ? total | 0 : coupleNum * 20;
}

/**
 * @description huh ? u dont need this here, its self explanatory dummy !! :P
 * @param { {playerMode: {players: Sidebar[]}} } Obj
 */
function addGameOverListener({ playerMode: { players } }) {
    players.forEach((player) => {
        player.numOfCorrect.addChangeListener((_) => checkGameOver(gameState));
    });
}

/**
 *
 * @param {String[]} itemsTheme
 * @param {Number} cardCouples
 * @returns array filled with couples of animal names
 */
function createGameBoard(cardCouples) {
    const numsPool = Array.from(Array(50).keys());
    const gameBoard = [];
    while (gameBoard.length < cardCouples * 2) {
        let random = (Math.random() * numsPool.length) | 0;
        let removeVal = numsPool.splice(random, 1);
        gameBoard.push(`item${removeVal[0] + 1}`, `item${removeVal[0] + 1}`);
    }

    return gameBoard;
}

/**
 * @description loops over the animal names to create DOM element for each one
 * @param {String[]} gameBoard
 */
function gameBoardloop(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        createGridElements(gameBoard[i]);
    }
}

/**
 * @description takes animal name and create its DOM elements
 * @param {String} item
 */
function createGridElements(item) {
    const grid = document.querySelector(".cards-container");
    const keywords = ["card-front", "card-back", "card-scene"];
    const cardWrap = document.createElement("div");
    cardWrap.classList.add("card");
    cardWrap.setAttribute("data-type", item);
    for (let i = 0; i < 3; i++) {
        const frontBackCardScene = document.createElement("div");
        frontBackCardScene.classList.add(keywords[i]);
        if (i < 2) cardWrap.appendChild(frontBackCardScene);
        if (i === 2) {
            frontBackCardScene.appendChild(cardWrap);
            grid.appendChild(frontBackCardScene);
        }
    }
}

/**
 *
 * @param {String} array
 * @returns shuffles array of animal names
 */
function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

/**
 * @description Add the background image to all cards
 * @param {{cards: Cards, theme: Theme}} Obj
 */

const addBackgroundImageToAllCards = ({ cards }, pickedTheme) => {
    cards.getAllCards().forEach((card) => {
        card.classList.add("box-shadow");
        const [cardType, backCard, frontCard] = getElementsForCard(card);
        applyStylesToCard(
            backCard,
            `./assets/img/${pickedTheme}/${cardType}.webp`
        );
        applyStylesToCard(frontCard, `./assets/img/${pickedTheme}/front.png`);
    });
};

const addChangeListenerToTheme = ({ theme }) => {
    theme.pickedTheme.addChangeListener((pickedTheme) =>
        addBackgroundImageToAllCards(gameState, pickedTheme)
    );
};

addChangeListenerToTheme(gameState);

const getElementsForCard = (card) => [
    card.getAttribute("data-type"),
    card.lastChild,
    card.firstChild,
];

const applyStylesToCard = (cardEl, imgSrc) => {
    if (cardEl.firstChild) {
        cardEl.removeChild(cardEl.firstChild);
    }
    const imgEl = document.createElement("img");
    imgEl.src = imgSrc;
    imgEl.classList.add("item-img");
    cardEl.appendChild(imgEl);
    cardEl.style = "display: flex; justify-content: center;";
    cardEl.classList.add("center-img");
};

const addClickEventToScoreboard = ({ scoreboardView, scoreboard }) => {
    scoreboardView.scoreboardBtn.addEventListener("click", () => {
        toggleScoreboardDisplay();
        scoreboardView.displayTime(
            scoreboard.bestTimeScore[Difficulty.difficulties[0]]
        );
    });
    scoreboardView.closeScoreboard.addEventListener(
        "click",
        toggleScoreboardDisplay
    );
};

const toggleScoreboardDisplay = () => {
    gameState.scoreboardView.scoreboardContainer.style.display =
        gameState.scoreboardView.scoreboardContainer.style.display === "flex"
            ? "none"
            : "flex";
    if (gameState.scoreboardView.scoreboardContainer.style.display === "flex") {
        gameState.media.playSound("scoreBoard");
    }
};

function muteBtnListener({ media }) {
    const btns = document.querySelectorAll("button");
    btns[0].addEventListener("click", () => {
        media.toggleMute();
        media.pause("bgSound");
        btns[0].style.display = "none";
        btns[1].style.display = "inline-block";
    });
    btns[1].addEventListener("click", () => {
        media.toggleMute();
        media.playSoundLoop("bgSound");
        btns[1].style.display = "none";
        btns[0].style.display = "inline-block";
    });
}

/**
 * @description call for menu elements of difficulty and gameMode, starts card oberver and starts by picking difficulty function
 */
const startGame = () => {
    gameModeMenu(gameState);
    difficultyMenu(gameState);
    addDifficultyToContainer(gameState.difficult.difficultyContainer);

    addGameModeToContainer(gameState);
    gameModeListener(gameState);
    muteBtnListener(gameState);
    addClickEventToScoreboard(gameState);
    difficultyListener(gameState);
};

startGame();
