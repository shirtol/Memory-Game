import { Observable } from "./Observable.js";

const FLIP_HOLD = 1000;
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
    this.resetFlipedCardsArr = () =>
        (this.flippedCardsArr = new Observable([]));
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
 *
 * @param {*} param0
 */
function addFlipCardsToClass(e) {
    console.log(e.currentTarget);
    e.currentTarget.cards.flippedCardsArr.set([
        ...e.currentTarget.cards.flippedCardsArr.get(),
        e.currentTarget,
    ]);
    e.currentTarget.classList.add("flipCard");
}

/**
 * @description Adding click event to all cards. When clicking on a card it will flip to the other side
 * @param {Object} Obj
 * @param {Cards} Obj.cards
 */
export const addFlipCardEvent = ({ cards }) => {
    cards.getAllCards().forEach((card) => {
        card.cards = cards;
        card.addEventListener("click", addFlipCardsToClass);
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
        cards.flippedCardsArr.get().forEach((card) => {
            card.style.pointerEvents = "none";
            // card.replaceWith(card.cloneNode(true));
            card.removeEventListener("click", addFlipCardsToClass);
            card.style.cursor = "auto";
        });
        cards.flippedCardsArr.set([]);
        document.querySelector(".correct-count").innerText =
            parseInt(document.querySelector(".correct-count").innerText) + 1;
    }
};

/**
 * @description If the 2 cards we flipped aren't in the same type close them
 */
//!TODO: Check which attribute we need to use in getAttribute func (this attributer holds the type of card: cat, dog etc.)
export const closeCardsIfNeeded = (cards) => {
    if (isDifferentCards(cards)) {
        setTimeout(() => {
            cards.flippedCardsArr.get().forEach((card) => {
                card.classList.remove("flipCard");
            });
            cards.flippedCardsArr.set([]);
            document.querySelector(".incorrect-count").innerText =
                parseInt(document.querySelector(".incorrect-count").innerText) +
                1;
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
    cards.flippedCardsArr.get()[0].getAttribute("data-type") ===
        cards.flippedCardsArr.get()[1].getAttribute("data-type");

/**
 * @description Check if the user flipped 2 different cards
 * @param {Object} Obj
 * @param {Cards} Obj.cards
 * ! I figured out that we must have this function because if we didn't use it and use the isIdenticalCards function with the "!" sign than we have stack overflow.
 * ! According to De Morgan law - !(a && b) === !a || !b, which in our case, "a" is cards.hasTwoFlipped() and we want to keep it as it is.
 */
export const isDifferentCards = (cards) =>
    cards.hasTwoFlipped() &&
    cards.flippedCardsArr.get()[0].getAttribute("data-type") !==
        cards.flippedCardsArr.get()[1].getAttribute("data-type");
