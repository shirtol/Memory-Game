import { Observable } from "./Observable.js";

/**
 * @description This constructor holds all the elements and methods related to the sidebar element
 * @class
 */

export const Sidebar = function () {
    this.correctGuesses = document.querySelector(".correct-count");
    this.incorrectGuesses = document.querySelector(".incorrect-count");
    this.score = document.querySelector(".score-count");
    this.intervalID = 0;
};

export const observeChangesInCardsResults = (gameState) => {
    gameState.cards.numOfCorrect.addChangeListener((correctCount) =>
        updateSuccessCounts(gameState, correctCount)
    );
    gameState.cards.numOfFail.addChangeListener((failCount) =>
        updateFailsCounts(gameState, failCount)
    );
    gameState.cards.scoreNum.addChangeListener((newScore) =>
        updateScore(gameState, newScore)
    );
};

const updateSuccessCounts = ({ sidebar }, newSuccessCounts) =>
    (sidebar.correctGuesses.textContent = newSuccessCounts);

const updateFailsCounts = ({ sidebar }, newFailCounts) =>
    (sidebar.incorrectGuesses.textContent = newFailCounts);

const updateScore = ({ sidebar }, newScore) =>  {
    sidebar.score.textContent = parseInt(sidebar.score.textContent) + newScore;
    //! temporary here, need to decide if to show only score on popup or how it got calculated too, (eg: you finnished in X minutes and have 10 wrong guesses so ur score is XY..)
    document.querySelector("#scoreShow").textContent = `Score: ${newScore}`;
}
