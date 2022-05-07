import { Observable } from "./Observable.js";

/**
 * @class
 */

export class Theme {
    constructor() {
        this.themesElArr = document.querySelectorAll("[data-theme]");
        this.pickedTheme = new Observable("animals");
        this.themeStyle = document.querySelector("#selected-theme");

        this.addClickEventToAllThemes();
    }

    changeTheme = () => {
        this.themeStyle.setAttribute(
            "href",
            `./css/${this.pickedTheme.value}ThemeVars.css`
        );
    };

    toggleThemeClass = () => {
        document
            .querySelector(`[data-theme=${this.pickedTheme.value}]`)
            .classList.toggle("selected-theme");
    };

    addClickEventToAllThemes = () => {
        this.themesElArr.forEach((theme) => {
            theme.addEventListener("click", () => {
                this.toggleThemeClass();
                this.pickedTheme.value = theme.getAttribute("data-theme");
                this.toggleThemeClass();
                this.changeTheme();
            });
        });
    };
}
