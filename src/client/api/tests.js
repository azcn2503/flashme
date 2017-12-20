import axios from "axios";

import { apiUrl } from "./api";

export const addTest = (subjectId, cards) => {
  return axios
    .post(apiUrl(`/test/${subjectId}`), { cards })
    .then(({ data }) => data);
};
