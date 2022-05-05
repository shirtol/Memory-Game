/**
 * @description The game state constructors that holds all the game elements and methods.
 * @type {GameState}
 * @class
 */

import { Cards } from "./Cards.js";
import { PlayerMode } from "./PlayerMode.js";
import { Difficulty } from "./Difficulty.js";

export const GameState = function () {
    this.cards = new Cards();
    this.playerMode = new PlayerMode();
    this.animals = [
        "dog",
        "cat",
        "duck",
        "horse",
        "eagle",
        "rabbit",
        "mouse",
        "donkey",
        "zebra",
        "wolf",
        "lion",
        "turtle",
        "elephant",
        "giraffe",
        "bear",
        "tiger",
        "monkey",
        "ostrich",
        "kangaroo",
        "hippo",
        "rhino",
        "deer",
        "cow",
        "sheep",
        "shark",
        "fox",
        "camel",
        "goat",
        "penguin",
        "frog",
        "hamster",
        "pig",
        "squirrel",
        "chicken",
        "cheetah",
        "panda",
        "hyena",
        "alligator",
        "ant",
        "crab",
        "rat",
        "buffalo",
        "leopard",
        "bee",
        "flamingo",
        "turkey",
        "iguana",
        "sloth",
        "hedgehog",
        "whale",
    ];
    
    this.difficult = new Difficulty();
    this.endGameEl = document.querySelector(".end-game");
    this.endGameBtn = document.querySelector("#end-game-btn");
};
