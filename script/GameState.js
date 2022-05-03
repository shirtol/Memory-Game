/**
 * @description The game state constructors that holds all the game elements and methods.
 * @class
 */

import { Cards } from "./Cards.js";
import { Sidebar } from "./Sidebar.js";

export const GameState = function () {
    this.cards = new Cards();
    this.sidebar = new Sidebar();

    this.difficult = new Difficulty();
};

const Difficulty = function () {
    this.difficulties = ["easy", "medium", "hard", "ninja"];

    this.difficultyContainer = document.querySelector(".difficulty-container");

    this.getDifficulty = () => document.querySelectorAll("[data-difficulty]");
};
