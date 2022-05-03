/**
 * @description The game state constructors that holds all the game elements and methods.
 * @class
 */

import { Cards } from "./Cards.js";
import { Sidebar } from "./Sidebar.js";

export const GameState = function () {
    this.cards = new Cards();
    this.sidebar = new Sidebar();
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
};

const Difficulty = function () {
    this.difficulties = ["easy", "medium", "hard", "ninja"];
    this.diffCardsNum = [8, 18, 32, 50];
    this.coupleNum = 0;
    this.difficultyContainer = document.querySelector(".difficulty-container");

    this.getDifficulty = () => document.querySelectorAll("[data-difficulty]");
};
