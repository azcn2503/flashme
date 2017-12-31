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

export const startTest = testId => {
  return axios.put(apiUrl(`/test/${testId}/start`)).then(({ data }) => data);
};

export const completeTest = testId => {
  return axios.put(apiUrl(`/test/${testId}/complete`)).then(({ data }) => data);
};

export const abandonTest = testId => {
  return axios.put(apiUrl(`/test/${testId}/abandon`)).then(({ data }) => data);
};

export const answerTestCard = (testId, cardIndex, correct) => {
  return axios
    .put(apiUrl(`/test/${testId}/answer`), { cardIndex, correct })
    .then(({ data }) => data);
};
