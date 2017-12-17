import uuidv4 from "uuid/v4";
import Promise from "bluebird";

export const ADD_SUBJECT = "ADD_SUBJECT";
export const ADD_CARD = "ADD_CARD";
export const ADD_TEST = "ADD_TEST";
export const START_TEST = "START_TEST";
export const ANSWER_TEST_CARD = "ANSWER_CARD";
export const UPDATE_SUBJECT = "UPDATE_SUBJECT";

export const addSubject = () => ({
  type: ADD_SUBJECT
});

export const addCard = (subjectId, card) => ({
  type: ADD_CARD,
  card,
  subjectId
});

export const updateSubject = (subjectId, title) => ({
  type: UPDATE_SUBJECT,
  subjectId,
  title
});

export const addTest = subjectId => dispatch => {
  return new Promise((resolve, reject) => {
    const testId = uuidv4();
    dispatch({
      type: ADD_TEST,
      subjectId,
      testId
    });
    return resolve(testId);
  });
};

export const startTest = (subjectId, testId) => ({
  type: START_TEST,
  subjectId,
  testId
});

export const answerTestCard = (subjectId, testId, cardId, correct) => ({
  type: ANSWER_TEST_CARD,
  subjectId,
  testId,
  cardId,
  correct
});
