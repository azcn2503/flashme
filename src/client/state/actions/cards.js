import uuidv4 from "uuid/v4";

export const ADD_CARD = "ADD_CARD";
export const ADD_SUBJECT_CARD = "ADD_SUBJECT_CARD";
export const REMOVE_CARD = "REMOVE_CARD";
export const UPDATE_CARD = "UPDATE_CARD";

export const addCard = (card, subjectId) => {
  const cardId = uuidv4();
  return {
    type: ADD_CARD,
    cardId,
    card,
    subjectId
  };
};

export const removeCard = cardId => ({
  type: REMOVE_CARD,
  cardId
});

export const updateCard = (cardId, card) => ({
  type: UPDATE_CARD,
  cardId,
  card
});
