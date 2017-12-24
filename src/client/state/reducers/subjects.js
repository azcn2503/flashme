import { dropWhile, keyBy, omitBy } from "lodash";

import * as actions from "../actions/subjects";

const defaultState = {
  byId: {},
  allIds: [],
  requesting: null,
  error: null
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actions.GET_SUBJECTS_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.GET_SUBJECTS_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: keyBy(action.subjects, "id"),
        allIds: action.subjects.map(subject => subject.id)
      };

    case actions.GET_SUBJECTS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err
      };

    case actions.GET_SUBJECT_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.GET_SUBJECT_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: {
          ...state.byId,
          [action.subject.id]: action.subject
        },
        allIds: [...state.allIds.filter(id => id !== action.id), action.id]
      };

    case actions.GET_SUBJECT_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.err
      };

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

    case actions.REMOVE_SUBJECT_REQUEST:
      return {
        ...state,
        requesting: true
      };

    case actions.REMOVE_SUBJECT_SUCCESS:
      return {
        ...state,
        requesting: false,
        error: null,
        byId: omitBy(state.byId, subject => subject.id === action.subjectId),
        allIds: [...dropWhile(state.allIds, id => id === action.subjectId)]
      };

    case actions.REMOVE_SUBJECT_FAILURE:
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
