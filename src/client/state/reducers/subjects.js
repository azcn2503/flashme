import uuidv4 from "uuid/v4";

import * as actions from "../actions/subjects";

const newSubject = (id = uuidv4(), title = "New subject") => ({
  id,
  title,
  created: Date.now(),
  updated: null
});

const defaultState = {
  byId: {},
  allIds: [],
  requesting: null,
  error: null
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.ADD_SUBJECT:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.subjectId]: newSubject(action.subjectId, action.title)
        },
        allIds: [...state.allIds, action.subjectId]
      };

    case actions.UPDATE_SUBJECT_TITLE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.subjectId]: {
            ...state.byId[action.subjectId],
            title: action.title
          }
        }
      };

    default:
      return state;
  }
};

export default reducer;
