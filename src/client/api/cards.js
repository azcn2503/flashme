import axios from "axios";

import { apiUrl } from "./api";

export const getCards = subjectId => {
  return axios.get(apiUrl(`/cards/${subjectId}`));
};

export const addCard = (card, subjectId) => {
  return axios
    .post(apiUrl(`/card/${subjectId}`), card)
    .then(({ data }) => data);
};
