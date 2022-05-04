export const Difficulty = function () {
    this.difficulties = ["easy", "medium", "hard", "ninja"];
    this.diffCardsNum = [8, 18, 32, 50];
    this.coupleNum = 0;
    this.difficultyContainer = document.querySelector(".difficulty-container");

    this.getDifficulty = () => document.querySelectorAll("[data-difficulty]");
};
