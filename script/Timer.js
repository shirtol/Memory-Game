import { Observable } from "./Observable.js";

/**
 * @class
 */
export const Timer = function () {
    /**
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

const updateTime = (newTime, timerView) => {
    let minutes = (newTime / 60) | 0;
    let seconds = newTime % 60;
    timerView.textContent = `${minutes < 10 ? `0${minutes}` : minutes}:${
        seconds < 10 ? `0${seconds}` : seconds
    }`;
};