import { Timer } from "./Timer.js";
import { Observable } from "./Observable.js";

/**
 * @description This constructor holds all the elements and methods related to the sidebar element
 * @type {Sidebar}
 * @class
 */

export const Sidebar = function (correctContainer, incorrectContainer, scoreContainer, timeContainer) {
    this.correctGuesses = document.querySelector(correctContainer);
    this.incorrectGuesses = document.querySelector(incorrectContainer);
    this.score = document.querySelector(scoreContainer);
    this.timerView = document.querySelector(timeContainer);
    
    /**
     * @type {Timer}
     */
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
    gameState.playerMode.players.forEach((player) => {
        player.numOfCorrect.addChangeListener((correctCount) =>
        updateSuccessCounts(gameState, correctCount)
    );
        player.numOfFail.addChangeListener((failCount) =>
        updateFailsCounts(gameState, failCount)
    );
        player.scoreNum.addChangeListener((newScore) =>
        updateScore(gameState, newScore)
    );
    }) 
};

const updateSuccessCounts = ({ playerMode, playerMode: {players} }, newSuccessCounts) =>
    (players[playerMode.turn].correctGuesses.textContent = newSuccessCounts);

const updateFailsCounts = ({ playerMode, playerMode: {players} }, newFailCounts) =>
    (players[playerMode.turn].incorrectGuesses.textContent = newFailCounts);

const updateScore = ({ playerMode, playerMode: {players} }, newScore) =>  {
    players[playerMode.turn].score.textContent = parseInt(players[playerMode.turn].score.textContent) + newScore;
    //! temporary here, need to decide if to show only score on popup or how it got calculated too, (eg: you finnished in X minutes and have 10 wrong guesses so ur score is XY..)
    document.querySelector("#scoreShow").textContent = `Score: ${newScore}`;
}
