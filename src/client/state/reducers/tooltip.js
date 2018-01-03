import * as actions from "client/state/actions/tooltip";

const defaultState = {
  open: false,
  message: null,
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.SHOW_TOOLTIP:
      return {
        open: true,
        message: action.message,
        x: action.x,
        y: action.y,
        width: action.width,
        height: action.height
      };

    case actions.HIDE_TOOLTIP:
      return {
        ...state,
        open: false
      };

    default:
      return state;
  }
};

export default reducer;
