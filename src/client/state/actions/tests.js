import * as api from "../../api/tests";
import { REMOVE_CARD_FAILURE } from "./cards";

export const ADD_TEST = "ADD_TEST";
export const START_TEST = "START_TEST";
export const ANSWER_TEST_CARD = "ANSWER_TEST_CARD";

export const ADD_TEST_REQUEST = "ADD_TEST_REQUEST";
export const ADD_TEST_SUCCESS = "ADD_TEST_SUCCESS";
export const ADD_TEST_FAILURE = "ADD_TEST_FAILURE";

export const START_TEST_REQUEST = "START_TEST_REQUEST";
export const START_TEST_SUCCESS = "START_TEST_SUCCESS";
export const START_TEST_FAILURE = "START_TEST_FAILURE";

export const GET_TEST_REQUEST = "GET_TEST_REQUEST";
export const GET_TEST_SUCCESS = "GET_TEST_SUCCESS";
export const GET_TEST_FAILURE = "GET_TEST_FAILURE";

export const GET_TESTS_FOR_SUBJECT_REQUEST = "GET_TESTS_FOR_SUBJECT_REQUEST";
export const GET_TESTS_FOR_SUBJECT_SUCCESS = "GET_TESTS_FOR_SUBJECT_SUCCESS";
export const GET_TESTS_FOR_SUBJECT_FAILURE = "GET_TESTS_FOR_SUBJECT_FAILURE";

export const RESET_TESTS = "RESET_TESTS";

export const REMOVE_TEST_REQUEST = "REMOVE_TEST_REQUEST";
export const REMOVE_TEST_SUCCESS = "REMOVE_TEST_SUCCESS";
export const REMOVE_TEST_FAILURE = "REMOVE_TEST_FAILURE";

/**
 * Get a specific test by its ID
 * @param {string} testId
 */
export const getTest = testId => dispatch => {
  dispatch({ type: GET_TEST_REQUEST });
  return api
    .getTest(testId)
    .then(test => dispatch({ type: GET_TEST_SUCCESS, testId, test }))
    .catch(err => dispatch({ type: GET_TEST_FAILURE, testId, err }));
};

/**
 * Get all tests for a subject
 * @param {string} subjectId
 */
export const getTestsForSubject = subjectId => dispatch => {
  dispatch({ type: GET_TESTS_FOR_SUBJECT_REQUEST, subjectId });
  return api
    .getTestsForSubject(subjectId)
    .then(tests =>
      dispatch({ type: GET_TESTS_FOR_SUBJECT_SUCCESS, subjectId, tests })
    )
    .catch(err =>
      dispatch({ type: GET_TESTS_FOR_SUBJECT_FAILURE, subjectId, err })
    );
};

/**
 * Add test to a subject
 * @param {string} subjectId
 */
export const addTest = subjectId => dispatch => {
  dispatch({ type: ADD_TEST_REQUEST });
  return api
    .addTest(subjectId)
    .then(test => {
      dispatch({ type: ADD_TEST_SUCCESS, test });
      return test;
    })
    .catch(err => dispatch({ type: ADD_TEST_FAILURE, err }));
};

export const removeTest = testId => dispatch => {
  dispatch({ type: REMOVE_TEST_REQUEST, testId });
  return api
    .removeTest(testId)
    .then(() => dispatch({ type: REMOVE_TEST_SUCCESS, testId }))
    .catch(err => dispatch({ type: REMOVE_TEST_FAILURE, testId, err }));
};

export const startTest = testId => dispatch => {
  dispatch({ type: START_TEST_REQUEST, testId });
  return api
    .startTest(testId)
    .then(() => dispatch({ type: START_TEST_SUCCESS, testId }))
    .catch(() => dispatch({ type: START_TEST_FAILURE, testId }));
};

export const answerTestCard = (testId, cardId, correct) => ({
  type: ANSWER_TEST_CARD,
  testId,
  cardId,
  correct
});

export const resetTests = () => ({
  type: RESET_TESTS
});
