import * as api from "../../api/cards";

export const GET_CARDS_REQUEST = "GET_CARDS_REQUEST";
export const GET_CARDS_SUCCESS = "GET_CARDS_SUCCESS";
export const GET_CARDS_FAILURE = "GET_CARDS_FAILURE";

export const ADD_CARD_REQUEST = "ADD_CARD_REQUEST";
export const ADD_CARD_SUCCESS = "ADD_CARD_SUCCESS";
export const ADD_CARD_FAILURE = "ADD_CARD_FAILURE";

export const UPDATE_CARD_REQUEST = "UPDATE_CARD_REQUEST";
export const UPDATE_CARD_SUCCESS = "UPDATE_CARD_SUCCESS";
export const UPDATE_CARD_FAILURE = "UPDATE_CARD_FAILURE";

export const REMOVE_CARD_REQUEST = "REMOVE_CARD_REQUEST";
export const REMOVE_CARD_SUCCESS = "REMOVE_CARD_SUCCESS";
export const REMOVE_CARD_FAILURE = "REMOVE_CARD_FAILURE";

export const RESET_CARDS = "RESET_CARDS";

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

export const updateCard = (cardId, card) => dispatch => {
  dispatch({ type: UPDATE_CARD_REQUEST, cardId });
  return api
    .updateCard(cardId, card)
    .then(res => dispatch({ type: UPDATE_CARD_SUCCESS, cardId, card: res }))
    .catch(err => dispatch({ type: ADD_CARD_FAILURE, cardId, err }));
};

export const removeCard = cardId => dispatch => {
  dispatch({ type: REMOVE_CARD_REQUEST, cardId });
  return api
    .removeCard(cardId)
    .then(res => dispatch({ type: REMOVE_CARD_SUCCESS, cardId }))
    .catch(err => dispatch({ type: REMOVE_CARD_FAILURE, cardId, err }));
};

export const resetCards = () => ({
  type: RESET_CARDS
});
