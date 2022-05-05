import { Timer } from "./Timer.js";
import { Observable } from "./Observable.js";

/**
 * @description This constructor holds all the elements and methods related to the sidebar element
 * @class
 */

export const Sidebar = function (correctContainer, incorrectContainer, scoreContainer) {
    this.correctGuesses = document.querySelector(correctContainer);
    this.incorrectGuesses = document.querySelector(incorrectContainer);
    this.score = document.querySelector(scoreContainer);
    this.timer = new Timer();
    this.intervalID = 0;
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

export const observeChangesInCardsResults = (gameState) => {
    gameState.playerMode.players[0].numOfCorrect.addChangeListener((correctCount) =>
        updateSuccessCounts(gameState, correctCount)
    );
    gameState.playerMode.players[0].numOfFail.addChangeListener((failCount) =>
        updateFailsCounts(gameState, failCount)
    );
    gameState.playerMode.players[0].scoreNum.addChangeListener((newScore) =>
        updateScore(gameState, newScore)
    );
};

const updateSuccessCounts = ({ playerMode: {players} }, newSuccessCounts) =>
    (players[0].correctGuesses.textContent = newSuccessCounts);

const updateFailsCounts = ({ playerMode: {players} }, newFailCounts) =>
    (players[0].incorrectGuesses.textContent = newFailCounts);

const updateScore = ({ playerMode: {players} }, newScore) =>  {
    players[0].score.textContent = parseInt(players[0].score.textContent) + newScore;
    //! temporary here, need to decide if to show only score on popup or how it got calculated too, (eg: you finnished in X minutes and have 10 wrong guesses so ur score is XY..)
    document.querySelector("#scoreShow").textContent = `Score: ${newScore}`;
}
