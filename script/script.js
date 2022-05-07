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
const timer = ({ playerMode, playerMode: { players } }) => {
    playerMode.intervalID = setInterval(() => {
        players[playerMode.turn].timer.time.value += 1;
    }, 1000);
};

/**
 * @description takes the bestime score obj that has all the 3 best scores for each difficulty, a new score, and updates the new difficulty with the 3 new best
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
export const checkGameOver = ({
    playerMode,
    difficult,
    scoreboard,
    endGameEl,
    endGameBtn,
}) => {
    const cardCouples = playerMode.players.reduce(
        (acc, player) => (acc += player.numOfCorrect.value),
        0
    );
    if (cardCouples === difficult.coupleNum) {
        clearInterval(playerMode.intervalID);
        playerMode.players.forEach((player) =>
            updateFinalScore(gameState, player)
        );
        let winner = setWinnerAndSetMsg(playerMode);
        updateScoreboard(
            scoreboard.bestTimeScore,
            difficult.chosenDifficulty,
            winner
        );
        popEndGame(difficult, endGameEl, endGameBtn);
    }
};

/**
 * @description checks if its 2 players mode, and who is the winner if so.. also takes care of the popup message content
 * @param {PlayerMode} playerMode
 * @returns a winner Sidebar obj to use for updating score
 */
const setWinnerAndSetMsg = (playerMode) => {
    const scoreMsg = document.querySelector("#scoreMsg");
    const scoreNum = document.querySelector("#scoreShow");
    let winner = playerMode.players[0];
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
    return winner;
};

/**
 * @description pops up the end game window on a win result, with the msg and score and options to continue.
 * @param {Difficulty} difficult
 * @param {ScoreboardView} endGameEl
 * @param {ScoreboardView} endGameBtn
 */
const popEndGame = (difficult, endGameEl, endGameBtn) => {
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
};

/**
 * @description updates the score at a game end
 * @param {{playerMode: PlayerMode, difficult: {coupleNum: Number}}} Obj
 * @param {Sidebar} player
 */

const updateFinalScore = ({ playerMode, difficult: { coupleNum } }, player) => {
    const timeFactor = 2500,
        diffiFactor = 25,
        failFactor = 100;
    let timeBonus = (coupleNum * timeFactor) / player.timer.time.value;
    let failPenalty = (player.numOfFail.value * failFactor) / coupleNum;
    let difficultyBonus = coupleNum * diffiFactor;
    let correctBonus =
        playerMode.pickedMode === "twoPlayer"
            ? player.numOfCorrect.value * 10 * coupleNum
            : 0;
    let total =
        ((timeBonus + difficultyBonus + correctBonus - failPenalty) *
            coupleNum) /
        8;

    player.scoreNum.value =
        total > coupleNum * diffiFactor ? total | 0 : coupleNum * diffiFactor;
};

/**
 * @description huh ? u dont need this here, its self explanatory dummy !! :P
 * @param { {playerMode: {players: Sidebar[]}} } Obj
 */
const addGameOverListener = ({ playerMode: { players } }) => {
    players.forEach((player) => {
        player.numOfCorrect.addChangeListener((_) => checkGameOver(gameState));
    });
};

/**
 * @description randomly chooses a cardCouples times a number from 1 to 50 of 50 different cards.
 * @param {Number} cardCouples
 * @returns array filled with couples of numbered items
 */
const createGameBoard = (cardCouples) => {
    const numsPool = Array.from(Array(50).keys());
    const gameBoard = [];
    while (gameBoard.length < cardCouples * 2) {
        let random = (Math.random() * numsPool.length) | 0;
        let removeVal = numsPool.splice(random, 1);
        gameBoard.push(`item${removeVal[0] + 1}`, `item${removeVal[0] + 1}`);
    }
    return gameBoard;
};

/**
 * @description loops over the cards items names to create DOM element for each one
 * @param {String[]} gameBoard
 */
const gameBoardloop = (gameBoard) => {
    for (let i = 0; i < gameBoard.length; i++) {
        createGridElements(gameBoard[i]);
    }
};

/**
 * @description takes a card number ID and create its DOM elements
 * @param {String} item
 */
const createGridElements = (item) => {
    const grid = document.querySelector(".cards-container");
    const keywords = ["card-front", "card-back", "card-scene"];
    const cardWrap = document.createElement("div");
    cardWrap.classList.add("card");
    cardWrap.setAttribute("data-type", item);
    createGridElementChildren(grid, keywords, cardWrap);
};

/**
 * @description builds the children of the parent container div of a card
 * @param {HTMLElement} grid
 * @param {string[]} keywords
 * @param {HTMLElement} cardWrap
 */
const createGridElementChildren = (grid, keywords, cardWrap) => {
    for (let i = 0; i < 3; i++) {
        const frontBackCardScene = document.createElement("div");
        frontBackCardScene.classList.add(keywords[i]);
        if (i < 2) cardWrap.appendChild(frontBackCardScene);
        if (i === 2) {
            frontBackCardScene.appendChild(cardWrap);
            grid.appendChild(frontBackCardScene);
        }
    }
};

/**
 *
 * @param {String} array
 * @returns shuffles array of animal names
 */
function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
}

/**
 * @description Add the background image to all cards
 * @param {{cards: Cards}} Obj
 * @param {string} pickedTheme
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

/**
 * @description listener to themes change buttons
 * @param {{theme: Theme}} obj
 */
const addChangeListenerToTheme = ({ theme }) => {
    theme.pickedTheme.addChangeListener((pickedTheme) =>
        addBackgroundImageToAllCards(gameState, pickedTheme)
    );
};

/**
 * @param {HTMLElement} card
 * @returns card type, first and last childs
 */
const getElementsForCard = (card) => [
    card.getAttribute("data-type"),
    card.lastChild,
    card.firstChild,
];

/**
 * @description creates and configures item image on start or theme change
 * @param {HTMLElement} cardEl
 * @param {string} imgSrc
 */
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

/**
 * @description click event on score board button in the win popup screen
 * @param {{scoreboardView: ScoreboardView, scoreboard: Scoreboard}} obj
 */
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

/**
 * @description exactly what the name of the function says :)
 */

const toggleScoreboardDisplay = () => {
    const style = gameState.scoreboardView.scoreboardContainer.style;
    style.display = style.display === "flex" ? "none" : "flex";
    if (style.display === "flex") gameState.media.playSound("scoreBoard");
};

/**
 * @description listeners to mute and unmute button
 * @param {{media: MediaPlayer}} obj
 */
const muteBtnListener = ({ media }) => {
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
};

/**
 * @description call for menu elements of difficulty and gameMode, starts card oberver and starts by picking difficulty function
 */
const startGame = () => {
    gameModeMenu(gameState);
    difficultyMenu(gameState);
    addDifficultyToContainer(gameState.difficult.difficultyContainer);

    addChangeListenerToTheme(gameState);
    addGameModeToContainer(gameState);
    gameModeListener(gameState);
    muteBtnListener(gameState);
    addClickEventToScoreboard(gameState);
    difficultyListener(gameState);
};

export const gameState = new GameState();
startGame();
