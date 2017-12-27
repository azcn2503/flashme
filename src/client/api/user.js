import axios from "axios";

import { apiUrl } from "./api";

/**
 * Login with a username and password
 * @param {string} username
 * @param {string} password
 */
export const login = (username, password) => {
  return axios
    .post(apiUrl("/login"), { username, password })
    .then(({ data }) => data);
};
