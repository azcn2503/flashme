import uuidv4 from "uuid/v4";

import * as actions from "../actions/subjects";

const newCard = () => ({
  id: uuidv4(),
  created: Date.now(),
  updated: null
});

const newSubject = (title = "New subject") => ({
  title,
  id: uuidv4(),
  cards: [],
  tests: [],
  created: Date.now(),
  updated: null
});

const newTest = (id = uuidv4(), cards) => ({
  id,
  created: Date.now(),
  cards
});

const defaultState = {
  subjects: [newSubject("My first subject")],
  requesting: null,
  error: null
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.ADD_SUBJECT:
      return {
        ...state,
        subjects: [
          ...state.subjects,
          {
            ...action.subject,
            ...newSubject(action.title)
          }
        ]
      };

    case actions.ADD_CARD:
      return {
        ...state,
        subjects: [
          ...state.subjects.map(subject => {
            if (subject.id === action.subjectId) {
              return {
                ...subject,
                cards: [
                  ...subject.cards,
                  {
                    ...newCard(),
                    ...action.card
                  }
                ]
              };
            } else {
              return subject;
            }
          })
        ]
      };

    case actions.UPDATE_SUBJECT:
      return {
        ...state,
        subjects: [
          ...state.subjects.map(subject => {
            if (subject.id === action.subjectId) {
              return {
                ...subject,
                title: action.title
              };
            } else {
              return subject;
            }
          })
        ]
      };

    case actions.ADD_TEST:
      return {
        ...state,
        subjects: [
          ...state.subjects.map(subject => {
            if (subject.id === action.subjectId) {
              return {
                ...subject,
                tests: [...subject.tests, newTest(action.testId, subject.cards)]
              };
            } else {
              return subject;
            }
          })
        ]
      };

    default:
      return state;
  }
};

export default reducer;
