import uuidv4 from "uuid/v4";

import * as actions from "../actions/cards";

const defaultState = {
  cards: [],
  requesting: null,
  error: null
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.ADD_CARD:
      return {
        ...state,
        cards: [
          ...state.cards,
          {
            ...action.card,
            selected: false,
            id: uuidv4()
          }
        ]
      };

    case actions.REMOVE_CARD:
      return {
        ...state,
        cards: [
          ...state.cards.slice(0, action.index),
          ...state.cards.slice(action.index + 1)
        ]
      };

    default:
      return state;
  }
};

export default reducer;
