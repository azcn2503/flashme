import * as actions from "../actions/tests";

const status = {
  STARTED: "STARTED",
  NOT_STARTED: "NOT_STARTED",
  COMPLETED: "COMPLETED",
  ABANDONED: "ABANDONED"
};

const defaultState = {
  byId: {},
  allIds: [],
  requesting: null,
  error: null
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.ADD_TEST_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.ADD_TEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: false,
        byId: {
          ...state.byId,
          [action.test.id]: action.test
        },
        allIds: [...state.allIds, action.test.id]
      };

    case actions.ADD_TEST_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err
      };

    case actions.START_TEST_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.START_TEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: {
          ...state.byId,
          [action.test.id]: {
            ...state.byId[action.test.id],
            status: status.STARTED
          }
        }
      };

    case actions.START_TEST_FAILURE:
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