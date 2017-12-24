import { dropWhile, keyBy, omitBy, uniq } from "lodash";

import * as actions from "../actions/cards";

const defaultState = {
  byId: {},
  allIds: [],
  requesting: null,
  error: null
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.ADD_CARD_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.ADD_CARD_SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.card.id]: action.card
        },
        allIds: [...state.allIds, action.card.id],
        requesting: false,
        error: null
      };

    case actions.ADD_CARD_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err
      };

    case actions.GET_CARDS_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.GET_CARDS_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: {
          ...state.byId,
          ...keyBy(action.cards, "id")
        },
        allIds: uniq(...state.allIds, action.cards.map(card => card.id))
      };

    case actions.REMOVE_CARD_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.REMOVE_CARD_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: omitBy(state.byId, card => card.id === action.cardId),
        allIds: [...dropWhile(state.allIds, id => id === action.cardId)]
      };

    case actions.REMOVE_CARD_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err
      };

    default:
      return state;
  }
};

export default reducer;
