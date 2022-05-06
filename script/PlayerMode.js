import { Sidebar } from "./Sidebar.js";

/**
 * @description This constructor holds the player mode list/picked, whos player turn it is and players ELs which are sidebars
 * @class
 */
export const PlayerMode = function () {
    this.modes = ["Solo", "One Vs One"];
    this.pickedMode = "onePlayer";
    this.turn = 0;
    this.intervalID = 0;
    this.modeContainer = document.querySelector(".player-mode-container");
    /**
     * @type {[Sidebar]}
     */
    this.players = [
        new Sidebar(".correct-count", ".incorrect-count", ".score-count", ".timer .count"),
    ];
    // this.getMode = () => document.querySelectorAll("[data-Mode]");
};


