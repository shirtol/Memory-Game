import { Observable } from "./Observable.js";

/**
 * @description This constructor holds all the elements and methods related to the sidebar element
 * @class
 */

export const Sidebar = function () {
    this.correctGuesses = document.querySelector(".correct-count");
    this.incorrectGuesses = document.querySelector(".incorrect-count");
    this.intervalID = 0;
};

export const observeChangesInCardsResults = (gameState) => {
    gameState.cards.numOfCorrect.addChangeListener((correctCount) =>
        updateSuccessCounts(gameState, correctCount)
    );
    gameState.cards.numOfFail.addChangeListener((failCount) =>
        updateFailsCounts(gameState, failCount)
    );
};

const updateSuccessCounts = ({ sidebar }, newSuccessCounts) =>
    (sidebar.correctGuesses.textContent = newSuccessCounts);

const updateFailsCounts = ({ sidebar }, newFailCounts) =>
    (sidebar.incorrectGuesses.textContent = newFailCounts);
