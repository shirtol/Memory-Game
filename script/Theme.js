import { Deck } from "./Decks.js";

/**
 * @class
 */

export class Theme {
    constructor() {
        this.themesElArr = document.querySelectorAll("[data-theme]");
        this.pickedTheme = "animals";
        this.themeStyle = document.querySelector("#selected-theme");

        this.itemsTheme = this.pokemon;
        this.addClickEventToAllThemes();
    }

    changeTheme = () => {
        this.themeStyle.setAttribute(
            "href",
            `./css/${this.pickedTheme}ThemeVars.css`
        );
        this.itemsTheme = Deck[this.pickedTheme];
    };

    addClickEventToAllThemes = () => {
        console.log(this.pickedTheme);
        this.themesElArr.forEach((theme) => {
            theme.addEventListener("click", () => {
                this.pickedTheme = theme.getAttribute("data-theme");
                this.changeTheme();
            });
        });
    };
}
