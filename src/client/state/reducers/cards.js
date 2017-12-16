import uuidv4 from "uuid/v4";

import * as actions from "../actions/cards";

const defaultState = {
  cards: [],
  requesting: null,
  error: null
};

const newCard = () => ({
  selected: false,
  id: uuidv4(),
  subjects: []
});

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.ADD_CARD:
      return {
        ...state,
        cards: [
          ...state.cards,
          {
            ...newCard(),
            ...action.card
          }
        ]
      };

    case actions.ADD_SUBJECT_CARD:
      return {
        ...state,
        cards: [
          ...state.cards,
          {
            ...newCard(),
            ...action.card,
            subjects: [action.subjectId]
          }
        ]
      };

    // case actions.ADD_CARD_TO_SUBJECT:
    //   return {
    //     ...state,
    //     cards: [
    //       ...state.cards.map(card => {
    //         if (card.id === action.id) {
    //           return {
    //             ...card,
    //             subjects: [...card.subjects, action.subjectId]
    //           };
    //         } else {
    //           return card;
    //         }
    //       })
    //     ]
    //   };

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
