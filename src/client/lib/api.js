import axios from "axios";

const API_URL = "/api";

const apiUrl = route => API_URL + route;

export const getCards = subjectId => {
  return axios.get(apiUrl(`/cards/${subjectId}`));
};

export const addCard = (card, subjectId) => {
  return axios
    .post(apiUrl(`/card/${subjectId}`), card)
    .then(({ data }) => data);
};

export const addSubject = () => {
  return axios.post(apiUrl("/subject")).then(({ data }) => data);
};

export const updateSubjectTitle = (subjectId, title) => {
  return axios
    .put(apiUrl(`/subject/${subjectId}/title`), { title })
    .then(({ data }) => data);
};
