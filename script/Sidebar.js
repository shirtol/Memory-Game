import { Timer } from "./Timer.js";
import { Observable } from "./Observable.js";

/**
 * @description This constructor holds all the elements and methods related to the sidebar element
 * @class
 */

export const Sidebar = function (
    correctContainer,
    incorrectContainer,
    scoreContainer,
    timeContainer
) {
    /**
     * @type {HTMLElement}
     */
    this.correctGuesses = document.querySelector(correctContainer);
    /**
     * @type {HTMLElement}
     */
    this.incorrectGuesses = document.querySelector(incorrectContainer);
    /**
     * @type {HTMLElement}
     */
    this.score = document.querySelector(scoreContainer);
    /**
     * @type {HTMLElement}
     */
    this.timerView = document.querySelector(timeContainer);

    /**
     * @type {Timer}
     */
    this.timer = new Timer();

    /**
     *
     * @type {Observable}
     */
    this.numOfCorrect = new Observable(0);

    /**
     * @type {Observable}
     */
    this.scoreNum = new Observable(0);

    /**
     *
     * @type {Observable}
     */
    this.numOfFail = new Observable(0);
};

/**
 * @param {GameState} gameState
 */
export const observeChangesInCardsResults = (gameState) => {
    gameState.playerMode.players.forEach((player) => {
        player.numOfCorrect.addChangeListener((correctCount) =>
            updateSuccessCounts(gameState, correctCount)
        );
        player.numOfFail.addChangeListener((failCount) =>
            updateFailsCounts(gameState, failCount)
        );
        player.scoreNum.addChangeListener((newScore) =>
            updateScore(player.score, newScore)
        );
    });
};

const updateSuccessCounts = (
    { playerMode, playerMode: { players } },
    newSuccessCounts
) =>
    (players[playerMode.turn.value].correctGuesses.textContent =
        newSuccessCounts);

const updateFailsCounts = (
    { playerMode, playerMode: { players } },
    newFailCounts
) =>
    (players[playerMode.turn.value].incorrectGuesses.textContent =
        newFailCounts);

const updateScore = (scoreContainer, newScore) => {
    scoreContainer.textContent =
        parseInt(scoreContainer.textContent) + newScore;
};

/**
 *
 * @param {number} turn
 */
export const togglePlayerTxtColor = () => {
    document.querySelector(".player1").classList.toggle("curr-player");
    document.querySelector(".player2").classList.toggle("curr-player");
};
