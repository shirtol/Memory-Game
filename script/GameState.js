/**
 * @description The game state constructors that holds all the game elements and methods.
 * @class
 */

import { Cards } from "./Cards.js";

export const GameState = function () {
    this.cards = new Cards();
};
