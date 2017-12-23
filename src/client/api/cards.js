import axios from "axios";

import { apiUrl } from "./api";

export const getCards = subjectId => {
  return axios
    .get(apiUrl(`/subject/${subjectId}/cards`))
    .then(({ data }) => data);
};

export const addCard = card => {
  return axios.post(apiUrl("/card"), { card }).then(({ data }) => data);
};
