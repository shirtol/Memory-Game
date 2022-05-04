import { Observable } from "./Observable.js";
import { checkGameOver } from "./script.js";

const FLIP_HOLD = 1000;

/**
 *  @description cards constructor holds all the cards methods and elements
 * @type {Cards}
 * @class
 */
export const Cards = function () {
    /**
     *
     * @type {() => NodeList}
     */
    this.getAllCards = () => document.querySelectorAll(".card");

    /**
     *
     * @type {Observable}
     */
    this.flippedCardsArr = new Observable([]);

    this.numOfCorrect = new Observable(0);
    this.numOfFail = new Observable(0);

    this.resetFlipedCardsArr = () =>
        (this.flippedCardsArr = new Observable([]));
    /**
     * @description Check if we have 2 cards open
     * @type {()=> boolean}
     */
    this.hasTwoFlipped = () => this.flippedCardsArr.value.length === 2;
};

/**
 *
 * @param {{cards: Cards}} cards
 */
export const observeNumOfFlippedCards = ({ cards }) => {
    cards.flippedCardsArr.addChangeListener((_) => disableClickCards(cards));
    cards.flippedCardsArr.addChangeListener((_) =>
        stayOpenCardsIfNeeded(cards)
    );
    cards.flippedCardsArr.addChangeListener((_) => closeCardsIfNeeded(cards));
};

/**
 *
 * @param {Event} e
 */
function addFlipCardsToClass(e) {
    if (e.currentTarget.classList.contains("flipCard")) {
        return;
    }
    e.currentTarget.deck.flippedCardsArr.value = [
        //currentTarget is the actual element in HTML that was clicked.
        ...e.currentTarget.deck.flippedCardsArr.value,
        e.currentTarget,
    ];
    e.currentTarget.classList.add("flipCard");
}

/**
 * @description Adding click event to all cards. When clicking on a card it will flip to the other side
 * @param {Object} Obj
 * @param {Cards} Obj.cards
 */
export const addFlipCardEvent = ({ cards }) => {
    cards.getAllCards().forEach((card) => {
        card.deck = cards; //!card is an HTML element and deck is a property of card that we made up, and inside it we save cards. (I made it because I wanted to remove the callback afterwards)
        card.addEventListener("click", addFlipCardsToClass);
    });
};

/**
 *
 * @param {cards: Cards} cards
 */
export const removeFlipCardEvent = ({ cards }) => {
    cards.getAllCards().forEach((card) => {
        card.style.cursor = "auto";
        card.removeEventListener("click", addFlipCardsToClass);
    });
};

/**
 * @description After flipping 2 cards hold the game and don't let the user flip more cards.
 * @param {Cards} cards
 */
export const disableClickCards = (cards) => {
    if (cards.hasTwoFlipped()) {
        cards.getAllCards().forEach((card) => {
            card.style.pointerEvents = "none";
            setTimeout(() => (card.style.pointerEvents = "auto"), FLIP_HOLD);
        });
    }
};

/**
 * @description If the 2 cards we flipped are in the same type then keep them open.
 * @param {Cards} cards
 */
export const stayOpenCardsIfNeeded = (cards) => {
    if (isIdenticalCards(cards)) {
        updateCounters(cards);
        cards.flippedCardsArr.value.forEach((card) => {
            card.style.pointerEvents = "none";
            card.removeEventListener("click", addFlipCardsToClass);
            card.style.cursor = "auto";
        });
        cards.flippedCardsArr.value = [];
        checkGameOver();
    }
};

/**
 * @description If the 2 cards we flipped aren't in the same type close them
 */
//!TODO: Check which attribute we need to use in getAttribute func (this attributer holds the type of card: cat, dog etc.)
export const closeCardsIfNeeded = (cards) => {
    if (isDifferentCards(cards)) {
        updateCounters(cards);
        setTimeout(() => {
            cards.flippedCardsArr.value.forEach((card) => {
                card.classList.remove("flipCard");
            });
            cards.flippedCardsArr.value = [];
        }, 1300);
    }
};

/**
 * @description Check if the user flipped 2 identical cards
 * @param {Object} Obj
 * @param {Cards} Obj.cards
 */

export const isIdenticalCards = (cards) =>
    cards.hasTwoFlipped() &&
    cards.flippedCardsArr.value[0].getAttribute("data-type") ===
        cards.flippedCardsArr.value[1].getAttribute("data-type");

/**
 * @description Check if the user flipped 2 different cards
 * @param {Object} Obj
 * @param {Cards} Obj.cards
 * ! I figured out that we must have this function because if we didn't use it and use the isIdenticalCards function with the "!" sign than we have stack overflow.
 * ! According to De Morgan law - !(a && b) === !a || !b, which in our case, "a" is cards.hasTwoFlipped() and we want to keep it as it is.
 */
export const isDifferentCards = (cards) => {
    return (
        cards.hasTwoFlipped() &&
        cards.flippedCardsArr.value[0].getAttribute("data-type") !==
            cards.flippedCardsArr.value[1].getAttribute("data-type")
    );
};

export const updateCounters = (cards) => {
    if (isIdenticalCards(cards)) cards.numOfCorrect.value += 1;
    else if (isDifferentCards(cards)) cards.numOfFail.value += 1;
};
