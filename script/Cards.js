import { gameState } from "./script.js";
import { Observable } from "./Observable.js";

/**
 *  @description cards constructor holds all the cards methods and elements
 * @type {Cards}
 * @class
 */
export class Cards {
    static get FLIP_HOLD() {
        return 800;
    }

    constructor() {
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

        // /**
        //  * 
        //  * @type {Observable}
        //  */
        // this.numOfCorrect = new Observable(0);

        // /**
        //  * @type {Observable}
        //  */
        // this.scoreNum = new Observable(0);

        // /**
        //  *
        //  * @type {Observable}
        //  */
        // this.numOfFail = new Observable(0);

        this.resetFlipedCardsArr = () =>
            (this.flippedCardsArr = new Observable([]));
        /**
         * @description Check if we have 2 cards open
         * @type {()=> boolean}
         */
        this.hasTwoFlipped = () => this.flippedCardsArr.value.length === 2;
    }
}

/**
 * @description adds changeListeners to handle all states while flipping cards
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
 * @description adds fliped card to array to check when we have 2 also adds class to it for the changes,
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
        card.style.cursor = "pointer";
        card.addEventListener("click", addFlipCardsToClass);
    });
};

/**
 * @description when a card is paired to its matching
 * @param {HTMLElement} card
 */
const removeEventListenerFromCard = (card) => {
    card.style.cursor = "auto";
    card.removeEventListener("click", addFlipCardsToClass);
};

/**
 * @description when clicking newgame menu to disable clicking on cards in the background
 * @param {cards: Cards} cards
 */
export const removeFlipCardEvent = ({ cards }) =>
    cards.getAllCards().forEach(removeEventListenerFromCard);

/**
 * @description disabling clicking other cards after flipping two, while they flip back
 * @param {HTMLElement} card
 */
const disableClickOnCardWithTimeout = (card) => {
    card.style.pointerEvents = "none";
    setTimeout(() => (card.style.pointerEvents = "auto"), Cards.FLIP_HOLD);
};

/**
 * @description After flipping 2 cards hold the game and don't let the user flip more cards.
 * @param {Cards} cards
 */
export const disableClickCards = (cards) => {
    if (cards.hasTwoFlipped()) {
        cards.getAllCards().forEach(disableClickOnCardWithTimeout);
    }
};

/**
 * @description when a card is matched dont need to click it anymore
 * @param {*} cards
 */
const removeClickOnCard = (card) => {
    card.style.pointerEvents = "none";
    card.removeEventListener("click", addFlipCardsToClass);
    card.style.cursor = "auto";
};

/**
 * @description If the 2 cards we flipped are in the same type then keep them open.
 * @param {Cards} cards
 */
export const stayOpenCardsIfNeeded = (cards) => {
    if (isIdenticalCards(cards)) {
        updateCounters(cards, gameState);
        cards.flippedCardsArr.value.forEach(removeClickOnCard);
        cards.flippedCardsArr.value = [];
    }
};

/**
 * @description unflip a card
 * @param {HTMLElement} card
 */
const removeFlipCardClass = (card) => card.classList.remove("flipCard");

/**
 * @description If the 2 cards we flipped aren't in the same type close them
 * @param {Cards} cards
 */
export const closeCardsIfNeeded = (cards) => {
    if (isDifferentCards(cards)) {
        updateCounters(cards, gameState);
        setTimeout(() => {
            cards.flippedCardsArr.value.forEach(removeFlipCardClass);
            cards.flippedCardsArr.value = [];
        }, 1000);
    }
};

/**
 * @description Check if the user flipped 2 identical cards
 * @param {Cards} cards
 */

export const isIdenticalCards = (cards) =>
    cards.hasTwoFlipped() &&
    cards.flippedCardsArr.value[0].getAttribute("data-type") ===
        cards.flippedCardsArr.value[1].getAttribute("data-type");

/**
 * @description Check if the user flipped 2 different cards
 * @param {Cards} cards
 */
export const isDifferentCards = (cards) => {
    return (
        cards.hasTwoFlipped() &&
        cards.flippedCardsArr.value[0].getAttribute("data-type") !==
            cards.flippedCardsArr.value[1].getAttribute("data-type")
    );
};

/**
 * @description update correct and incorrect counters
 * @param {Cards} cards 
 * @param {{playerMode: PlayerMode}} Obj 
 */
export const updateCounters = (cards, {playerMode}) => {
    if (isIdenticalCards(cards)) playerMode.players[0].numOfCorrect.value += 1;
    else if (isDifferentCards(cards)) playerMode.players[0].numOfFail.value += 1;
};
