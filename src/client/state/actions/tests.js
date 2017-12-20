import uuidv4 from "uuid/v4";

import * as api from "../../lib/api";

export const ADD_TEST = "ADD_TEST";
export const START_TEST = "START_TEST";
export const ANSWER_TEST_CARD = "ANSWER_TEST_CARD";

export const ADD_TEST_REQUEST = "ADD_TEST_REQUEST";
export const ADD_TEST_SUCCESS = "ADD_TEST_SUCCESS";
export const ADD_TEST_FAILURE = "ADD_TEST_FAILURE";

const stripCard = card => ({
  id: card.id,
  question: card.question,
  answer: card.answer
});

export const addTest = (subjectId, cards) => dispatch => {
  const strippedCards = cards.map(stripCard);
  dispatch({ type: ADD_TEST_REQUEST });
  return api
    .addTest(subjectId, strippedCards)
    .then(test => {
      dispatch({ type: ADD_TEST_SUCCESS, test });
      return test;
    })
    .catch(err => dispatch({ type: ADD_TEST_FAILURE, err }));
};

export const startTest = (subjectId, testId) => ({
  type: START_TEST,
  subjectId,
  testId
});

export const answerTestCard = (testId, cardId, correct) => ({
  type: ANSWER_TEST_CARD,
  subjectId,
  testId,
  cardId,
  correct
});
