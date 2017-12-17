import uuidv4 from "uuid/v4";
import Promise from "bluebird";

export const ADD_SUBJECT = "ADD_SUBJECT";
export const UPDATE_SUBJECT_TITLE = "UPDATE_SUBJECT_TITLE";

export const addSubject = () => {
  const subjectId = uuidv4();
  return {
    type: ADD_SUBJECT,
    subjectId
  };
};

export const updateSubjectTitle = (subjectId, title) => ({
  type: UPDATE_SUBJECT_TITLE,
  subjectId,
  title
});
