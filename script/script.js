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

startGame();

/**
 * @description call for menu elements of difficulty and gameMode, starts card oberver and starts by picking difficulty function
 */
function startGame() {
    gameModeMenu(gameState);
    difficultyMenu(gameState);
    addDifficultyToContainer(gameState.difficult.difficultyContainer);

    addGameModeToContainer(gameState);
    gameModeListener(gameState);
    difficultyListener(gameState);
}

function gameModeListener({ playerMode }) {
    document.querySelector(".new-game-btn").style =
        "pointer-events: none; opacity: 0.5;";
    const modeBtn = document.querySelector(".change-mode-btn");
    modeBtn.style = "pointer-events: none; opacity: 0.5;";
    playerMode.modeContainer.addEventListener("click", (ev) => {
        gameState.media.playSoundLoop("bgSound");
        gameState.media.playSound("click");
        switch (ev.target.getAttribute("data-mode")) {
            case "Solo":
                playerMode.pickedMode = "onePlayer";
                document.querySelector(".player2").style.display = "none";
                document.querySelector(".player1-title").style.display = "none";
                break;
            case "One Vs One":
                playerMode.pickedMode = "twoPlayer";
                document.querySelector(".player2").style.display = "flex";
                document.querySelector(".player1-title").style.display =
                    "block";
                break;
            default:
                return;
        }
        resetPlayerTwoElements();
        updatePlayersArr(playerMode);
        playerMode.modeContainer.style.display = "none";
        modeBtn.style = "pointer-events: none; opacity: 0.5;";
        gameState.difficult.difficultyContainer.style.display = "grid";
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

function updatePlayersArr(playerMode) {
    if (
        playerMode.pickedMode === "onePlayer" &&
        playerMode.players.length === 2
    ) {
        playerMode.players.pop();
    } else if (
        playerMode.pickedMode === "twoPlayer" &&
        playerMode.players.length === 1
    ) {
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
 * @description pops up the gameMode menu when clicking the game mode button
 * @param { {playerMode: PlayerMode} } Obj
 */
function gameModeMenu({ playerMode }) {
    document.querySelector(".change-mode-btn").addEventListener("click", () => {
        playerMode.modeContainer.style.display =
            playerMode.modeContainer.style.display === "grid" ? "none" : "grid";
        const newGameBtn = document.querySelector(".new-game-btn");
        if (playerMode.modeContainer.style.display === "none") {
            addFlipCardEvent(gameState);
            newGameBtn.style = "Pointer-events: auto; opacity: 1";
            timer(gameState);
            gameState.media.playSound("popDown2");
        } else {
            removeFlipCardEvent(gameState);
            newGameBtn.style = "Pointer-events: none; opacity: 0.5";
            clearInterval(playerMode.intervalID);
            gameState.media.playSound("popUp2");
        }
    });
}

/**
 * @description pops up the difficulty menu when clicking the new game button
 * @param {{ difficult: Difficulty }} Obj
 */
function difficultyMenu({ playerMode, difficult }) {
    document.querySelector(".new-game-btn").addEventListener("click", () => {
        difficult.difficultyContainer.style.display =
            difficult.difficultyContainer.style.display === "grid"
                ? "none"
                : "grid";
        const modBtn = document.querySelector(".change-mode-btn");
        if (difficult.difficultyContainer.style.display === "none") {
            addFlipCardEvent(gameState);
            modBtn.style = "Pointer-events: auto; opacity: 1";
            timer(gameState);
            gameState.media.playSound("popDown");
        } else {
            removeFlipCardEvent(gameState);
            modBtn.style = "Pointer-events: none; opacity: 0.5";
            clearInterval(playerMode.intervalID);
            gameState.media.playSound("popUp");
        }
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
function addDifficultyToContainer(container) {
    for (const difficulty of Difficulty.difficulties) {
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
        gameState.difficult.coupleNum = gameState.difficult.diffCardsNum[index];
        document.querySelector(".new-game-btn").style =
            "pointer-events: auto; opacity: 1;";
        document.querySelector(".change-mode-btn").style =
            "pointer-events: auto; opacity: 1;";
        gameState.difficult.chosenDifficulty = Difficulty.difficulties[index];
        gameState.media.playSound("deal");
        resetPickedDifficulty(gameState, index);
    });
}

/**
 * @description resets all elements and starts again all initiations for a newgame or at start
 * @param {{cards: Cards, playerMode: PlayerMode, difficult: Difficulty, theme: Theme}} Obj
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
    setTimeout(() => {
        gameBoardloop(
            shuffle(
                createGameBoard(theme.itemsTheme, difficult.diffCardsNum[idx])
            )
        );
        addBackgroundImageToAllCards(gameState);
        cards.resetFlipedCardsArr();
        observeNumOfFlippedCards(gameState);
        addGameOverListener(gameState);
        observeChangesInCardsResults(gameState);
        addFlipCardEvent(gameState);
    }, 1600);
}

function resetCardsContainer() {
    const gameCon = document.querySelector(".game-container");
    const newCardContainer = document.createElement("div");
    document.querySelector(".cards-container").remove();
    newCardContainer.classList.add("cards-container");
    gameCon.appendChild(newCardContainer);
}

function resetPlayers(players) {
    players.forEach((player) => {
        player.numOfCorrect.value = 0;
        player.numOfCorrect.nukeListeners();
        player.numOfFail.value = 0;
        player.numOfFail.nukeListeners();
        player.scoreNum.nukeListeners();
        player.timer.time.nukeListeners();
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
 * @param {*} param0
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
function createGameBoard(itemsTheme, cardCouples) {
    if (itemsTheme.length < cardCouples) {
        return "Error occured. Please check array's size";
    }
    const gameBoard = [];
    for (let i = 0; i < cardCouples; i++) {
        gameBoard.push(itemsTheme[i]);
        gameBoard.push(itemsTheme[i]);
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
 * @param {{cards: Cards, theme: Theme}} Obj
 */

const addBackgroundImageToAllCards = ({ cards, theme }) => {
    cards.getAllCards().forEach((card) => {
        card.classList.add("box-shadow");
        const [cardType, backCard, frontCard] = getElementsForCard(card);
        applyStylesToCard(
            backCard,
            `./assets/img/${theme.pickedTheme}/${cardType}.webp`
        );
        applyStylesToCard(
            frontCard,
            `./assets/img/front/${theme.pickedTheme}.png`
        );
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

addClickEventToScoreboard(gameState);
