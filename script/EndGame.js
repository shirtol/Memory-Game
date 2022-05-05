/**
 * @class
 */

export class EndGame {
    constructor() {
        this.scoreboardBtn = document.querySelector(".score-board-btn");
        this.scoreboardContainer = document.querySelector(
            ".scoreboard-container"
        );
        this.closeScoreboard = document.querySelector(".fa-xmark");
        this.difficultyScores = document.querySelector(".difficulty-score");
    }
}

/**
 *
 * @param {string} firstPlace the time the first place finished the game
 * @param {string} secondPlace the time the second place finished the game
 * @param {string} thirdPlace the time the third place finished the game
 */
export const displayTime = (firstPlace, secondPlace, thirdPlace) => {
    const firstPlaceTime = document.querySelector(".first-place");
    const secondPlaceTime = document.querySelector(".second-place");
    const thirdPlaceTime = document.querySelector(".third-place");
    firstPlaceTime.setAttribute("data-timeScore", firstPlace);
    secondPlaceTime.setAttribute("data-timeScore", secondPlace);
    thirdPlaceTime.setAttribute("data-timeScore", thirdPlace);
};
