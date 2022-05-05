/**
 * @description The game state constructors that holds all the game elements and methods.
 * @class
 */

import { Cards } from "./Cards.js";
import { Sidebar } from "./Sidebar.js";
import { Timer } from "./Timer.js";
import { Difficulty } from "./Difficulty.js";
import { EndGame } from "./EndGame.js";

export const GameState = function () {
    this.cards = new Cards();
    this.sidebar = new Sidebar();
    this.timer = new Timer();
    this.endGame = new EndGame();
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
