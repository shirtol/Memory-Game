import {
    addFlipCardEvent,
    observeNumOfFlippedCards,
    Cards,
    removeFlipCardEvent,
} from "./Cards.js";
import { observeTime, Timer } from "./Timer.js";
import { GameState } from "./GameState.js";
import { observeChangesInCardsResults } from "./Sidebar.js";
import { displayTime } from "./EndGame.js";

export const gameState = new GameState();

startGame();

/**
 * @description call for menu elements of difficulty and gameMode, starts card oberver and starts by picking difficulty function
 */
function startGame() {
    gameModeMenu(gameState);
    difficultyMenu(gameState);
    addDifficultyToContainer(
        gameState,
        gameState.difficult.difficultyContainer
    );

    addGameModeToContainer(gameState);
    observeChangesInCardsResults(gameState);
    pickDifficulty();
    addGameOverListener(gameState);
    gameState.difficult.difficultyContainer.style.display = "grid";
    gameState.playerMode.players[gameState.playerMode.turn];
}

/**
 * @description pops up the gameMode menu when clicking the game mode button
 * @param { {playerMode: PlayerMode} } Obj
 */
function gameModeMenu({ playerMode }) {
    document.querySelector(".change-mode-btn").addEventListener("click", () => {
        playerMode.modeContainer.style.display =
            playerMode.modeContainer.style.display === "grid" ? "none" : "grid";
        playerMode.modeContainer.style.display === "none"
            ? addFlipCardEvent(gameState)
            : removeFlipCardEvent(gameState);
    });
}

/**
 * @description pops up the difficulty menu when clicking the new game button
 * @param {{ difficult: Difficulty }} Obj
 */
function difficultyMenu({ difficult }) {
    document.querySelector(".new-game-btn").addEventListener("click", () => {
        difficult.difficultyContainer.style.display =
            difficult.difficultyContainer.style.display === "grid"
                ? "none"
                : "grid";
        difficult.difficultyContainer.style.display === "none"
            ? addFlipCardEvent(gameState)
            : removeFlipCardEvent(gameState);
    });
}

/**
 * @description adds the gamemode pop up to the DOM
 * @param {{ playerMode: PlayerMode }} Obj
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
 * @param {{ difficult: Difficulty }} Obj
 */
function addDifficultyToContainer({ difficult }, container) {
    for (const difficulty of difficult.difficulties) {
        const difficultyEl = document.createElement("div");
        difficultyEl.setAttribute("data-difficulty", difficulty);
        difficultyEl.textContent = `${difficulty}`;
        difficultyEl.classList.add("center-img");
        container.appendChild(difficultyEl);
    }
}

/**
 * @description listens to click on difficulty element to call resetPickedDifficulty with right params
 */
function pickDifficulty() {
    const options = document.querySelector(".difficulty-container");
    let index = 0;
    options.addEventListener("click", (ev) => {
        switch (ev.target.getAttribute("data-difficulty")) {
            case "easy":
                index = 0;
                break;
            case "medium":
                index = 1;
                break;
            case "hard":
                index = 2;
                break;
            case "ninja":
                index = 3;
                break;
            default:
                return;
        }
        gameState.difficult.coupleNum = gameState.difficult.diffCardsNum[index];
        resetPickedDifficulty(gameState, index);
    });
}

/**
 * @description resets all elements and starts again all initiations for a newgame or at start
 * @param {{cards: Cards, playerMode: PlayerMode, difficult: Difficulty, animals: string[]}} Obj
 * @param {number} idx
 */
function resetPickedDifficulty(
    { cards, playerMode, playerMode: { players }, difficult, animals },
    idx
) {
    document.querySelector(".cards-container").innerHTML = ""; //!Why not use textContent?
    players[playerMode.turn].numOfCorrect.value = 0;
    players[playerMode.turn].numOfFail.value = 0;
    clearInterval(players[playerMode.turn].intervalID);
    timer(gameState);
    document.querySelector(".difficulty-container").style.display = "none";
    setGridSize(difficult.diffCardsNum[idx] / (idx + 2));
    setTimeout(() => {
        gameBoardloop(
            shuffle(createGameBoard(animals, difficult.diffCardsNum[idx]))
        );
        addBackgroundImageToAllCards(gameState);
        cards.resetFlipedCardsArr();
        observeNumOfFlippedCards(gameState);
        addFlipCardEvent(gameState);
    }, 1000);
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
    players[playerMode.turn].timer.time.value = 0;
    players[playerMode.turn].timer.time.nukeListeners();
    observeTime(players[playerMode.turn].timer);

    players[playerMode.turn].intervalID = setInterval(() => {
        if (true) {
            players[playerMode.turn].timer.time.value += 1;
        } else {
            //! when we add player 2
        }
    }, 1000);
}

