import {
    addFlipCardEvent,
    observeNumOfFlippedCards,
    isIdenticalCards,
} from "./Cards.js";
import { GameState } from "./GameState.js";

const gameState = new GameState();

observeNumOfFlippedCards(gameState);
addFlipCardEvent(gameState);

function timer() {
    const timerCount = document.querySelector(".timer .count");
    let p1seconds = 0,
        p2seconds = 0,
        p1mins = 0,
        p2mins = 0;
    setInterval(() => {
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
timer();

//! need to pass cards number of pairs and the counter of successes.
function gameOver(successCounter, cardsNum) {
    if (successCounter === cardsNum) {
        return true;
    }
    return false;
}

//! pass the guessesCount array from the game main obj
function updateCounters({ sidebar, cards }) {
    //! put flipCard func insted of true to see if second card flip is success or fail
    if (isIdenticalCards(cards)) {
        sidebar.correctGuesses.innerText =
            parseInt(sidebar.correctGuesses.innerText) + 1;
    } else {
        sidebar.incorrectGuesses.innerText =
            parseInt(sidebar.incorrectGuesses.innerText) + 1;
    }
}

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

function createGameBoard(array, rows, cols) {
    //checked
    if (array.length !== rows * cols)
        return "Error occured. Please check array's size";
    else {
        const gameBoard = Array.from(Array(rows), () => new Array());
        // console.log(gameBoard);
        let c = 0;
        let newAnimals = new Array();
        for (let i = 0; i < gameBoard.length; i++) {
            newAnimals = animals.slice(c, (c = c + cols));
            console.log(newAnimals);

            for (let b = 0, j = 0; b < newAnimals.length, j < cols; b++, j++) {
                gameBoard[i].push(newAnimals[b]);
            }
        }
        console.log(gameBoard);
    }
}
console.log(createGameBoard(animals, 3, 4));

////////////////////////////////////////////////////////////////////////////////////////////////////

function gameBoardloop(gameBoard) {
    ////checked
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            createGridElements(gameBoard[i][j]);
            // console.log(gameBoard[i][j]);
        }
    }
}
// console.log(gameBoardloop(board));
//////////////////////////////////////////////////////////////////////////

const grid = document.querySelector(".cards-container");

function createGridElements(item) {
    ////checked
    const cardScene = document.createElement("div");
    const cardWrap = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");
    cardScene.classList.add("card-scene");
    cardWrap.classList.add("card");
    cardWrap.classList.setAttribute("data-type", item);
    front.classList.add("card-front");
    back.classList.add("card-back");
    cardWrap.appendChild(front);
    cardWrap.appendChild(back);
    cardScene.appendChild(cardWrap);
    grid.appendChild(cardScene);
}

// console.log(createGridElements("cat"));
////////////////////////////////////////////////////////////////////////////////////////

function shuffle(array) {
    ////checked
    let random;
    const newShuffledArray = new Array();
    console.log(newShuffledArray);

    for (let i = 0; i < array.length; i++) {
        random = getRandomIntInclusive(0, array.length - 1);
        while (newShuffledArray[random] !== undefined) {
            random = getRandomIntInclusive(0, array.length - 1);
        }
        newShuffledArray[random] = array[i];
    }
    console.log(newShuffledArray);
}
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getRandomIntInclusive(min, max) {
    ////checked
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// console.log(getRandomIntInclusive(0,12));

console.log(shuffle(animals));
