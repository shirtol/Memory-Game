import {
    addFlipCardEvent,
    observeNumOfFlippedCards,
    isIdenticalCards,
} from "./Cards.js";
import { GameState } from "./GameState.js";

const gameState = new GameState();

const animals = [
    "dog",
    "cat",
    "duck",
    "horse",
    "cat",
    "dog",
    "horse",
    "duck",
    "mouse",
    "mouse",
    "donkey",
    "donkey",
];

gameBoardloop(createGameBoard(shuffle2(animals), 3, 4));
observeNumOfFlippedCards(gameState);
addFlipCardEvent(gameState);

//! ill explain, hope i didnt screw everything xDDDD
resetGame(gameState);

function resetGame({ cards, sidebar }) {
    document.querySelector(".new-game-btn").addEventListener("click", () => {
        document.querySelector(".cards-container").innerHTML = "";
        sidebar.correctGuesses.innerText = "0";
        sidebar.incorrectGuesses.innerText = "0";
        clearInterval(sidebar.intervalID);
        timer(gameState);
        setTimeout(() => {
            gameBoardloop(createGameBoard(shuffle2(animals), 3, 4));
            cards.resetFlipedCardsArr();
            observeNumOfFlippedCards(gameState);
            addFlipCardEvent(gameState);
        }, 1000);
    });
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
timer(gameState);

//! need to pass cards number of pairs and the counter of successes.
function gameOver(successCounter, cardsNum) {
    if (successCounter === cardsNum) {
        return true;
    }
    return false;
}

//! pass the guessesCount array from the game main obj
function updateCounters({ sidebar, cards }) {
    if (isIdenticalCards(cards)) {
        sidebar.correctGuesses.innerText =
            parseInt(sidebar.correctGuesses.innerText) + 1;
    } else {
        sidebar.incorrectGuesses.innerText =
            parseInt(sidebar.incorrectGuesses.innerText) + 1;
    }
}

// function createGameBoard(array, rows, cols) {
//     //checked
//     if (array.length !== rows * cols)
//         return "Error occured. Please check array's size";
//     else {
//         const gameBoard = Array.from(Array(rows), () => new Array());
//         // console.log(gameBoard);
//         let c = 0;
//         let newAnimals = new Array();
//         for (let i = 0; i < gameBoard.length; i++) {
//             newAnimals = array.slice(c, (c = c + cols));
//             // console.log(newAnimals);

//             for (let b = 0, j = 0; b < newAnimals.length, j < cols; b++, j++) {
//                 gameBoard[i].push(newAnimals[b]);
//             }
//         }
//         console.log(gameBoard);
//     }
// }

function createGameBoard(array, rows, cols) {
    if (array.length !== rows * cols) {
        return "Error occured. Please check array's size";
    }
    const gameBoard = [];
    let c = 0;
    for (let i = 0; i < rows; i++) {
        const newAnimals = array.slice(c, (c = c + cols));
        gameBoard.push(newAnimals);
    }
    return gameBoard;
}

// console.log(createGameBoard(animals, 3, 4));

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gameBoardloop(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            createGridElements(gameBoard[i][j]);
        }
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

// function createGridElements(item) {
//     const grid = document.querySelector(".cards-container");
//     ////checked
//     const cardScene = document.createElement("div");
//     const cardWrap = document.createElement("div");
//     const front = document.createElement("div");
//     const back = document.createElement("div");
//     cardScene.classList.add("card-scene");
//     cardWrap.classList.add("card");
//     cardWrap.setAttribute("data-type", item);
//     front.classList.add("card-front");
//     back.classList.add("card-back");
//     cardWrap.appendChild(front);
//     cardWrap.appendChild(back);
//     cardScene.appendChild(cardWrap);
//     grid.appendChild(cardScene);
// }

//?  ---------------------- pick one shuffle ---------------------------
function shuffle(array) {
    let random;
    const newShuffledArray = new Array();

    for (let i = 0; i < array.length; i++) {
        random = getRandomIntInclusive(0, array.length - 1);
        while (newShuffledArray[random] !== undefined) {
            random = getRandomIntInclusive(0, array.length - 1);
        }
        console.log(random);
        newShuffledArray[random] = array[i];
    }
    console.log(newShuffledArray);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// console.log(shuffle(animals));

//? -------------------------------------------
function shuffle2(array) {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = (Math.random() * currentIndex) | 0;
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
}

//   console.log(shuffle2(animals));

/**
 * @description Add the background image to all cards
 */

const addBackgroundImageToAllCards = ({ cards }) => {
    cards.getAllCards().forEach((card) => {
        const cardType = card.getAttribute("data-type");
        const backCard = card.lastChild;
        backCard.style.backgroundImage = `url(../assets/img/${cardType}.webp)`;
        backCard.classList.add("center-img");
    });
};

addBackgroundImageToAllCards(gameState);

addBackgroundImageToAllCards(gameState);
