export const ADD_CARD = "ADD_CARD";
export const REMOVE_CARD = "REMOVE_CARD";
export const UPDATE_CARD = "UPDATE_CARD";

export const addCard = card => ({
  type: ADD_CARD,
  card
});

export const removeCard = index => ({
  type: REMOVE_CARD,
  index
});

export const updateCard = (index, card) => ({
  type: UPDATE_CARD,
  index,
  card
});
