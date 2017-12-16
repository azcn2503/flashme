import * as actions from "../actions/cards";

const defaultState = [];

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.ADD_CARD:
      console.log(action);
      return [
        ...state,
        {
          ...action.card,
          selected: false
        }
      ];
    default:
      return state;
  }
};

export default reducer;
