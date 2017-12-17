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

const newTest = (testId, subjectId, cards) => ({
  id: testId,
  subjectId,
  cards,
  created: Date.now(),
  activeCardIndex: null,
  status: status.NOT_STARTED
});

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.ADD_TEST:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.testId]: newTest(
            action.testId,
            action.subjectId,
            action.cards
          )
        },
        allIds: [...state.allIds, action.testId]
      };

    default:
      return state;
  }
};

export default reducer;
