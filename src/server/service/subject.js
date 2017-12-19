import uuidv4 from "uuid/v4";
import Promise from "bluebird";

export const createSubject = () =>
  Promise.resolve({
    id: uuidv4(),
    title: "New subject",
    created: Date.now(),
    updated: null
  });

export const updateSubjectTitle = (subjectId, title) =>
  Promise.resolve({
    id: subjectId,
    title
  });
