/**
 * @description Adding click event to all cards. When clicking on a card it will flip to the other side
 * //using toggle class.
 *
 */
export const addFlipCardEvent = () => {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            card.classList.add("flipCard");
        });
    });
};

/**
 * @description Check if we have 2 cards open: This function counts the number of clicks
 */

/**
 * @description After flipping 2 cards hold the game and don't let the user flip more cards.
 */

/**
 * @description If the 2 cards we flipped are in the same type then keep them open.
 */

/**
 * @description If the 2 cards we flipped aren't in the same type close them
 */
