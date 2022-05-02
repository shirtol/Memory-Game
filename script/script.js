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
    "eagle",
    "rabbit",
    "wolf",
    "lion",
    "turtle",
    "mouse",
    "donkey",
    "zebra",
    "elephant",
    "giraffe",
    "bear",
    "tiger",
    "monkey",
    "ostrich",
    "kangaroo",
    "hippo",
    "rhino",
    "deer",
    "cow",
    "sheep",
    "shark",
    "fox",
    "camel",
    "goat",
    "penguin",
    "frog",
    "hamster",
    "pig",
    "squirrel",
    "chicken",
    "cheetah",
    "panda",
    "hyena",
    "alligator",
    "ant",
    "crab",
    "rat",
    "buffalo",
    "leopard",
    "bee",
    "flamingo",
    "turkey",
    "iguana",
    "sloth",
    "hedgehog",
    "whale",
];

gameBoardloop(shuffle(createGameBoard(animals, 18)));
observeNumOfFlippedCards(gameState);
addFlipCardEvent(gameState);

//! ill explain, hope i didnt screw everything xDDDD
resetGame(gameState);

function resetGame({cards, sidebar}){
    document.querySelector(".new-game-btn").addEventListener("click",() =>{
        document.querySelector(".cards-container").innerHTML = "";
        sidebar.correctGuesses.innerText = "0";
        sidebar.incorrectGuesses.innerText = "0";
        clearInterval(sidebar.intervalID);
        timer(gameState);
        setTimeout(()=>{
            gameBoardloop(shuffle(createGameBoard(animals, 18)));
            cards.resetFlipedCardsArr();
            observeNumOfFlippedCards(gameState);
            addFlipCardEvent(gameState);
        }, 1000);
    });
}

function timer({sidebar}) {
    const timerCount = document.querySelector(".timer .count");
    let p1seconds = -1,
        p2seconds = 0,
        p1mins = 0,
        p2mins = 0;
    sidebar.intervalID =  setInterval(() => {
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

function createGameBoard(array, cardCouples) {
    if (array.length < cardCouples){
        return "Error occured. Please check array's size";
    }
    const gameBoard = [];
    for (let i = 0; i < cardCouples; i++) {
        gameBoard.push(array[i]);
        gameBoard.push(array[i]);
    }
    return gameBoard;
}

// console.log(createGameBoard(animals, 3, 4));

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
    for(let i = 0; i < 3; i++){
        const frontBackCardScene = document.createElement("div");
        frontBackCardScene.classList.add(keywords[i]);
        i < 2 ? cardWrap.appendChild(frontBackCardScene) : 0;
        if(i === 2){
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

// console.log(shuffle(animals));
