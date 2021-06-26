import shuffle from 'just-shuffle';
import { cardTypes, cardColors, cardNumbers } from '@/constants/uno';
import {
  Card, CardColor, CardNumber, CardType,
} from '@/types/uno';

const createNumberCards = (): Card[] => {
  const numberCards = Object.values(cardColors).map((color: CardColor) => {
    const cards: Card[][] = cardNumbers.map((number: CardNumber) => {
      const quantity = number > 0 ? 2 : 1;
      const cardsWithQuantity = [...Array(quantity)].map(() => ({
        type: cardTypes.NUMBER,
        color,
        number,
      }));
      return cardsWithQuantity;
    });
    return cards;
  }).flat(2);
  return numberCards;
};

const createSpecialCards = (quantity: number, type: CardType, needColor?: boolean): Card[] => {
  const specialCards = [...Array(quantity)].map(() => {
    const cards: Card[] = needColor ? Object.values(cardColors).map((color: CardColor) => ({
      type,
      color,
    })) : [{
      type,
    }];
    return cards;
  }).flat().sort((a, b) => {
    if (!a.color || !b.color) return 0;
    if (a?.color < b?.color) return -1;
    if (a?.color > b?.color) return 1;
    return 0;
  });
  return specialCards;
};

export const createAllCards = (): Card[] => {
  const numberCards = createNumberCards();
  const skipCards = createSpecialCards(2, cardTypes.SKIP, true);
  const drawTowCards = createSpecialCards(2, cardTypes.DRAW_TWO, true);
  const reverseCards = createSpecialCards(2, cardTypes.REVERSE, true);
  const wildCards = createSpecialCards(4, cardTypes.WILD, false);
  const wildDrawFourCards = createSpecialCards(4, cardTypes.WILD_DRAW_FOUR, false);

  return [
    numberCards,
    skipCards,
    drawTowCards,
    reverseCards,
    wildCards,
    wildDrawFourCards,
  ].flat();
};

export const pick = (cards: Card[], quantity = 1): [Card[], Card[]] => {
  const shuffleCards = shuffle(cards);
  const pickedCards = shuffleCards.slice(0, quantity);
  const remainingCards = shuffleCards.slice(quantity, shuffleCards.length);
  return [pickedCards, remainingCards];
};

export const detectMyTurn = (
  players: string[], turn: number, id: string,
): boolean => players[turn] === id;
