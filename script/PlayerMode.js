import { Sidebar } from "./Sidebar.js";

/**
 * @description This constructor holds the player mode list/picked, whos player turn it is and players ELs which are sidebars
 * @class
 */
export const PlayerMode = function () {
    /**
     * @type {string[]}
     */
    this.modes = ["Solo", "One Vs One"];
    /**
     * @type {string}
     */
    this.pickedMode = "onePlayer";
    /**
     * @type {number}
     */
    this.turn = 0;
    /**
     * @type {number}
     */
    this.intervalID = 0;
    /**
     * @type {HTMLElement}
     */
    this.modeContainer = document.querySelector(".player-mode-container");
    /**
     * @type {() => NodeList}
     */
    this.getModesEl = () => document.querySelectorAll("[data-mode]");

    /**
     * @type {[Sidebar]}
     */
    this.players = [
        new Sidebar(
            ".correct-count",
            ".incorrect-count",
            ".score-count",
            ".timer .count"
        ),
    ];
};
