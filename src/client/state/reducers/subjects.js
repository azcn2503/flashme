import uuidv4 from "uuid/v4";

import * as actions from "../actions/subjects";

const testStatus = {
  NOT_STARTED: "NOT_STARTED",
  STARTED: "STARTED",
  COMPLETED: "COMPLETED",
  ABANDONED: "ABANDONED"
};

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
  cards,
  status: testStatus.NOT_STARTED,
  activeCardIndex: 0
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

    case actions.START_TEST:
      return {
        ...state,
        subjects: [
          ...state.subjects.map(subject => {
            if (subject.id === action.subjectId) {
              return {
                ...subject,
                tests: [
                  ...subject.tests.map(test => {
                    if (test.id === action.testId) {
                      return {
                        ...test,
                        status: testStatus.STARTED,
                        activeCardIndex: 0
                      };
                    } else {
                      return test;
                    }
                  })
                ]
              };
            } else {
              return subject;
            }
          })
        ]
      };

    case actions.ANSWER_TEST_CARD:
      return {
        ...state,
        subjects: [
          ...state.subjects.map(subject => {
            if (subject.id === action.subjectId) {
              return {
                ...subject,
                tests: [
                  ...subject.tests.map(test => {
                    if (test.id === action.testId) {
                      return {
                        ...test,
                        cards: [
                          ...test.cards.map(card => {
                            if (card.id === action.cardId) {
                              return {
                                ...card,
                                correct: action.correct
                              };
                            } else {
                              return card;
                            }
                          })
                        ],
                        activeCardIndex: test.activeCardIndex + 1,
                        status:
                          test.activeCardIndex + 1 === test.cards.length
                            ? testStatus.COMPLETED
                            : test.status
                      };
                    } else {
                      return test;
                    }
                  })
                ]
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
