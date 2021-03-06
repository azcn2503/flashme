import * as api from "../../api/tests";

export const ADD_TEST_REQUEST = "ADD_TEST_REQUEST";
export const ADD_TEST_SUCCESS = "ADD_TEST_SUCCESS";
export const ADD_TEST_FAILURE = "ADD_TEST_FAILURE";

export const ADD_RETEST_REQUEST = "ADD_RETEST_REQUEST";
export const ADD_RETEST_SUCCESS = "ADD_RETEST_SUCCESS";
export const ADD_RETEST_FAILURE = "ADD_RETEST_FAILURE";

export const START_TEST_REQUEST = "START_TEST_REQUEST";
export const START_TEST_SUCCESS = "START_TEST_SUCCESS";
export const START_TEST_FAILURE = "START_TEST_FAILURE";

export const COMPLETE_TEST_REQUEST = "COMPLETE_TEST_REQUEST";
export const COMPLETE_TEST_SUCCESS = "COMPLETE_TEST_SUCCESS";
export const COMPLETE_TEST_FAILURE = "COMPLETE_TEST_FAILURE";

export const ABANDON_TEST_REQUEST = "ABANDON_TEST_REQUEST";
export const ABANDON_TEST_SUCCESS = "ABANDON_TEST_SUCCESS";
export const ABANDON_TEST_FAILURE = "ABANDON_TEST_FAILURE";

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

export const ANSWER_TEST_CARD_REQUEST = "ANSWER_TEST_CARD_REQUEST";
export const ANSWER_TEST_CARD_SUCCESS = "ANSWER_TEST_CARD_SUCCESS";
export const ANSWER_TEST_CARD_FAILURE = "ANSWER_TEST_CARD_FAILURE";

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
    .catch(err => dispatch({ type: START_TEST_FAILURE, testId, err }));
};

export const completeTest = testId => dispatch => {
  dispatch({ type: COMPLETE_TEST_REQUEST, testId });
  return api
    .completeTest(testId)
    .then(() => dispatch({ type: COMPLETE_TEST_SUCCESS, testId }))
    .catch(err => dispatch({ type: COMPLETE_TEST_FAILURE, testId, err }));
};

export const abandonTest = testId => dispatch => {
  dispatch({ type: ABANDON_TEST_REQUEST, testId });
  return api
    .abandonTest(testId)
    .then(() => dispatch({ type: ABANDON_TEST_SUCCESS, testId }))
    .catch(err => dispatch({ type: ABANDON_TEST_FAILURE, testId, err }));
};

/**
 * Answer a test card
 * @param {string} testId
 * @param {number} cardIndex
 * @param {boolean} correct
 */
export const answerTestCard = (testId, cardIndex, correct) => dispatch => {
  dispatch({ type: ANSWER_TEST_CARD_REQUEST, testId, cardIndex, correct });
  return api
    .answerTestCard(testId, cardIndex, correct)
    .then(({ activeCard }) =>
      dispatch({
        type: ANSWER_TEST_CARD_SUCCESS,
        testId,
        cardIndex,
        correct,
        activeCard
      })
    )
    .catch(err =>
      dispatch({
        type: ANSWER_TEST_CARD_FAILURE,
        testId,
        cardIndex,
        correct,
        err
      })
    );
};

export const addRetest = (subjectId, testId) => dispatch => {
  dispatch({ type: ADD_RETEST_REQUEST, subjectId, testId });
  return api
    .addRetest(subjectId, testId)
    .then(test => {
      dispatch({ type: ADD_RETEST_SUCCESS, subjectId, testId, test });
      return test;
    })
    .catch(err =>
      dispatch({ type: ADD_RETEST_FAILURE, subjectId, testId, err })
    );
};

export const resetTests = () => ({
  type: RESET_TESTS
});
