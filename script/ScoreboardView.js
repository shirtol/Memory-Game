import { Difficulty } from "./Difficulty.js";
import { secondToTimeStr } from "./Timer.js";

/**
 * @class
 */
export class ScoreboardView {
    /**
     *
     * @param {Scoreboard} scoreboard
     */
    constructor(scoreboard) {
        /**
         * @type {HTMLElement}
         */
        this.scoreboardBtn = document.querySelector(".score-board-btn");

        /**
         * @type {HTMLElement}
         */
        this.scoreboardContainer = document.querySelector(
            ".scoreboard-container"
        );

        /**
         * @type {HTMLElement}
         */
        this.closeScoreboard = document.querySelector(".fa-xmark");

        /**
         * @type {HTMLCollection}
         */
        this.difficultyScores =
            document.querySelector("#difficulty-score").children;

        this.addClickEventToDiffScoreboard(scoreboard);
    }

    /**
     * @param {Scoreboard} scoreboard
     */
    addClickEventToDiffScoreboard = (scoreboard) => {
        for (let i = 0; i < this.difficultyScores.length; i++) {
            this.difficultyScores[i].addEventListener("click", () => {
                this.displayTime(
                    scoreboard.bestTimeScore[Difficulty.difficulties[i]]
                );
            });
        }
    };

    /**
     * @param {number[]} timesArr Array of best 3 times of the user
     */
    displayTime = (timesArr) => {
        this.stylePodiumPlace("first", timesArr[0]);
        this.stylePodiumPlace("second", timesArr[1]);
        this.stylePodiumPlace("third", timesArr[2]);
    };

    /**
     * @param {string} placeStr
     * @param {number} time
     */
    stylePodiumPlace = (placeStr, time) => {
        const podiumEl = document.querySelector(`.${placeStr}-place`);

        podiumEl.setAttribute("data-timeScore", secondToTimeStr(time ?? 0));
        podiumEl.classList.remove(`${placeStr}-place-animate`);
        void podiumEl.offsetWidth;
        podiumEl.classList.add(`${placeStr}-place-animate`);
    };
}
