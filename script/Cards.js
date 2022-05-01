import { Observable } from "./Observable.js";

/**
 * @description cards constructor holds all the cards methods and elements
 * @class
 */
export const Cards = function () {
    /**
     * @type {Observable}
     */
    this.numOfCardsFlipped = new Observable(0);

    /**
     *
     * @type {NodeList}
     */
    this.allCards = document.querySelectorAll(".card");

    /**
     * @description Check if we have 2 cards open
     * @type {()=> boolean}
     */
    this.hasTwoFlipped = () => this.numOfCardsFlipped.get() === 2;
};

/**
 *
 * @param {*} cards
 */
export const observeNumOfFlippedCards = ({ cards }) =>
    cards.numOfCardsFlipped.addChangeListener((_) => disableClickCards(cards));

/**
 * @description Adding click event to all cards. When clicking on a card it will flip to the other side
 * @param {*} cards
 */
export const addFlipCardEvent = ({ cards }) => {
    cards.allCards.forEach((card) => {
        card.addEventListener("click", () => {
            cards.numOfCardsFlipped.set(cards.numOfCardsFlipped.get() + 1);
            card.classList.add("flipCard");
        });
    });
};

/**
 * @description After flipping 2 cards hold the game and don't let the user flip more cards.
 * @param {*} cards
 */
export const disableClickCards = (cards) => {
    if (cards.hasTwoFlipped()) {
        cards.allCards.forEach((card) => {
            card.style.pointerEvents = "none";
            setTimeout(() => (card.style.pointerEvents = "auto"), 2000);
        });
    }
};

/**
 * @description If the 2 cards we flipped are in the same type then keep them open.
 */

/**
 * @description If the 2 cards we flipped aren't in the same type close them
 */
