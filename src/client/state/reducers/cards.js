import uuidv4 from "uuid/v4";

import * as actions from "../actions/cards";

const defaultState = {
  byId: {},
  allIds: [],
  requesting: null,
  error: null
};

const newCard = (id = uuidv4(), subjectId) => ({
  id,
  selected: false,
  subjectIds: subjectId ? [subjectId] : [],
  question: "",
  answer: ""
});

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.ADD_CARD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.cardId]: {
            ...newCard(action.cardId, action.subjectId),
            ...action.card
          }
        },
        allIds: [...state.allIds, action.cardId]
      };

    default:
      return state;
  }
};

export default reducer;
