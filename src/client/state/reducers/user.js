import * as actions from "client/state/actions/user";

const defaultState = {
  loggedIn: false,
  currentUser: {},
  requesting: false,
  error: null
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;

    case actions.LOGIN_REQUEST:
    case actions.LOGOUT_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        loggedIn: true,
        currentUser: action.user
      };

    case actions.LOGIN_FAILURE:
    case actions.LOGOUT_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err
      };

    case actions.LOGOUT_SUCCESS:
      return {
        ...state,
        loggedIn: false,
        requesting: false,
        error: null,
        currentUser: {}
      };

    case actions.GET_CURRENT_USER_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.GET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        loggedIn: true,
        currentUser: action.user
      };

    case actions.GET_CURRENT_USER_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err
      };
  }
};

export default reducer;
