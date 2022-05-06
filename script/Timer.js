import { Observable } from "./Observable.js";

/**
 * @description a Timer that has a value of total seconds counted, and the DOM element showing the timer
 * @type {Timer}
 * @class
 */
export const Timer = function () {
    /**
     * @description how many seconds passed since the game started
     * @type {Observable}
     */
    this.time = new Observable(0);

    this.timerView = document.querySelector(".timer .count");
};

export const observeTime = (timer) => {
    timer.time.addChangeListener((newTime) =>
        updateTime(newTime, timer.timerView)
    );
};

export const secondToTimeStr = (newTime) => {
    let minutes = (newTime / 60) | 0;
    let seconds = newTime % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
        seconds < 10 ? `0${seconds}` : seconds
    }`;
};

const updateTime = (newTime, timerView) => {
    timerView.textContent = secondToTimeStr(newTime);
};
