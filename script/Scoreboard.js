/**
 * @class
 */
export class Scoreboard {
    constructor() {
        /**
         * @description bestTimeScore is an object that holds the seconds for each game difficulty.
         * @type {{easy: number[], medium: number[], hard: number[], ninja: number[]}}
         */
        this.bestTimeScore = {
            easy: [],
            medium: [],
            hard: [],
            ninja: [],
        };
    }
}
