/**
 * @description This constructor holds the difficulty menu list, number of couples of cards array, the amount picked and the container.
 * @class
 */
export class Difficulty {
    /**
     * @type {string[]}
     */
    static get difficulties() {
        return ["easy", "medium", "hard", "ninja"];
    }
    constructor() {
        /**
         * @type {number[]}
         */
        this.diffCardsNum = [8, 18, 32, 50];

        /**
         * @type {number}
         */
        this.coupleNum = 0;

        /**
         * @type {HTMLElement}
         */
        this.difficultyContainer = document.querySelector(
            ".difficulty-container"
        );

        /**
         * @type {string}
         */
        this.chosenDifficulty = undefined;

        /**
         * @type {() => HTMLElement}
         */
        this.getDifficulty = () =>
            document.querySelectorAll("[data-difficulty]");
    }
}