/**
 * @description check if game is over update the score pop up the game end and listen to a new game click
 */
export function checkGameOver() {
    if (
        gameState.playerMode.players[0].numOfCorrect.value ===
        gameState.difficult.coupleNum
    ) {
        clearInterval(gameState.playerMode.players[0].intervalID);
        setTimeout(() => (gameState.endGameEl.style.display = "flex"), 800);

        updateFinalScore(gameState);
        gameState.endGameBtn.addEventListener("click", () => {
            removeFlipCardEvent(gameState);
            gameState.endGameEl.style.display = "none";
            gameState.difficult.difficultyContainer.style.display = "grid";
        });
    }
}

/**
 * @description updates the score at a game end
 * @param {{playerMode: {players: Sidebar[]}, difficult: {coupleNum: Number}}} Obj
 */

function updateFinalScore({
    playerMode: { players },
    difficult: { coupleNum },
}) {
    const timeFactor = 5000,
        failFactor = 30,
        diffFactor = 20;
    let timeBonus = (coupleNum * timeFactor) / players[0].timer.time.value;
    let failPenalty = (players[0].numOfFail.value * failFactor) / coupleNum;
    let difficultyBonus = diffFactor * coupleNum;
    let total = timeBonus + difficultyBonus - failPenalty;

    players[0].scoreNum.value =
        total > coupleNum * diffFactor ? total | 0 : coupleNum * diffFactor;
}

/**
 * @description huh ? u dont need this here, its self explanatory dummy !! :P
 * @param { {playerMode: {players: sidebar[]}} } Obj
 */
function addGameOverListener({ playerMode: { players } }) {
    players[0].numOfCorrect.addChangeListener(checkGameOver);
}

/**
 *
 * @param {String[]} animals
 * @param {Number} cardCouples
 * @returns array filled with couples of animal names
 */
function createGameBoard(animals, cardCouples) {
    if (animals.length < cardCouples) {
        return "Error occured. Please check array's size";
    }
    const gameBoard = [];
    for (let i = 0; i < cardCouples; i++) {
        gameBoard.push(animals[i]);
        gameBoard.push(animals[i]);
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
    let random;
    const newShuffledArray = new Array();

    for (let i = 0; i < array.length; i++) {
        random = getRandomIntInclusive(0, array.length - 1);
        while (newShuffledArray[random] !== undefined) {
            random = getRandomIntInclusive(0, array.length - 1);
        }
        newShuffledArray[random] = array[i];
    }
    return newShuffledArray;
}

/**
 *
 * @param {Number} min
 * @param {Number} max
 * @returns random number between min and max
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @description Add the background image to all cards
 * @param {{cards: Cards}} Obj
 */

const addBackgroundImageToAllCards = ({ cards }) => {
    cards.getAllCards().forEach((card) => {
        card.classList.add("box-shadow");
        const [cardType, backCard, frontCard] = getElementsForCard(card);
        applyStylesToCard(backCard, `./assets/img/animals/${cardType}.webp`);
        applyStylesToCard(frontCard, `./assets/img/front/paw1.png`);
    });
};

const getElementsForCard = (card) => [
    card.getAttribute("data-type"),
    card.lastChild,
    card.firstChild,
];

const applyStylesToCard = (cardEl, imgSrc) => {
    const imgEl = document.createElement("img");
    imgEl.src = imgSrc;
    imgEl.classList.add("item-img");
    cardEl.appendChild(imgEl);
    cardEl.style = "display: flex; justify-content: center;";
    cardEl.classList.add("center-img");
};

const addClickEventToScoreboard = ({ endGame }) => {
    endGame.scoreboardBtn.addEventListener("click", toggleScoreboardDisplay);
    endGame.closeScoreboard.addEventListener("click", toggleScoreboardDisplay);
};

const toggleScoreboardDisplay = () => {
    gameState.endGame.scoreboardContainer.style.display =
        gameState.endGame.scoreboardContainer.style.display === "grid"
            ? "none"
            : "grid";
};

addClickEventToScoreboard(gameState);

displayTime();
