import * as api from "../../api/cards";

export const REMOVE_CARD = "REMOVE_CARD";
export const UPDATE_CARD = "UPDATE_CARD";

export const GET_CARDS_REQUEST = "GET_CARDS_REQUEST";
export const GET_CARDS_SUCCESS = "GET_CARDS_SUCCESS";
export const GET_CARDS_FAILURE = "GET_CARDS_FAILURE";

export const ADD_CARD_REQUEST = "ADD_CARD_REQUEST";
export const ADD_CARD_SUCCESS = "ADD_CARD_SUCCESS";
export const ADD_CARD_FAILURE = "ADD_CARD_FAILURE";

export const getCards = subjectId => dispatch => {
  dispatch({ type: GET_CARDS_REQUEST });
  return api
    .getCards(subjectId)
    .then(cards => dispatch({ type: GET_CARDS_SUCCESS, cards }))
    .catch(err => dispatch({ type: GET_CARDS_FAILURE, err }));
};

export const addCard = (card, subjectId) => dispatch => {
  dispatch({ type: ADD_CARD_REQUEST });
  return api
    .addCard(card, subjectId)
    .then(res => dispatch({ type: ADD_CARD_SUCCESS, card: res }))
    .catch(err => dispatch({ type: ADD_CARD_FAILURE, err }));
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
