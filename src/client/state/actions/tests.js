import uuidv4 from "uuid/v4";

export const ADD_TEST = "ADD_TEST";
export const START_TEST = "START_TEST";
export const ANSWER_TEST_CARD = "ANSWER_TEST_CARD";

export const addTest = (subjectId, cards) => dispatch => {
  return new Promise((resolve, reject) => {
    const testId = uuidv4();
    dispatch({
      type: ADD_TEST,
      subjectId,
      testId,
      cards
    });
    return resolve(testId);
  });
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
