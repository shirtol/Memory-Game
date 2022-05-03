import {
    addFlipCardEvent,
    observeNumOfFlippedCards,
    isIdenticalCards,
} from "./Cards.js";
import { GameState } from "./GameState.js";

const gameState = new GameState();

startGame();

function startGame(){
    difficultyMenu(gameState);
    addDifficultyToContainer(gameState);
    pickDifficulty();
    gameState.difficult.difficultyContainer.style.display= "flex";
}

function difficultyMenu({ difficult }) {
    document.querySelector(".new-game-btn").addEventListener("click", () => {
        difficult.difficultyContainer.style.display =
            difficult.difficultyContainer.style.display === "flex"
                ? "none"
                : "flex";
    });
}

function addDifficultyToContainer ({ difficult }) {
    for (const difficulty of difficult.difficulties) {
        const difficultyEl = document.createElement("div");
        difficultyEl.setAttribute("data-difficulty", difficulty);
        difficultyEl.textContent = `${difficulty}`;
        difficultyEl.classList.add("center-img");
        difficult.difficultyContainer.appendChild(difficultyEl);
    }
};

function pickDifficulty(){
    const options = document.querySelector(".difficulty-container");
    let index = 0;
    options.addEventListener("click", (ev)=>{
        switch(ev.target.getAttribute("data-difficulty")){
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
                break;
        }
        resetPickedDifficulty(gameState, index);
    });
}

function resetPickedDifficulty({cards, sidebar, difficult, animals}, idx){
    document.querySelector(".cards-container").innerHTML = "";
    sidebar.correctGuesses.innerText = "0";
    sidebar.incorrectGuesses.innerText = "0";
    clearInterval(sidebar.intervalID);
    timer(gameState);
    document.querySelector(".difficulty-container").style.display = "none";
    setGridSize(difficult.diffCardsNum[idx] / (idx + 2));
    setTimeout(() => {
        gameBoardloop(shuffle(createGameBoard(gameState, difficult.diffCardsNum[idx]))); //!Change the second parameter in createGameBoard function to 6 instead of 18 duw to UI problem
        addBackgroundImageToAllCards(gameState);
        cards.resetFlipedCardsArr();
        observeNumOfFlippedCards(gameState);
        addFlipCardEvent(gameState);
    }, 1000);
}

function setGridSize(size){
    const container = document.querySelector(".cards-container");
    console.log(size);
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
}

function timer({ sidebar }) {
    const timerCount = document.querySelector(".timer .count");
    let p1seconds = -1,
        p2seconds = 0,
        p1mins = 0,
        p2mins = 0;
    sidebar.intervalID = setInterval(() => {
        if (true) {
            let total = p1mins < 10 ? "0" + p1mins : p1mins;
            p1seconds++;
            timerCount.innerText =
                p1seconds < 10
                    ? total + ":0" + p1seconds
                    : total + ":" + p1seconds;
            if (p1seconds === 59) {
                p1seconds = -1;
                p1mins++;
            }
        } else {
            let total = p2mins < 10 ? "0" + p2mins : p2mins;
            p2seconds++;
            timerCount.innerText =
                p2seconds < 10
                    ? total + ":0" + p2seconds
                    : total + ":" + p2seconds;
            if (p2seconds === 59) {
                p2seconds = -1;
                p2mins++;
            }
        }
        //! settimeout limit if needed to end game here.
        // if(mins === 60){

        // }
    }, 1000);
}

//! need to pass cards number of pairs and the counter of successes.
function gameOver(successCounter, cardsNum) {
    if (successCounter === cardsNum) {
        return true;
    }
    return false;
}

function createGameBoard({animals}, cardCouples) {
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
        i < 2 ? cardWrap.appendChild(frontBackCardScene) : 0;
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
        const cardType = card.getAttribute("data-type");
        const backCard = card.lastChild;
        const frontCard = card.firstChild;
        backCard.style.backgroundImage = `url(../assets/img/${cardType}.webp)`;
        // backCard.style.backgroundImage = `url(../assets/img/back-mobile/dog-mobile.png)`; //!Will remove when I end working on cutting the images of cards to the correct width and height
        backCard.classList.add("center-img");
        frontCard.style.backgroundImage = `url(../assets/img/front/paw1.png)`;
        frontCard.classList.add("center-img");
    });
};

