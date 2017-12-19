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
    case actions.ADD_SUBJECT_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.ADD_SUBJECT_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: {
          ...state.byId,
          [action.subject.id]: action.subject
        },
        allIds: [...state.allIds, action.subject.id]
      };

    case actions.ADD_SUBJECT_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err
      };

    case actions.UPDATE_SUBJECT_TITLE_REQUEST:
      return {
        ...state,
        requesting: true,
        byId: {
          ...state.byId,
          [action.subjectId]: {
            ...state.byId[action.subjectId],
            title: action.title
          }
        }
      };

    case actions.UPDATE_SUBJECT_TITLE_SUCCESS:
      console.log(action);
      return {
        ...state,
        requesting: false,
        error: null,
        byId: {
          ...state.byId,
          [action.subject.id]: {
            ...state.byId[action.subject.id],
            title: action.subject.title
          }
        }
      };

    case actions.UPDATE_SUBJECT_TITLE_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err
      };

    default:
      return state;
  }
};

export default reducer;
