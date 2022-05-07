import { Cards } from "./Cards.js";
import { PlayerMode } from "./PlayerMode.js";
import { Difficulty } from "./Difficulty.js";
import { ScoreboardView } from "./ScoreboardView.js";
import { Scoreboard } from "./Scoreboard.js";
import { Theme } from "./Theme.js";
import { MediaPlayer } from "./Sound.js";

/**
 * @description The game state constructors that holds all the game elements and methods.
 * @type {GameState}
 * @class
 */
export const GameState = function () {
    /**
     * @type {Cards}
     */
    this.cards = new Cards();

    /**
     * @type {Scoreboard}
     */
    this.scoreboard = new Scoreboard();

    /**
     * @type {MediaPlayer}
     */
    this.media = new MediaPlayer();

    /**
     * @type {ScoreboardView}
     */
    this.scoreboardView = new ScoreboardView(this.scoreboard);

    /**
     * @type {PlayerMode}
     */
    this.playerMode = new PlayerMode();

    /**
     * @type {Theme}
     */
    this.theme = new Theme();

    /**
     * @type {Difficulty}
     */
    this.difficult = new Difficulty();

    //TODO: Delete this 2 elements from here and move them to a better place
    /**
     * @type {HTMLElement}
     */
    this.endGameEl = document.querySelector(".end-game");

    /**
     * @type {HTMLElement}
     */
    this.endGameBtn = document.querySelector("#end-game-btn");
};
