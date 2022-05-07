import { Deck } from "./Decks.js";

/**
 * @class
 */

export class Theme {
    constructor() {
        this.themesElArr = document.querySelectorAll("[data-theme]");
        this.pickedTheme = "animals";
        this.themeStyle = document.querySelector("#selected-theme");

        this.itemsTheme = Deck.animals;
        this.addClickEventToAllThemes();
    }

    changeTheme = () => {
        this.themeStyle.setAttribute(
            "href",
            `./css/${this.pickedTheme}ThemeVars.css`
        );
        this.itemsTheme = Deck[this.pickedTheme];
    };

    toggleThemeClass = () => {
        document
            .querySelector(`[data-theme=${this.pickedTheme}]`)
            .classList.toggle("selected-theme");
    };

    addClickEventToAllThemes = () => {
        this.themesElArr.forEach((theme) => {
            theme.addEventListener("click", () => {
                this.toggleThemeClass();
                this.pickedTheme = theme.getAttribute("data-theme");
                this.toggleThemeClass();
                this.changeTheme();
                document.querySelector(".change-mode-btn").style.pointerEvents =
                    "none";
            });
        });
    };
}
