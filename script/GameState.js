/**
 * @description The game state constructors that holds all the game elements and methods.
 * @type {GameState}
 * @class
 */

import { Cards } from "./Cards.js";
import { PlayerMode } from "./PlayerMode.js";
import { Difficulty } from "./Difficulty.js";
import { ScoreboardView } from "./ScoreboardView.js";
import { Scoreboard } from "./Scoreboard.js";
import { Theme } from "./Theme.js";
import { MediaPlayer } from "./Sound.js";

export const GameState = function () {
    this.cards = new Cards();
    this.scoreboard = new Scoreboard();
    this.media = new MediaPlayer();
    this.scoreboardView = new ScoreboardView(this.scoreboard);
    this.playerMode = new PlayerMode();
    this.theme = new Theme();
    this.difficult = new Difficulty();
    this.endGameEl = document.querySelector(".end-game");
    this.endGameBtn = document.querySelector("#end-game-btn");
};
