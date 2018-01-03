import * as actions from "client/state/actions/tooltip";

const defaultState = {
  open: false,
  message: null,
  left: 0,
  top: 0,
  width: 0,
  height: 0
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.SHOW_TOOLTIP:
      return {
        open: true,
        message: action.message,
        left: action.left,
        top: action.top,
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
