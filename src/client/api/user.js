import axios from "axios";

import { apiUrl } from "./api";

/**
 * Login with a username and password
 * @param {string} username
 * @param {string} password
 */
export const login = (username, password) => {
  return axios
    .post(apiUrl("/user/login"), { username, password })
    .then(({ data }) => data);
};

/**
 * Logout
 */
export const logout = () => {
  return axios.get(apiUrl("/user/logout")).then(({ data }) => data);
};

/**
 * Register a new user
 * @param {string} username
 * @param {string} password
 * @param {string} email
 */
export const register = (username, password, email) => {
  return axios
    .post(apiUrl("/user/register"), { username, password, email })
    .then(({ data }) => data)
    .catch(err => {
      throw new Error(err.response);
    });
};

/**
 * Get the currently logged in user
 */
export const getCurrentUser = () => {
  return axios.get(apiUrl("/user")).then(({ data }) => data);
};
