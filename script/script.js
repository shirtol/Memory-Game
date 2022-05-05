import {
    addFlipCardEvent,
    observeNumOfFlippedCards,
    isIdenticalCards,
    Cards,
    removeFlipCardEvent,
} from "./Cards.js";
import { observeTime, Timer } from "./Timer.js";
import { GameState } from "./GameState.js";
import { observeChangesInCardsResults } from "./Sidebar.js";

const gameState = new GameState();

startGame();

function startGame() {
    difficultyMenu(gameState);
    addDifficultyToContainer(gameState);
    observeChangesInCardsResults(gameState);
    pickDifficulty();
    gameState.difficult.difficultyContainer.style.display = "grid";
}

function difficultyMenu({ difficult }) {
    document.querySelector(".new-game-btn").addEventListener("click", () => {
        removeFlipCardEvent(gameState);
        difficult.difficultyContainer.style.display =
            difficult.difficultyContainer.style.display === "grid"
                ? "none"
                : "grid";
    });
}

function addDifficultyToContainer({ difficult }) {
    for (const difficulty of difficult.difficulties) {
        const difficultyEl = document.createElement("div");
        difficultyEl.setAttribute("data-difficulty", difficulty);
        difficultyEl.textContent = `${difficulty}`;
        difficultyEl.classList.add("center-img");
        difficult.difficultyContainer.appendChild(difficultyEl);
    }
}

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
 *
 * @param {{cards: Cards, sidebar: Sidebar, difficult: Difficulty, animals: string[]}} Obj
 * @param {number} idx
 */
function resetPickedDifficulty({ cards, sidebar, difficult, animals }, idx) {
    document.querySelector(".cards-container").innerHTML = ""; //!Why not use textContent?
    cards.numOfCorrect.value = 0;
    cards.numOfFail.value = 0;
    clearInterval(sidebar.intervalID);
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

function setGridSize(size) {
    const container = document.querySelector(".cards-container");
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
}

/**
 *
 * @param {{sidebar : Sidebar, timer: Timer}} obj
 */
function timer({ sidebar, timer }) {
    timer.time.value = 0;
    timer.time.nukeListeners();
    observeTime(timer);

    sidebar.intervalID = setInterval(() => {
        if (true) {
            timer.time.value += 1;
        } else {
        }
        //! settimeout limit if needed to end game here.
        // if(mins === 60){

        // }
    }, 1000);
}

//! for now nothing happens when gameover except adds 10 to score, need to reset or decide how to go on from here.
export function checkGameOver() {
    if (gameState.cards.numOfCorrect.value === gameState.difficult.coupleNum) {
        clearInterval(gameState.sidebar.intervalID);
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
 *
 * @param {{timer: Timer, cards: Cards, difficult: {coupleNum: Number}}} Obj
 */

function updateFinalScore({ timer, cards, difficult: { coupleNum } }) {
    const timeFactor = 5000,
        failFactor = 30,
        diffFactor = 20;
    let timeBonus = (coupleNum * timeFactor) / timer.time.value;
    let failPenalty = (cards.numOfFail.value * failFactor) / coupleNum;
    let difficultyBonus = diffFactor * coupleNum;
    let total = timeBonus + difficultyBonus - failPenalty;

    cards.scoreNum.value =
        total > coupleNum * diffFactor ? total | 0 : coupleNum * diffFactor;
}

//! gotta move this to a better place (maybe along with the call back checkGameOver)
gameState.cards.numOfCorrect.addChangeListener(checkGameOver);

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gameBoardloop(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        createGridElements(gameBoard[i]);
    }
}

//////////////////////////////////////////////////////////////////////////

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
        // i < 2 ? cardWrap.appendChild(frontBackCardScene) : 0; //! why not use if statement? because if the condition returns false then we don't do nothing..
        if (i === 2) {
            frontBackCardScene.appendChild(cardWrap);
            grid.appendChild(frontBackCardScene);
        }
    }
}

//? shufle ------------------

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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @description Add the background image to all cards
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
