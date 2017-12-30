import axios from "axios";

import { apiUrl } from "./api";

export const getTest = testId => {
  return axios.get(apiUrl(`/test/${testId}`)).then(({ data }) => data);
};

export const getTestsForSubject = subjectId => {
  return axios
    .get(apiUrl(`/tests/subject/${subjectId}`))
    .then(({ data }) => data);
};

export const addTest = (subjectId, cards) => {
  return axios
    .post(apiUrl(`/test/${subjectId}`), { cards })
    .then(({ data }) => data);
};

export const removeTest = testId => {
  return axios.delete(apiUrl(`/test/${testId}`)).then(({ data }) => data);
};
