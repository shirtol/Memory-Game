import { Observable } from "./Observable.js";

/**
 * @description cards constructor holds all the cards methods and elements
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
     * @type {Node[]}
     */
    this.flippedCardsArr = new Observable([]);
    this.resetFlipedCardsArr = () => this.flippedCardsArr = new Observable([]);
    /**
     * @description Check if we have 2 cards open
     * @type {()=> boolean}
     */
    this.hasTwoFlipped = () => this.flippedCardsArr.get().length === 2;
};

/**
 *
 * @param {*} cards
 */
export const observeNumOfFlippedCards = ({ cards }) => {
    cards.flippedCardsArr.addChangeListener((_) => disableClickCards(cards));
    cards.flippedCardsArr.addChangeListener((_) =>
        stayOpenCardsIfNeeded(cards)
    );
    cards.flippedCardsArr.addChangeListener((_) => closeCardsIfNeeded(cards));
};

/**
 * @description Adding click event to all cards. When clicking on a card it will flip to the other side
 * @param {Object} Obj
 * @param {Cards} Obj.cards
 */
export const addFlipCardEvent = ({ cards }) => {
    cards.getAllCards().forEach((card) => {
        card.addEventListener("click", () => {
            cards.flippedCardsArr.set([...cards.flippedCardsArr.get(), card]);
            card.classList.add("flipCard");
        });
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
            setTimeout(() => (card.style.pointerEvents = "auto"), 2000);
        });
    }
};

/**
 * @description If the 2 cards we flipped are in the same type then keep them open.
 * @param {Cards} cards
 */
export const stayOpenCardsIfNeeded = (cards) => {
    if (isIdenticalCards(cards)) {
        cards.flippedCardsArr.get().forEach((card) => {
            card.style.pointerEvents = "none";
        });
        cards.flippedCardsArr.set([]);
    }
};

/**
 * @description If the 2 cards we flipped aren't in the same type close them
 */
//!TODO: Check which attribute we need to use in getAttribute func (this attributer holds the type of card: cat, dog etc.)
export const closeCardsIfNeeded = (cards) => {
    if (!isIdenticalCards(cards)) {
        cards.flippedCardsArr.get().forEach((card) => {
            setTimeout(() => card.classList.remove("flipCard"), 2000);
        });
        cards.flippedCardsArr.set([]);
    }
};

/**
 * @description Check if the user flipped 2 identical cards
 * @param {Object} Obj
 * @param {Cards} Obj.cards
 */

export const isIdenticalCards = (cards) =>
    cards.hasTwoFlipped() &&
    cards.flippedCardsArr.get()[0].getAttribute("data-type") ===
        cards.flippedCardsArr.get()[1].getAttribute("data-type");

// /**
//  * @description Check if the user flipped 2 different cards
//  * @param {Object} Obj
//  * @param {Cards} Obj.cards
//  */
// export const isDifferentCards = (cards) =>
//     cards.hasTwoFlipped() &&
//     cards.flippedCardsArr.get()[0].getAttribute("data-type") !==
//         cards.flippedCardsArr.get()[1].getAttribute("data-type");
