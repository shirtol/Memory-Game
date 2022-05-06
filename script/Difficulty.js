/**
 * @description This constructor holds the difficulty menu list, number of couples of cards array, the amount picked and the container.
 * @class
 */
export class Difficulty {
    static get difficulties() {
        return ["easy", "medium", "hard", "ninja"];
    }
    constructor() {
        this.diffCardsNum = [8, 18, 32, 50];
        this.coupleNum = 0;
        this.difficultyContainer = document.querySelector(
            ".difficulty-container"
        );
        this.chosenDifficulty = undefined;

        this.getDifficulty = () =>
            document.querySelectorAll("[data-difficulty]");
    }
}
