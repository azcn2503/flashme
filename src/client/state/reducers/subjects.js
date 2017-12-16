import uuidv4 from "uuid/v4";

import * as actions from "../actions/subjects";

const defaultState = {
  subjects: [],
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
            id: uuidv4(),
            title: action.title || `Subject ${state.subjects.length + 1}`
          }
        ]
      };

    default:
      return state;
  }
};

export default reducer;
