import axios from "axios";

import { apiUrl } from "./api";

/**
 * Get all cards for a specified subject
 * @param {string} subjectId
 */
export const getCards = subjectId => {
  return axios
    .get(apiUrl(`/subject/${subjectId}/cards`))
    .then(({ data }) => data);
};

/**
 * Add a card using the API
 * @param {object} card
 * @param {string} subjectId
 */
export const addCard = (card, subjectId) => {
  return axios
    .post(apiUrl("/card"), { card, subjectId })
    .then(({ data }) => data);
};

/**
 * Update a card using the API
 * @param {string} cardId
 * @param {object} card
 */
export const updateCard = (cardId, card) => {
  return axios
    .put(apiUrl(`/card/${cardId}`), { card })
    .then(({ data }) => data);
};

export const removeCard = cardId => {
  return axios.delete(apiUrl(`/card/${cardId}`)).then(({ data }) => data);
};
