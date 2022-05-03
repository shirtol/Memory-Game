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
