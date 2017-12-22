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

    default:
      return state;
  }
};

export default reducer;
