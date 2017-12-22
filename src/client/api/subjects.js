import axios from "axios";

import { apiUrl } from "./api";

export const addSubject = () => {
  return axios.post(apiUrl("/subject")).then(({ data }) => data);
};

export const updateSubjectTitle = (subjectId, title) => {
  return axios
    .put(apiUrl(`/subject/${subjectId}/title`), { title })
    .then(({ data }) => data);
};

export const getSubjects = () => {
  return axios.get(apiUrl("/subjects")).then(({ data }) => data);
};
