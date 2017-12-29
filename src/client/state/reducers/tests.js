import { keyBy, uniq } from "lodash";

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

    case actions.GET_TEST_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.GET_TEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: {
          ...state.byId,
          [action.testId]: action.test
        },
        allIds: uniq([...state.allIds, action.testId])
      };

    case actions.GET_TEST_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err
      };

    case actions.GET_TESTS_FOR_SUBJECT_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.GET_TESTS_FOR_SUBJECT_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: {
          ...state.byId,
          ...keyBy(action.tests, "id")
        },
        allIds: uniq(...state.allIds, action.tests.map(test => test.id))
      };

    case actions.GET_TESTS_FOR_SUBJECT_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err
      };

    case actions.RESET_TESTS:
      return defaultState;

    default:
      return state;
  }
};

export default reducer;
