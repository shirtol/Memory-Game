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
     *
     * @param {Scoreboard} scoreboard
     */
    addClickEventToDiffScoreboard = (scoreboard) => {
        for (let i = 0; i < this.difficultyScores.length; i++) {
            this.difficultyScores[i].addEventListener("click", (_) => {
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
        document
            .querySelector(".first-place")
            .setAttribute("data-timeScore", secondToTimeStr(timesArr[0] ?? 0));
        document
            .querySelector(".second-place")
            .setAttribute("data-timeScore", secondToTimeStr(timesArr[1] ?? 0));
        document
            .querySelector(".third-place")
            .setAttribute("data-timeScore", secondToTimeStr(timesArr[2] ?? 0));
    };
}
