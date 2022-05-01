import { addFlipCardEvent, observeNumOfFlippedCards } from "./Cards.js";
import { GameState } from "./GameState.js";

const gameState = new GameState();

observeNumOfFlippedCards(gameState);
addFlipCardEvent(gameState);
