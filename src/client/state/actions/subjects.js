import * as api from "../../api/subjects";

export const GET_SUBJECTS_REQUEST = "GET_SUBJECTS_REQUEST";
export const GET_SUBJECTS_SUCCESS = "GET_SUBJECTS_SUCCESS";
export const GET_SUBJECTS_FAILURE = "GET_SUBJECTS_FAILURE";

export const GET_SUBJECT_REQUEST = "GET_SUBJECT_REQUEST";
export const GET_SUBJECT_SUCCESS = "GET_SUBJECT_SUCCESS";
export const GET_SUBJECT_FAILURE = "GET_SUBJECT_FAILURE";

export const UPDATE_SUBJECT_TITLE_REQUEST = "UPDATE_SUBJECT_TITLE_REQUEST";
export const UPDATE_SUBJECT_TITLE_SUCCESS = "UPDATE_SUBJECT_TITLE_SUCCESS";
export const UPDATE_SUBJECT_TITLE_FAILURE = "UPDATE_SUBJECT_TITLE_FAILURE";

export const ADD_SUBJECT_REQUEST = "ADD_SUBJECT_REQUEST";
export const ADD_SUBJECT_SUCCESS = "ADD_SUBJECT_SUCCESS";
export const ADD_SUBJECT_FAILURE = "ADD_SUBJECT_FAILURE";

export const REMOVE_SUBJECT_REQUEST = "REMOVE_SUBJECT_REQUEST";
export const REMOVE_SUBJECT_SUCCESS = "REMOVE_SUBJECT_SUCCESS";
export const REMOVE_SUBJECT_FAILURE = "REMOVE_SUBJECT_FAILURE";

export const RESET_SUBJECTS = "RESET_SUBJECTS";

export const addSubject = () => dispatch => {
  dispatch({ type: ADD_SUBJECT_REQUEST });
  return api
    .addSubject()
    .then(subject => dispatch({ type: ADD_SUBJECT_SUCCESS, subject }))
    .catch(err => dispatch({ type: ADD_SUBJECT_FAILURE, err }));
};

export const updateSubjectTitle = (subjectId, title) => dispatch => {
  dispatch({ type: UPDATE_SUBJECT_TITLE_REQUEST, subjectId, title });
  return api
    .updateSubjectTitle(subjectId, title)
    .then(subject => dispatch({ type: UPDATE_SUBJECT_TITLE_SUCCESS, subject }))
    .catch(err => dispatch({ type: UPDATE_SUBJECT_TITLE_FAILURE, err }));
};

export const getSubjects = () => dispatch => {
  dispatch({ type: GET_SUBJECTS_REQUEST });
  return api
    .getSubjects()
    .then(subjects => dispatch({ type: GET_SUBJECTS_SUCCESS, subjects }))
    .catch(err => dispatch({ type: GET_SUBJECTS_FAILURE, err }));
};

export const getSubject = subjectId => dispatch => {
  dispatch({ type: GET_SUBJECT_REQUEST, subjectId });
  return api
    .getSubject(subjectId)
    .then(subject => dispatch({ type: GET_SUBJECT_SUCCESS, subject }))
    .catch(err => dispatch({ type: GET_SUBJECT_FAILURE, err }));
};

export const removeSubject = subjectId => dispatch => {
  dispatch({ type: REMOVE_SUBJECT_REQUEST, subjectId });
  return api
    .removeSubject(subjectId)
    .then(() => dispatch({ type: REMOVE_SUBJECT_SUCCESS, subjectId }))
    .catch(err => dispatch({ type: REMOVE_SUBJECT_FAILURE, subjectId, err }));
};

export const resetSubjects = () => ({
  type: RESET_SUBJECTS
});
