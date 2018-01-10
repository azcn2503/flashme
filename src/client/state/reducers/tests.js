import { keyBy, uniq, omitBy } from "lodash";

import { testStatusEnum } from "shared/tests";
import { requestTypeEnum } from "shared/requests";
import * as actions from "client/state/actions/tests";

const defaultState = {
  byId: {},
  allIds: [],
  requesting: null,
  error: null
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.ADD_TEST_REQUEST:
    case actions.ADD_RETEST_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.ADD_TEST_SUCCESS:
    case actions.ADD_RETEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: false,
        byId: {
          [action.test.id]: action.test,
          ...state.byId
        },
        allIds: [...state.allIds, action.test.id]
      };

    case actions.ADD_TEST_FAILURE:
    case actions.ADD_RETEST_FAILURE:
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
          [action.testId]: {
            ...state.byId[action.testId],
            status: testStatusEnum.STARTED
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

    case actions.REMOVE_TEST_REQUEST:
      return {
        ...state,
        requesting: true,
        byId: {
          ...state.byId,
          [action.testId]: {
            ...state.byId[action.testId],
            requesting: requestTypeEnum.DELETE
          }
        }
      };

    case actions.REMOVE_TEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: omitBy(state.byId, test => test.id === action.testId),
        allIds: [...state.allIds].filter(id => id !== action.testId)
      };

    case actions.REMOVE_TEST_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err,
        byId: {
          ...state.byId,
          [action.testId]: {
            ...state.byId[action.testId],
            requesting: false
          }
        }
      };

    case actions.START_TEST_REQUEST:
    case actions.COMPLETE_TEST_REQUEST:
    case actions.ABANDON_TEST_REQUEST:
      return {
        ...state,
        requesting: true,
        byId: {
          ...state.byId,
          [action.testId]: {
            ...state.byId[action.testId],
            requesting: requestTypeEnum.UPDATE
          }
        }
      };

    case actions.START_TEST_FAILURE:
    case actions.COMPLETE_TEST_FAILURE:
    case actions.ABANDON_TEST_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err,
        byId: {
          ...state.byId,
          [action.testId]: {
            ...state.byId[action.testId],
            requesting: false
          }
        }
      };

    case actions.START_TEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: {
          ...state.byId,
          [action.testId]: {
            ...state.byId[action.testId],
            status: testStatusEnum.STARTED
          }
        }
      };

    case actions.COMPLETE_TEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: {
          ...state.byId,
          [action.testId]: {
            ...state.byId[action.testId],
            status: testStatusEnum.COMPLETED
          }
        }
      };

    case actions.ABANDON_TEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: {
          ...state.byId,
          [action.testId]: {
            ...state.byId[action.testId],
            status: testStatusEnum.ABANDONED
          }
        }
      };

    case actions.ANSWER_TEST_CARD_REQUEST:
      return {
        ...state,
        requesting: requestTypeEnum.UPDATE,
        byId: {
          ...state.byId,
          [action.testId]: {
            ...state.byId[action.testId],
            requesting: requestTypeEnum.UPDATE
          }
        }
      };

    case actions.ANSWER_TEST_CARD_SUCCESS:
      return {
        ...state,
        requesting: false,
        byId: {
          ...state.byId,
          [action.testId]: {
            ...state.byId[action.testId],
            activeCard: action.activeCard,
            cards: [
              ...state.byId[action.testId].cards.slice(0, action.cardIndex),
              {
                ...state.byId[action.testId].cards[action.cardIndex],
                correct: action.correct,
                answered: true
              },
              ...state.byId[action.testId].cards.slice(action.cardIndex + 1)
            ]
          }
        }
      };

    case actions.ANSWER_TEST_CARD_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err,
        byId: {
          ...state.byId,
          [action.testId]: {
            ...state.byId[action.testId],
            requesting: false
          }
        }
      };

    default:
      return state;
  }
};

export const getSubjectFilteredTests = (state, subjectId) => {
  return Object.values(state.byId).filter(test => test.subjectId === subjectId);
};

export default reducer;
