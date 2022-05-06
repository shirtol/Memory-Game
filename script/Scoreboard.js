//TODO: Use the bestTimeScore object to hold the best time score and display them in the DOM, by using the function secondToTimeStr in the timer file.

import { Observable } from "./Observable.js";

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
