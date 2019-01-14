import uuidv4 from "uuid/v4";

import * as actions from "../actions/toasts";

const TOAST_STATES = {
  open: "open",
  closing: "closing",
  closed: "closed"
};

const defaultState = {
  toasts: [
    {
      id: "test",
      state: TOAST_STATES.open,
      message: "You can do it!"
    }
  ]
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.ADD_TOAST:
      return {
        toasts: [
          ...state.toasts,
          {
            id: uuidv4(),
            message: action.message,
            state: TOAST_STATES.open
          }
        ]
      };

    case actions.CLOSE_TOAST:
      return {
        toasts: state.toasts.map(toast => {
          if (toast.id !== action.id) return toast;
          return {
            ...toast,
            state: TOAST_STATES.closed
          };
        })
      };

    default:
      return state;
  }
};

export const getToasts = state => state.toasts;

export const getVisibleToasts = state =>
  state.toasts.filter(toast => toast.state !== TOAST_STATES.closed);

export default reducer;
